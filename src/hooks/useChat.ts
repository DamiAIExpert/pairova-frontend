// useChat hook for managing chat state and WebSocket connection
import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, type Message, type Conversation, type SendMessageDto } from '@/services/chat.service';
import { apiClient, authUtils } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

interface UseChatReturn {
  conversations: Conversation[];
  messages: Message[];
  currentConversation: Conversation | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  typingUsers: Map<string, Set<string>>;
  loading: boolean;
  error: string | null;
  
  // Actions
  selectConversation: (conversationId: string) => void;
  sendMessage: (data: Omit<SendMessageDto, 'conversationId'>) => void;
  sendTypingIndicator: (isTyping: boolean) => void;
  markAsRead: (messageIds: string[]) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  createConversation: (participantId: string) => Promise<Conversation | null>;
}

export function useChat(): UseChatReturn {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isInitialized = useRef(false);
  const currentConversationRef = useRef<string | null>(null);

  /**
   * Fetch conversations from API
   */
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<{ conversations: Conversation[] }>('/chat/conversations');
      setConversations(response.data.conversations || []);
      console.log(`✅ Fetched ${response.data.conversations?.length || 0} conversations`);
    } catch (err: any) {
      console.error('❌ Failed to fetch conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch messages for a conversation
   */
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<{ messages: Message[] }>(`/chat/conversations/${conversationId}/messages`);
      setMessages(response.data.messages || []);
      console.log(`✅ Fetched ${response.data.messages?.length || 0} messages for conversation ${conversationId}`);
    } catch (err: any) {
      console.error('❌ Failed to fetch messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new conversation
   */
  const createConversation = useCallback(async (participantId: string): Promise<Conversation | null> => {
    try {
      setError(null);
      const response = await apiClient.post<{ conversation: Conversation }>('/chat/conversations', {
        participantIds: [participantId],
      });
      
      const newConversation = response.data.conversation;
      setConversations(prev => [newConversation, ...prev]);
      console.log('✅ Created new conversation:', newConversation.id);
      return newConversation;
    } catch (err: any) {
      console.error('❌ Failed to create conversation:', err);
      setError(err.message || 'Failed to create conversation');
      return null;
    }
  }, []);

  /**
   * Select a conversation
   */
  const selectConversation = useCallback((conversationId: string) => {
    // Leave previous conversation
    if (currentConversationRef.current) {
      chatService.leaveConversation(currentConversationRef.current);
    }

    // Find and set new conversation
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      currentConversationRef.current = conversationId;
      
      // Join new conversation
      chatService.joinConversation(conversationId);
      
      // Fetch messages
      fetchMessages(conversationId);
    }
  }, [conversations, fetchMessages]);

  /**
   * Send a message
   */
  const sendMessage = useCallback((data: Omit<SendMessageDto, 'conversationId'>) => {
    if (!currentConversation) {
      console.error('No conversation selected');
      return;
    }

    chatService.sendMessage({
      ...data,
      conversationId: currentConversation.id,
    });
  }, [currentConversation]);

  /**
   * Send typing indicator
   */
  const sendTypingIndicator = useCallback((isTyping: boolean) => {
    if (!currentConversation) return;
    chatService.sendTypingIndicator(currentConversation.id, isTyping);
  }, [currentConversation]);

  /**
   * Mark messages as read
   */
  const markAsRead = useCallback((messageIds: string[]) => {
    if (!currentConversation) return;
    chatService.markAsRead(currentConversation.id, messageIds);
  }, [currentConversation]);

  /**
   * Initialize WebSocket connection
   */
  useEffect(() => {
    if (!user || isInitialized.current) return;

    const token = authUtils.getToken();
    if (!token) {
      console.warn('⚠️ No auth token found, cannot connect to chat');
      return;
    }

    console.log('🔌 Initializing chat WebSocket connection...');
    const socket = chatService.connect(token);
    isInitialized.current = true;

    // Connection status
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Chat WebSocket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Chat WebSocket disconnected');
    });

    // New message received
    chatService.onMessage((message) => {
      console.log('📩 New message received:', message);
      
      // Add to messages if in current conversation
      if (message.conversationId === currentConversationRef.current) {
        setMessages(prev => [...prev, message]);
      }

      // Update conversation's last message
      setConversations(prev => prev.map(conv => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            lastMessage: message,
            unreadCount: message.conversationId === currentConversationRef.current ? 0 : conv.unreadCount + 1,
          };
        }
        return conv;
      }));
    });

    // Message status update
    chatService.onMessageUpdate(({ messageId, status }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
    });

    // Typing indicators
    chatService.onTyping((data) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const conversationTypers = newMap.get(data.conversationId) || new Set();
        
        if (data.isTyping) {
          conversationTypers.add(data.userId);
        } else {
          conversationTypers.delete(data.userId);
        }
        
        if (conversationTypers.size === 0) {
          newMap.delete(data.conversationId);
        } else {
          newMap.set(data.conversationId, conversationTypers);
        }
        
        return newMap;
      });
    });

    // Online users
    chatService.onOnlineUsers((userIds) => {
      setOnlineUsers(new Set(userIds));
    });

    chatService.onUserOnline((userId) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    chatService.onUserOffline((userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Fetch initial conversations
    fetchConversations();

    // Cleanup on unmount
    return () => {
      if (currentConversationRef.current) {
        chatService.leaveConversation(currentConversationRef.current);
      }
      chatService.removeAllListeners();
      chatService.disconnect();
      isInitialized.current = false;
    };
  }, [user, fetchConversations]);

  return {
    conversations,
    messages,
    currentConversation,
    isConnected,
    onlineUsers,
    typingUsers,
    loading,
    error,
    selectConversation,
    sendMessage,
    sendTypingIndicator,
    markAsRead,
    fetchConversations,
    fetchMessages,
    createConversation,
  };
}











