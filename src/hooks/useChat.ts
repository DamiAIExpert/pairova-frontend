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
  selectConversation: (conversationId: string, conversation?: Conversation) => void;
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
  const conversationsRef = useRef<Conversation[]>([]);

  /**
   * Fetch conversations from API
   */
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<{ conversations: Conversation[]; total?: number }>('/chat/conversations');
      const conversationsData = response.data.conversations || [];
      
      // Merge with existing conversations to preserve newly created ones that might not be in backend yet
      // Then sort by lastMessageAt (most recent first) to ensure recent chats are at the top
      setConversations(prev => {
        const existingIds = new Set(conversationsData.map(c => c.id));
        // Keep conversations from previous state that aren't in the fetched list
        // (e.g., newly created conversations that haven't been indexed yet)
        const preserved = prev.filter(c => !existingIds.has(c.id));
        const merged = [...conversationsData, ...preserved];
        
        // Sort by lastMessageAt (most recent first), then by createdAt
        // Handle both string and Date formats
        const sorted = merged.sort((a, b) => {
          const aTime = a.lastMessageAt 
            ? (typeof a.lastMessageAt === 'string' ? new Date(a.lastMessageAt).getTime() : a.lastMessageAt.getTime())
            : 0;
          const bTime = b.lastMessageAt 
            ? (typeof b.lastMessageAt === 'string' ? new Date(b.lastMessageAt).getTime() : b.lastMessageAt.getTime())
            : 0;
          if (aTime !== bTime) {
            return bTime - aTime; // DESC order - most recent first
          }
          // If lastMessageAt is the same or both null, sort by createdAt
          const aCreated = a.createdAt 
            ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt.getTime())
            : 0;
          const bCreated = b.createdAt 
            ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt.getTime())
            : 0;
          return bCreated - aCreated; // DESC order
        });
        
        conversationsRef.current = sorted;
        return sorted;
      });
      
      console.log(`✅ Fetched ${conversationsData.length} conversations`);
    } catch (err: any) {
      console.error('❌ Failed to fetch conversations:', err);
      // Don't set error for 401 - let the API client handle logout
      // But don't throw to prevent component crashes
      if (err.status !== 401) {
        setError(err.message || 'Failed to load conversations');
      }
      // Only clear on error if it's not a 401 (which might be temporary)
      if (err.status !== 401) {
        conversationsRef.current = [];
        setConversations([]); // Set empty array on error to prevent infinite loops
      }
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
      // Don't set error for 401 - let the API client handle logout
      if (err.status !== 401) {
        setError(err.message || 'Failed to load messages');
      }
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
      const response = await apiClient.post<Conversation>('/chat/conversations', {
        type: 'DIRECT',
        participantIds: [participantId],
      });
      
      const newConversation = response.data;
      if (!newConversation || !newConversation.id) {
        console.error('❌ Invalid conversation response:', response.data);
        setError('Invalid response from server');
        return null;
      }
      
      setConversations(prev => {
        const updated = [newConversation, ...prev];
        
        // Sort by lastMessageAt (most recent first), then by createdAt
        // Handle both string and Date formats
        const sorted = updated.sort((a, b) => {
          const aTime = a.lastMessageAt 
            ? (typeof a.lastMessageAt === 'string' ? new Date(a.lastMessageAt).getTime() : a.lastMessageAt.getTime())
            : 0;
          const bTime = b.lastMessageAt 
            ? (typeof b.lastMessageAt === 'string' ? new Date(b.lastMessageAt).getTime() : b.lastMessageAt.getTime())
            : 0;
          if (aTime !== bTime) {
            return bTime - aTime; // DESC order - most recent first
          }
          // If lastMessageAt is the same or both null, sort by createdAt
          const aCreated = a.createdAt 
            ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt.getTime())
            : 0;
          const bCreated = b.createdAt 
            ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt.getTime())
            : 0;
          return bCreated - aCreated; // DESC order
        });
        
        conversationsRef.current = sorted;
        return sorted;
      });
      console.log('✅ Created new conversation:', newConversation.id);
      return newConversation;
    } catch (err: any) {
      console.error('❌ Failed to create conversation:', err);
      // Don't set error for 401 - let the API client handle logout
      // But throw to let the caller handle it
      if (err.status === 401) {
        throw err; // Re-throw 401 to let API client handle logout
      }
      setError(err.message || 'Failed to create conversation');
      return null;
    }
  }, []);

  /**
   * Select a conversation
   */
  const selectConversation = useCallback(async (conversationId: string, providedConversation?: Conversation, retryCount = 0) => {
    // Leave previous conversation
    if (currentConversationRef.current) {
      chatService.leaveConversation(currentConversationRef.current);
    }

    // Use provided conversation if available, otherwise find in current list (check both ref and state)
    let conversation = providedConversation || 
                      conversationsRef.current.find(c => c.id === conversationId) ||
                      conversations.find(c => c.id === conversationId);
    
    // If conversation not found, fetch it from the API
    if (!conversation) {
      try {
        console.log(`🔍 Fetching conversation ${conversationId} from API...`);
        const response = await apiClient.get<Conversation>(`/chat/conversations/${conversationId}`);
        conversation = response.data;
        console.log(`✅ Fetched conversation:`, conversation);
        // Add to conversations list if not already there
        if (conversation) {
          setConversations(prev => {
            // Check if conversation already exists in the list
            if (!prev.find(c => c.id === conversationId)) {
              const updated = [conversation!, ...prev];
              conversationsRef.current = updated;
              console.log(`✅ Added conversation to list. Total: ${updated.length}`);
              return updated;
            }
            return prev;
          });
        }
      } catch (err: any) {
        console.error('❌ Failed to fetch conversation:', err);
        // If 401 permission error, check if it's a newly created conversation (race condition)
        if (err.status === 401) {
          const errorMessage = (err.message || '').toLowerCase();
          const isPermissionError = errorMessage.includes('not authorized') || 
                                   errorMessage.includes('permission denied') ||
                                   errorMessage.includes('access denied');
          
          if (isPermissionError) {
            // For newly created conversations, there might be a race condition
            // Retry after a short delay (max 2 retries)
            if (retryCount < 2) {
              console.log(`⏳ Retrying fetch for newly created conversation (attempt ${retryCount + 1}/2)...`);
              // Increase delay for retries to allow backend to finish participant setup
              await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Wait 1s, 2s
              return selectConversation(conversationId, undefined, retryCount + 1);
            }
            
            // After retries, if still failing, it's a real permission issue
            setError('You do not have permission to view this conversation');
            console.warn(`⚠️ Permission denied for conversation ${conversationId}`);
            return;
          }
          // Otherwise, it's a token expiration - let API client handle logout
          throw err;
        }
        // If fetching fails, try to fetch all conversations
        try {
          await fetchConversations();
          // Try to find it again after fetching all conversations
          conversation = conversationsRef.current.find(c => c.id === conversationId);
          if (!conversation) {
            console.error(`❌ Conversation ${conversationId} not found after fetching all conversations`);
            setError('Conversation not found');
            return;
          }
        } catch (fetchErr: any) {
          // If fetchConversations also fails with 401, let it handle logout
          if (fetchErr.status === 401) {
            throw fetchErr;
          }
          console.error('❌ Failed to fetch all conversations:', fetchErr);
          return;
        }
      }
    }

    if (conversation) {
      console.log(`✅ Selecting conversation ${conversationId}`);
      setCurrentConversation(conversation);
      currentConversationRef.current = conversationId;
      
      // Join new conversation
      chatService.joinConversation(conversationId);
      
      // Fetch messages
      fetchMessages(conversationId);
    } else {
      console.error(`❌ Conversation ${conversationId} not found and could not be fetched`);
    }
  }, [fetchMessages, fetchConversations, conversations]);

  /**
   * Send a message
   */
  const sendMessage = useCallback((data: Omit<SendMessageDto, 'conversationId'>) => {
    if (!currentConversation || !user) {
      console.error('No conversation selected or user not available');
      return;
    }

    const conversationId = currentConversation.id;
    
    // Create optimistic message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`, // Temporary ID
      conversationId,
      senderId: user.id,
      sender: {
        id: user.id,
        email: user.email || '',
        role: user.role || 'applicant',
        profile: {
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          orgName: (user as any).orgName,
          photoUrl: (user as any).photoUrl,
          logoUrl: (user as any).logoUrl,
        },
      },
      content: data.content || '',
      type: data.type || 'TEXT',
      status: 'SENT',
      sentAt: new Date().toISOString(),
      isDeleted: false,
    };

    // Optimistically add message to UI
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Immediately update conversation's lastMessageAt and re-sort to move it to top
    const now = new Date().toISOString();
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: optimisticMessage,
            lastMessageAt: now,
          };
        }
        return conv;
      });
      
      // Re-sort by lastMessageAt (most recent first), then by createdAt
      // Handle both string and Date formats
      const sorted = updated.sort((a, b) => {
        const aTime = a.lastMessageAt 
          ? (typeof a.lastMessageAt === 'string' ? new Date(a.lastMessageAt).getTime() : a.lastMessageAt.getTime())
          : 0;
        const bTime = b.lastMessageAt 
          ? (typeof b.lastMessageAt === 'string' ? new Date(b.lastMessageAt).getTime() : b.lastMessageAt.getTime())
          : 0;
        if (aTime !== bTime) {
          return bTime - aTime; // DESC order - most recent first
        }
        // If lastMessageAt is the same or both null, sort by createdAt
        const aCreated = a.createdAt 
          ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt.getTime())
          : 0;
        const bCreated = b.createdAt 
          ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt.getTime())
          : 0;
        return bCreated - aCreated; // DESC order
      });
      
      conversationsRef.current = sorted;
      return sorted;
    });
    
    // Scroll to bottom
    setTimeout(() => {
      const messagesEnd = document.querySelector('[data-messages-end]');
      messagesEnd?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Send via WebSocket
    chatService.sendMessage({
      ...data,
      conversationId,
    });
  }, [currentConversation, user]);

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
    let isCleaningUp = false;

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
      console.log('Current conversation ref:', currentConversationRef.current);
      console.log('Message conversation ID:', message.conversationId);
      
      // Add to messages if in current conversation
      if (message.conversationId === currentConversationRef.current) {
        setMessages(prev => {
          // Check if message already exists (replace optimistic message)
          const existingIndex = prev.findIndex(m => 
            m.id === message.id || 
            (m.id.startsWith('temp-') && m.content === message.content && Math.abs(new Date(m.sentAt).getTime() - new Date(message.sentAt).getTime()) < 5000)
          );
          
          if (existingIndex >= 0) {
            // Replace optimistic message with real one
            const updated = [...prev];
            updated[existingIndex] = message;
            return updated;
          }
          
          // Add new message
          return [...prev, message];
        });
        
        // Scroll to bottom when new message arrives
        setTimeout(() => {
          const messagesEnd = document.querySelector('[data-messages-end]');
          messagesEnd?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }

      // Update conversation's last message and re-sort to put recent chats at top
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: message,
              lastMessageAt: message.sentAt,
              unreadCount: message.conversationId === currentConversationRef.current ? 0 : (conv.unreadCount || 0) + 1,
            };
          }
          return conv;
        });
        
        // Re-sort by lastMessageAt (most recent first), then by createdAt
        // Handle both string and Date formats
        const sorted = updated.sort((a, b) => {
          const aTime = a.lastMessageAt 
            ? (typeof a.lastMessageAt === 'string' ? new Date(a.lastMessageAt).getTime() : a.lastMessageAt.getTime())
            : 0;
          const bTime = b.lastMessageAt 
            ? (typeof b.lastMessageAt === 'string' ? new Date(b.lastMessageAt).getTime() : b.lastMessageAt.getTime())
            : 0;
          if (aTime !== bTime) {
            return bTime - aTime; // DESC order - most recent first
          }
          // If lastMessageAt is the same or both null, sort by createdAt
          const aCreated = a.createdAt 
            ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt.getTime())
            : 0;
          const bCreated = b.createdAt 
            ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt.getTime())
            : 0;
          return bCreated - aCreated; // DESC order
        });
        
        conversationsRef.current = sorted;
        return sorted;
      });
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
    if (!isInitialized.current) {
      fetchConversations();
    }

    // Cleanup on unmount
    return () => {
      isCleaningUp = true;
      if (currentConversationRef.current) {
        chatService.leaveConversation(currentConversationRef.current);
      }
      chatService.removeAllListeners();
      // Only disconnect if we're actually cleaning up (not just React StrictMode double-invocation)
      // Check if socket is still connected before disconnecting
      const currentSocket = chatService.getSocket();
      if (currentSocket && currentSocket.connected) {
        chatService.disconnect();
      }
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











