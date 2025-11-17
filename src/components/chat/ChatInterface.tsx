import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { formatDistanceToNow } from "date-fns";
import type { Conversation, Message } from "@/services/chat.service";

const ChatInterface = () => {
  const {
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
  } = useChat();

  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (currentConversation && messages.length > 0) {
      const unreadMessageIds = messages
        .filter(msg => msg.status !== 'READ' && msg.senderId !== currentConversation.id)
        .map(msg => msg.id);
      
      if (unreadMessageIds.length > 0) {
        markAsRead(unreadMessageIds);
      }
    }
  }, [currentConversation, messages, markAsRead]);

  const handleSendMessage = () => {
    if (!messageText.trim() && !selectedFile) return;

    if (selectedFile) {
      // TODO: Upload file first, then send with attachment ID
      console.log("File upload not yet implemented");
      return;
    }

    sendMessage({
      type: 'TEXT',
      content: messageText.trim(),
    });

    setMessageText("");
    sendTypingIndicator(false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

    // Send typing indicator
    sendTypingIndicator(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getParticipantName = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(p => p.id !== conversation.id);
    if (!otherParticipant) return "Unknown";
    
    if (otherParticipant.role === 'NONPROFIT') {
      return otherParticipant.profile?.orgName || otherParticipant.email;
    }
    
    const firstName = otherParticipant.profile?.firstName || "";
    const lastName = otherParticipant.profile?.lastName || "";
    return `${firstName} ${lastName}`.trim() || otherParticipant.email;
  };

  const getParticipantAvatar = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(p => p.id !== conversation.id);
    return otherParticipant?.profile?.photoUrl || otherParticipant?.profile?.logoUrl || "";
  };

  const isUserOnline = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(p => p.id !== conversation.id);
    return otherParticipant ? onlineUsers.has(otherParticipant.id) : false;
  };

  const getCurrentTypers = () => {
    if (!currentConversation) return [];
    const typers = typingUsers.get(currentConversation.id);
    if (!typers) return [];
    
    return Array.from(typers);
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery.trim()) return true;
    const name = getParticipantName(conv).toLowerCase();
    const lastMsg = conv.lastMessage?.content?.toLowerCase() || "";
    return name.includes(searchQuery.toLowerCase()) || lastMsg.includes(searchQuery.toLowerCase());
  });

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "";
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'READ':
        return <Icon icon="mdi:check-all" className="text-blue-500" />;
      case 'DELIVERED':
        return <Icon icon="mdi:check-all" className="text-gray-400" />;
      case 'SENT':
        return <Icon icon="mdi:check" className="text-gray-400" />;
      case 'FAILED':
        return <Icon icon="mdi:alert-circle" className="text-red-500" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg border border-gray-200">
      {/* Left Sidebar - Conversations */}
      <div className="w-[400px] border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon icon="mynaui:envelope" className="text-2xl" />
              <h2 className="text-xl font-semibold">Message</h2>
            </div>
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-black/80 transition-colors text-sm">
              <Icon icon="material-symbols:add" className="text-lg" />
              Create
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Icon icon="iconamoon:search-light" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4 text-sm">
            <button className="pb-2 border-b-2 border-black font-medium">
              All ({conversations.length})
            </button>
            <button className="pb-2 text-gray-500">
              Favourites (0)
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-3"></div>
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Icon icon="mynaui:envelope" className="text-5xl mx-auto mb-3 opacity-30" />
              <p>No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  currentConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {getParticipantAvatar(conv) ? (
                        <img src={getParticipantAvatar(conv)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon icon="lucide:user" className="text-gray-400 text-2xl" />
                      )}
                    </div>
                    {isUserOnline(conv) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm truncate">{getParticipantName(conv)}</p>
                      <span className="text-xs text-gray-500">
                        {conv.lastMessage ? formatTime(conv.lastMessage.sentAt) : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage?.content || "Start a conversation"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="p-3 bg-yellow-50 border-t border-yellow-200 text-sm text-yellow-800 flex items-center gap-2">
            <Icon icon="material-symbols:wifi-off" />
            <span>Reconnecting...</span>
          </div>
        )}
      </div>

      {/* Right Side - Messages */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {getParticipantAvatar(currentConversation) ? (
                      <img src={getParticipantAvatar(currentConversation)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Icon icon="lucide:user" className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  {isUserOnline(currentConversation) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{getParticipantName(currentConversation)}</p>
                  <p className="text-xs text-gray-500">
                    {getCurrentTypers().length > 0 ? "Typing..." : 
                     isUserOnline(currentConversation) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {currentConversation.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-3">
                    {currentConversation.unreadCount} new messages
                  </span>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Icon icon="mynaui:envelope" className="text-6xl mx-auto mb-3 opacity-30" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMine = msg.sender.id !== currentConversation.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[60%] ${isMine ? 'order-2' : 'order-1'}`}>
                          {!isMine && (
                            <p className="text-xs text-gray-500 mb-1">
                              Admin · {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                          <div
                            className={`p-3 rounded-lg ${
                              isMine ? 'bg-white border border-gray-200' : 'bg-blue-100'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            {msg.attachment && (
                              <div className="mt-2 p-2 bg-white rounded flex items-center gap-2">
                                <Icon icon="material-symbols:description" className="text-xl text-blue-600" />
                                <div>
                                  <p className="text-xs font-medium">{msg.attachment.filename}</p>
                                  <p className="text-xs text-gray-500">Personal</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {isMine && (
                            <div className="flex items-center justify-end gap-1 mt-1">
                              {getMessageStatusIcon(msg.status)}
                              <span className="text-xs text-gray-500">
                                {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-5 border-t border-gray-200 bg-white">
              {selectedFile && (
                <div className="mb-3 p-2 bg-gray-100 rounded flex items-center gap-2">
                  <Icon icon="material-symbols:description" className="text-xl" />
                  <span className="text-sm flex-1">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)}>
                    <Icon icon="material-symbols:close" className="text-lg" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Icon icon="material-symbols:attach-file" className="text-xl text-gray-600" />
                </button>
                
                <input
                  type="text"
                  value={messageText}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() && !selectedFile}
                  className="bg-black text-white px-6 py-3 rounded-md hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Respond
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Icon icon="mynaui:envelope" className="text-8xl mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a conversation to start messaging</p>
              <p className="text-sm mt-2">Choose from your existing conversations on the left</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-5 right-5 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Icon icon="material-symbols:error" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;












