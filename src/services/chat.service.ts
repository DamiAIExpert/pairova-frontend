// Chat service for WebSocket messaging
import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
const SOCKET_URL = `${API_URL}/chat`; // Connect to /chat namespace

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
  private _token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to chat WebSocket server
   */
  connect(token: string): Socket {
    this._token = token;
    
    // Remove Bearer prefix if present (guard expects raw token in auth.token)
    const rawToken = token.startsWith('Bearer ') ? token.replace('Bearer ', '') : token;
    const bearerToken = `Bearer ${rawToken}`;
    
    this.socket = io(SOCKET_URL, {
      auth: { token: rawToken }, // Pass raw token in auth object
      query: { token: rawToken }, // Also pass in query string as fallback
      extraHeaders: {
        Authorization: bearerToken, // Also pass in header as fallback
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      forceNew: true, // Force new connection
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
      // Only log disconnect if it wasn't intentional (not during cleanup)
      if (reason !== 'io client disconnect') {
        console.log('❌ Disconnected from chat server:', reason);
      }
    });

    this.socket.on('connect_error', (error) => {
      // Only log connection errors if socket is still trying to connect
      // Suppress errors during cleanup/disconnect
      if (this.socket && this.socket.active) {
        console.error('🔴 Connection error:', error);
        console.error('🔴 Error details:', {
          message: error.message,
          description: (error as any).description,
          context: (error as any).context,
          type: (error as any).type,
          data: (error as any).data,
        });
        console.error('🔴 Socket URL:', SOCKET_URL);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
        }
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
      // Disconnect silently (intentional disconnect, no need to log)
      this.socket.disconnect();
      this.socket = null;
      this._token = null;
    }
  }

  /**
   * Join a conversation room
   */
  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('joinConversation', { conversationId });
      console.log(`📥 Joined conversation: ${conversationId}`);
    }
  }

  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('leaveConversation', { conversationId });
      console.log(`📤 Left conversation: ${conversationId}`);
    }
  }

  /**
   * Send a message
   */
  sendMessage(data: SendMessageDto) {
    if (this.socket) {
      this.socket.emit('sendMessage', data);
      console.log('📤 Sent message:', data);
    }
  }

  /**
   * Mark messages as read
   */
  markAsRead(conversationId: string, messageIds: string[]) {
    if (this.socket) {
      this.socket.emit('markAsRead', { conversationId, messageIds });
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
      this.socket.on('newMessage', callback);
    }
  }

  /**
   * Listen for message updates (status changes)
   */
  onMessageUpdate(callback: (data: { messageId: string; status: Message['status'] }) => void) {
    if (this.socket) {
      this.socket.on('messageStatusUpdate', callback);
    }
  }

  /**
   * Listen for typing indicators
   */
  onTyping(callback: (data: TypingIndicator) => void) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  /**
   * Listen for online users
   */
  onOnlineUsers(callback: (userIds: string[]) => void) {
    if (this.socket) {
      this.socket.on('onlineUsers', callback);
    }
  }

  /**
   * Listen for user online status
   */
  onUserOnline(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('userOnline', callback);
    }
  }

  /**
   * Listen for user offline status
   */
  onUserOffline(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('userOffline', callback);
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











