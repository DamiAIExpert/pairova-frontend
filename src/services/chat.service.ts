// Chat service for WebSocket messaging
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: {
    id: string;
    email: string;
    role: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      orgName?: string;
      photoUrl?: string;
      logoUrl?: string;
    };
  };
  type: 'TEXT' | 'FILE' | 'IMAGE' | 'SYSTEM';
  content?: string;
  attachment?: {
    id: string;
    filename: string;
    url: string;
    size: number;
    mimeType: string;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: {
      firstName?: string;
      lastName?: string;
      orgName?: string;
    };
  };
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  sentAt: string;
  isDeleted: boolean;
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    email: string;
    role: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      orgName?: string;
      photoUrl?: string;
      logoUrl?: string;
    };
  }>;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageDto {
  conversationId: string;
  type: 'TEXT' | 'FILE' | 'IMAGE';
  content?: string;
  attachmentId?: string;
  replyToId?: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

class ChatService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to chat WebSocket server
   */
  connect(token: string): Socket {
    this.token = token;
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
    return this.socket;
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to chat server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from chat server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('error', (error) => {
      console.error('🔴 Socket error:', error);
    });
  }

  /**
   * Disconnect from chat server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
      console.log('Disconnected from chat server');
    }
  }

  /**
   * Join a conversation room
   */
  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('join_conversation', { conversationId });
      console.log(`📥 Joined conversation: ${conversationId}`);
    }
  }

  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('leave_conversation', { conversationId });
      console.log(`📤 Left conversation: ${conversationId}`);
    }
  }

  /**
   * Send a message
   */
  sendMessage(data: SendMessageDto) {
    if (this.socket) {
      this.socket.emit('send_message', data);
      console.log('📤 Sent message:', data);
    }
  }

  /**
   * Mark messages as read
   */
  markAsRead(conversationId: string, messageIds: string[]) {
    if (this.socket) {
      this.socket.emit('mark_as_read', { conversationId, messageIds });
    }
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(conversationId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { conversationId, isTyping });
    }
  }

  /**
   * Listen for new messages
   */
  onMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  /**
   * Listen for message updates (status changes)
   */
  onMessageUpdate(callback: (data: { messageId: string; status: Message['status'] }) => void) {
    if (this.socket) {
      this.socket.on('message_status_update', callback);
    }
  }

  /**
   * Listen for typing indicators
   */
  onTyping(callback: (data: TypingIndicator) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  /**
   * Listen for online users
   */
  onOnlineUsers(callback: (userIds: string[]) => void) {
    if (this.socket) {
      this.socket.on('online_users', callback);
    }
  }

  /**
   * Listen for user online status
   */
  onUserOnline(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user_online', callback);
    }
  }

  /**
   * Listen for user offline status
   */
  onUserOffline(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user_offline', callback);
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

export const chatService = new ChatService();

