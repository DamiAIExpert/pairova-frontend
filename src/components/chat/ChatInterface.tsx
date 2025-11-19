import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useChat } from "@/hooks/useChat";
import { useUser } from "@/store/authStore";
import { formatDistanceToNow } from "date-fns";
import { applicationsService, type Application } from "@/services/applications.service";
import { toast } from "sonner";
import type { Conversation, Message } from "@/services/chat.service";

const ChatInterface = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const conversationIdParam = searchParams.get('conversationId');
  const currentUser = useUser();
  
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
    fetchConversations,
    createConversation,
  } = useChat();

  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [applicantSearchQuery, setApplicantSearchQuery] = useState("");
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle conversationId from URL query parameter
  const hasProcessedParam = useRef<string | null>(null);
  const isProcessingRef = useRef(false);
  
  useEffect(() => {
    if (!conversationIdParam) {
      hasProcessedParam.current = null;
      isProcessingRef.current = false;
      return;
    }

    // If we've already processed this conversationId and it's selected, don't do it again
    if (hasProcessedParam.current === conversationIdParam && currentConversation?.id === conversationIdParam) {
      return;
    }

    // If already processing, don't start another process
    if (isProcessingRef.current) {
      return;
    }

    // If conversation is already selected, just remove the query param
    if (currentConversation?.id === conversationIdParam) {
      setSearchParams({}, { replace: true });
      hasProcessedParam.current = conversationIdParam;
      return;
    }

    // Process the conversationId
    const processConversation = async () => {
      isProcessingRef.current = true;
      try {
        // Small delay to allow state updates from conversation creation to propagate
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Try to find conversation in current list first
        let conversation = conversations.find(c => c.id === conversationIdParam);
        
        if (conversation) {
          // Conversation found, select it using the conversation object to avoid API call
          console.log(`✅ Found conversation ${conversationIdParam} in list, selecting...`);
          await selectConversation(conversationIdParam, conversation);
          setSearchParams({}, { replace: true });
          hasProcessedParam.current = conversationIdParam;
        } else {
          // Conversation not found, try to refresh list if empty
          if (conversations.length === 0 && !loading) {
            console.log('📥 Conversations list is empty, fetching...');
            await fetchConversations();
            // Wait a bit for state to update after fetch
            await new Promise(resolve => setTimeout(resolve, 200));
            // Check again after state update
            conversation = conversations.find(c => c.id === conversationIdParam);
          }
          
          if (conversation) {
            // Found after fetch, select it
            console.log(`✅ Found conversation ${conversationIdParam} after fetch, selecting...`);
            await selectConversation(conversationIdParam, conversation);
            setSearchParams({}, { replace: true });
            hasProcessedParam.current = conversationIdParam;
          } else if (!loading) {
            // Conversation not found, try to select it anyway (it will fetch if needed)
            // This handles the case where a new conversation was just created
            // For newly created conversations, wait a bit for backend to finish setup
            console.log(`🔍 Conversation ${conversationIdParam} not in list, will try to fetch...`);
            // Increased delay to allow backend to finish creating participant records
            await new Promise(resolve => setTimeout(resolve, 1000));
            await selectConversation(conversationIdParam);
            setSearchParams({}, { replace: true });
            hasProcessedParam.current = conversationIdParam;
          }
        }
      } catch (error) {
        console.error('❌ Error processing conversation:', error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    processConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationIdParam, conversations.length, currentConversation?.id, selectConversation, loading, fetchConversations, setSearchParams]);

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

  const fetchApplicants = async () => {
    try {
      setLoadingApplicants(true);
      console.log('🔍 Fetching applicants for nonprofit...');
      const response = await applicationsService.getNonprofitApplications({ limit: 100 });
      console.log('✅ Received applications response:', response);
      
      if (!response || !response.applications) {
        console.warn('⚠️ Invalid response structure:', response);
        setApplicants([]);
        return;
      }

      // Get unique applicants (by applicantId)
      const uniqueApplicants = response.applications.reduce((acc, app) => {
        if (app.applicantId && !acc.find(a => a.applicantId === app.applicantId)) {
          acc.push(app);
        }
        return acc;
      }, [] as Application[]);
      
      console.log(`✅ Found ${uniqueApplicants.length} unique applicants from ${response.applications.length} applications`);
      setApplicants(uniqueApplicants);
      
      if (uniqueApplicants.length === 0) {
        toast.info('No applicants found. You need to have applicants for your posted jobs.');
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch applicants:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response?.data,
        stack: err.stack
      });
      
      let errorMessage = 'Failed to load applicants';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  // Fetch conversations on mount
  useEffect(() => {
    if (conversations.length === 0 && !loading) {
      console.log('📥 Fetching conversations on mount...');
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch applicants when modal opens
  useEffect(() => {
    if (showCreateModal) {
      fetchApplicants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCreateModal]);

  const handleCreateConversation = async (applicantId: string) => {
    try {
      setShowCreateModal(false);
      
      // Check if conversation already exists in local state
      let existingConversation = conversations.find(conv => 
        conv.participants && conv.participants.some(p => p.id === applicantId)
      );

      // If not found locally, check via API (backend will return existing conversation if found)
      if (!existingConversation) {
        try {
          // Try to create - backend will return existing conversation if one exists
          const result = await createConversation(applicantId);
          if (result && result.id) {
            // Check if this is a newly created conversation or an existing one
            // by checking if it's already in our list
            existingConversation = conversations.find(c => c.id === result.id);
            if (!existingConversation) {
              // It's a new conversation
              setSearchParams({ conversationId: result.id });
              await selectConversation(result.id, result);
              toast.success('Conversation created');
              return;
            } else {
              // It's an existing conversation that was returned
              setSearchParams({ conversationId: result.id });
              await selectConversation(result.id, result);
              toast.success('Opened existing conversation');
              return;
            }
          }
        } catch (createError: any) {
          // If creation fails, it might be because conversation already exists
          // Try to find it via API
          console.log('Conversation creation may have failed, checking for existing conversation...');
        }
      }

      // If we found an existing conversation, navigate to it
      if (existingConversation) {
        setSearchParams({ conversationId: existingConversation.id });
        await selectConversation(existingConversation.id, existingConversation);
        toast.success('Opened existing conversation');
        return;
      }

      // If we get here, something went wrong
      toast.error('Failed to create or find conversation');
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast.error(error.message || 'Failed to create conversation');
    }
  };

  const filteredApplicants = applicants.filter(app => {
    if (!applicantSearchQuery.trim()) return true;
    const name = `${app.applicant?.applicantProfile?.firstName || ''} ${app.applicant?.applicantProfile?.lastName || ''}`.trim().toLowerCase();
    const email = app.applicant?.email?.toLowerCase() || '';
    const query = applicantSearchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

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
    // Find the other participant (not the current user)
    const otherParticipant = conversation.participants?.find(p => p.id !== currentUser?.id);
    if (!otherParticipant) {
      // Fallback: use first participant email
      return conversation.participants?.[0]?.email || "Unknown";
    }
    
    if (otherParticipant.role === 'NONPROFIT' || otherParticipant.role === 'nonprofit') {
      return otherParticipant.profile?.orgName || otherParticipant.email;
    }
    
    const firstName = otherParticipant.profile?.firstName || "";
    const lastName = otherParticipant.profile?.lastName || "";
    return `${firstName} ${lastName}`.trim() || otherParticipant.email;
  };

  const getParticipantAvatar = (conversation: Conversation) => {
    // Find the other participant (not the current user)
    const otherParticipant = conversation.participants?.find(p => p.id !== currentUser?.id);
    return otherParticipant?.profile?.photoUrl || otherParticipant?.profile?.logoUrl || "";
  };

  const isUserOnline = (conversation: Conversation) => {
    // Find the other participant (not the current user)
    const otherParticipant = conversation.participants?.find(p => p.id !== currentUser?.id);
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
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-black/80 transition-colors text-sm"
            >
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

              <div className="flex items-center gap-3">
                {/* Call Icons */}
                <button
                  onClick={() => {
                    // TODO: Implement voice call functionality
                    toast.info("Voice call feature coming soon");
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Voice Call"
                >
                  <Icon icon="lucide:phone" className="text-gray-600 text-xl" />
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement video call functionality
                    toast.info("Video call feature coming soon");
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Video Call"
                >
                  <Icon icon="lucide:video" className="text-gray-600 text-xl" />
                </button>
                
                {/* Unread Count */}
                {currentConversation.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
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
                    // Check if message is from current user
                    const isMine = msg.sender.id === currentUser?.id;
                    const senderName = isMine 
                      ? "You" 
                      : (msg.sender.profile?.firstName && msg.sender.profile?.lastName
                          ? `${msg.sender.profile.firstName} ${msg.sender.profile.lastName}`.trim()
                          : msg.sender.profile?.orgName || msg.sender.email || "Unknown");
                    
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[60%] ${isMine ? 'order-2' : 'order-1'}`}>
                          {!isMine && (
                            <p className="text-xs text-gray-500 mb-1">
                              {senderName} · {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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
                  <div ref={messagesEndRef} data-messages-end />
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
                  Send
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

      {/* Create Conversation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Start New Conversation</h2>
                <p className="text-sm text-gray-600 mt-1">Select an applicant to start messaging</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Icon icon="mdi:close" className="text-xl text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Icon icon="iconamoon:search-light" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applicants by name or email..."
                  value={applicantSearchQuery}
                  onChange={(e) => setApplicantSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Applicants List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loadingApplicants ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  <span className="ml-3 text-gray-600">Loading applicants...</span>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Icon icon="mynaui:envelope" className="text-5xl mx-auto mb-3 opacity-30" />
                  {applicantSearchQuery ? (
                    <>
                      <p>No applicants found matching "{applicantSearchQuery}"</p>
                      <p className="text-sm mt-2">Try a different search term</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium mb-2">No applicants found</p>
                      <p className="text-sm">You need to have applicants for your posted jobs to start conversations.</p>
                      <button
                        onClick={() => {
                          setShowCreateModal(false);
                          navigate('/non-profit/recruitment-board');
                        }}
                        className="mt-4 text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        Go to Recruitment Board
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredApplicants.map((application) => {
                    const profile = application.applicant?.applicantProfile;
                    const fullName = profile
                      ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
                      : 'Anonymous';
                    const avatar = profile?.photoUrl;
                    const email = application.applicant?.email || 'No email';
                    const jobTitle = application.job?.title || 'Position';

                    return (
                      <button
                        key={application.id}
                        onClick={() => handleCreateConversation(application.applicantId)}
                        className="w-full p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left flex items-center gap-3 group"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {avatar ? (
                              <img src={avatar} alt={fullName} className="w-full h-12 object-cover" />
                            ) : (
                              <Icon icon="lucide:user" className="text-gray-400 text-2xl" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{fullName || 'Anonymous'}</h3>
                          <p className="text-sm text-gray-600 truncate">{email}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">{jobTitle}</p>
                        </div>
                        <Icon 
                          icon="mdi:chevron-right" 
                          className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" 
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;













