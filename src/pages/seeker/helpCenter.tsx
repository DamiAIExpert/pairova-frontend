import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { supportService } from "@/services/support.service";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

interface FAQItem {
  question: string;
  answer: string;
}

const HelpCenterPage = () => {
  const _navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const faqButtonRef = useRef<HTMLButtonElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });

  const [formData, setFormData] = useState({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email?.split('@')[0] || "",
    email: user?.email || "",
    phone: user?.phone || "",
    messageType: "Support",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const faqs: FAQItem[] = [
    {
      question: "How do I create a profile?",
      answer: "Go to your Profile section and click on 'Edit Account' to fill in your personal information, work experience, education, and skills. Make sure to upload a professional photo and complete all sections for the best results.",
    },
    {
      question: "How do I apply for jobs?",
      answer: "Browse available jobs on the job finder page. When you find a job you're interested in, click on it to view details, then click 'Apply Now' to submit your application. Make sure your profile is complete before applying.",
    },
    {
      question: "How do I track my applications?",
      answer: "Go to 'Job Reminder' in your profile sidebar and click on the 'Track Jobs' tab. Here you can see all your applications and their current status (Pending, Reviewed, Shortlisted, etc.).",
    },
    {
      question: "How do I save jobs?",
      answer: "When viewing a job listing, click the 'Save' button to add it to your saved jobs. You can view all your saved jobs in the 'Job Reminder' section under the 'Saved Jobs' tab.",
    },
    {
      question: "How do I update my privacy settings?",
      answer: "Go to Settings > Privacy Settings in your profile sidebar. Here you can control which parts of your profile are visible to employers and how your data is used for job recommendations.",
    },
    {
      question: "How do I change my password?",
      answer: "Go to Settings in your profile sidebar. Enter your current password and create a new password, then click 'Save Password'.",
    },
    {
      question: "What should I include in my profile?",
      answer: "Include your work experience, education, certifications, skills, and a professional bio. The more complete your profile, the better job matches you'll receive. Don't forget to upload a professional photo!",
    },
    {
      question: "How do I delete my account?",
      answer: "Go to the bottom of your profile sidebar and click 'Delete Account'. Please note that this action is permanent and cannot be undone.",
    },
  ];

  const messageTypes = [
    "Support",
    "How do I create a new account",
    "Account verification process",
    "Delete my account",
    "Technical Issue",
    "Feature Request",
    "Report a Problem",
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Update indicator position when tab changes
  useEffect(() => {
    const updateIndicator = () => {
      if (faqButtonRef.current && contactButtonRef.current) {
        const activeButton = activeTab === "faq" ? faqButtonRef.current : contactButtonRef.current;
        const container = activeButton.parentElement;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const buttonRect = activeButton.getBoundingClientRect();
          const leftOffset = buttonRect.left - containerRect.left;
          
          setIndicatorStyle({
            width: buttonRect.width,
            left: leftOffset,
          });
        }
      }
    };

    // Initial measurement
    updateIndicator();

    // Update on window resize
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.messageType || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSending(true);

    try {
      await supportService.submitContactForm(formData);

      toast.success("Message sent successfully! We'll get back to you within 24 hours.");

      // Reset form
      setFormData({
        fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email?.split('@')[0] || "",
        email: user?.email || "",
        phone: user?.phone || "",
        messageType: "Support",
        message: "",
      });
    } catch (error: any) {
      console.error("Failed to submit contact form:", error);
      toast.error(error?.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen mx-5 my-5">
        <h2 className="text-2xl font-semibold py-5">Help Center</h2>

        {/* Tabs and Search */}
        <div className="flex items-center justify-between mb-6">
          {/* Switch/Toggle Component */}
          <div className="relative inline-flex bg-gray-100 rounded-full p-1">
            {/* Sliding indicator - white background that slides */}
            {indicatorStyle.width > 0 && (
              <div
                className="absolute top-1 bottom-1 rounded-full bg-white transition-all duration-300 ease-in-out"
                style={{
                  width: `${indicatorStyle.width}px`,
                  left: `${indicatorStyle.left}px`,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              />
            )}
            <button
              ref={faqButtonRef}
              onClick={() => setActiveTab("faq")}
              type="button"
              className={`relative px-6 py-2 rounded-full font-medium transition-colors duration-300 z-10 ${
                activeTab === "faq"
                  ? "text-black"
                  : "text-gray-600"
              }`}
            >
              FAQ
            </button>
            <button
              ref={contactButtonRef}
              onClick={() => setActiveTab("contact")}
              type="button"
              className={`relative px-6 py-2 rounded-full font-medium transition-colors duration-300 z-10 ${
                activeTab === "contact"
                  ? "text-black"
                  : "text-gray-600"
              }`}
            >
              Contact form
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Icon
              icon="iconamoon:search-light"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"
            />
            <input
              type="text"
              placeholder="Search.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black w-64"
            />
          </div>
        </div>

        {activeTab === "faq" ? (
          /* FAQ Tab */
          <div className="bg-white rounded-md px-5 md:px-8 py-10">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
              <p className="text-gray-600">
                Find answers to common questions about Pairova features, services and setup. For further assistance our support system is always ready to help.
              </p>
            </div>

            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>No FAQs found matching your search.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-black/30 rounded-md overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-left pr-4">{faq.question}</span>
                      <Icon
                        icon={openIndex === index ? "mdi:minus" : "mdi:plus"}
                        className="text-xl text-gray-600 flex-shrink-0"
                      />
                    </button>
                    {openIndex === index && (
                      <div className="px-5 pb-5 pt-2 border-t border-gray-200">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Contact Form Tab */
          <div className="bg-white rounded-md px-5 md:px-8 py-10">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Pairova Contact Form</h3>
              <p className="text-gray-600">
                Contact us through the message button below. We'll message promptly to your inquiries and feedback.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Promotional Image */}
              <div className="lg:w-1/2 relative">
                <div className="relative h-full min-h-[500px] rounded-lg overflow-hidden">
                  <img
                    src="/Images/contact.png"
                    alt="Pairova Contact"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Text */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-sm mb-2">
                      Pairova allows non profit organizations promote job roles for users
                    </p>
                    <div className="flex items-center gap-2">
                      <img
                        src="/Images/logo.AVIF"
                        alt="Pairova Logo"
                        className="h-6 w-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:w-1/2">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="messageType" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <select
                      id="messageType"
                      value={formData.messageType}
                      onChange={(e) => setFormData({ ...formData, messageType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white pr-10"
                      required
                    >
                      {messageTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <Icon
                      icon="mdi:chevron-down"
                      className="absolute right-3 top-[42px] text-gray-400 pointer-events-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="messageText" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Text
                    </label>
                    <textarea
                      id="messageText"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      placeholder="Enter your message here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={sending}
                      className="bg-black text-white px-8 py-3 rounded-md hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenterPage;
