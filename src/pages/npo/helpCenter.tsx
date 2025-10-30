import { Icon } from "@iconify/react";
import { useState } from "react";
import { supportService } from "@/services/support.service";
import { toast } from "sonner";

const NonprofitHelpCenter = () => {
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");
  const [openFaq, setOpenFaq] = useState<number | null>(1); // Default first one open
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    messageType: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const faqs = [
    {
      question: "How do I create and post a job opening?",
      answer: "To create a job posting, navigate to your dashboard and click 'Post a Job' or 'Create Job'. Fill in the required details including job title, description, requirements, location, and employment type. Once submitted, your job will be published and visible to qualified candidates immediately."
    },
    {
      question: "Is Pairova free for nonprofit organizations?",
      answer: "Yes! Pairova offers free access to nonprofit organizations to help them find talented individuals passionate about social impact. We believe in supporting nonprofits in their mission to make a difference by connecting them with the right talent at no cost."
    },
    {
      question: "How do I review and manage applications?",
      answer: "Access your Recruitment Board from the sidebar menu to view all applications organized by status (Applied, Under Review, Interview, Offered). You can review candidate profiles, update application statuses, search for specific applicants, and track your hiring pipeline all in one place."
    },
    {
      question: "Can I edit my organization's profile information?",
      answer: "Absolutely! Go to Settings from your dashboard sidebar. There you can update your organization name, logo, contact information, mission statement, values, address, and other profile details. Changes are saved immediately and reflected on your job postings."
    },
    {
      question: "How secure is my organization's data on Pairova?",
      answer: "We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. Your data is stored securely in certified data centers with multiple redundancy layers. We implement multi-factor authentication, regular security audits, and continuous monitoring to protect your information."
    },
    {
      question: "What information can job seekers see about my organization?",
      answer: "Job seekers can view your organization name, logo, mission statement, values, location, industry, organization size, and the specific details of your job postings. You control what information is visible through your Settings page. Contact information is only shared with candidates you choose to engage with."
    },
  ];

  const messageTypes = [
    "General Support",
    "Technical Issue",
    "Account Setup Help",
    "Job Posting Question",
    "Billing & Pricing",
    "Feature Request",
    "Report a Problem",
    "Partnership Inquiry",
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    searchQuery.trim() === "" ||
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        fullName: "",
        email: "",
        phone: "",
        messageType: "",
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
    <div className="min-h-screen bg-white md:mx-5 my-5 rounded-md py-10 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">Help Center</h1>

        {/* Tabs and Search */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-[#E3E3E3] rounded-[999px] py-1 px-1">
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-6 py-3 rounded-[999px] transition-colors ${
                activeTab === "faq"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600"
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-6 py-3 rounded-[999px] transition-colors ${
                activeTab === "contact"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Contact form
            </button>
          </div>

          {/* Search - only visible on FAQ tab */}
          {activeTab === "faq" && (
            <div className="flex items-center gap-3 py-2 px-4 border border-gray-300 rounded-lg w-80">
              <Icon icon="iconamoon:search-light" className="text-xl text-gray-400" />
              <input
                type="text"
                className="w-full focus:outline-none bg-transparent"
                placeholder="Search.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* FAQ Tab Content */}
        {activeTab === "faq" && (
          <div>
            {/* FAQ Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">
                Find answers to common questions about posting jobs, managing applications, and using Pairova's features.
                <br />
                For further assistance, our support team is always ready to help you succeed.
              </p>
            </div>

            {/* FAQ Accordions - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-medium pr-4">{faq.question}</span>
                    <Icon
                      icon={openFaq === index ? "ic:round-minus" : "ic:round-plus"}
                      className="text-2xl text-black flex-shrink-0"
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Icon icon="iconamoon:search-light" className="text-6xl mx-auto mb-4 opacity-30" />
                <p>No FAQs found matching your search</p>
              </div>
            )}
          </div>
        )}

        {/* Contact Form Tab Content */}
        {activeTab === "contact" && (
          <div>
            {/* Contact Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Contact Our Support Team</h2>
              <p className="text-gray-600">
                Have a question or need assistance? Fill out the form below and our support team will respond to your inquiry within 24 hours.
              </p>
            </div>

            {/* Contact Form Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Image */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden h-[600px]">
                <img
                  src="/Images/help-center-team.jpg"
                  alt="Third Team"
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => {
                    // Fallback to a gradient if image doesn't load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.style.background = 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-white p-2 rounded">
                        <img 
                          src="/Images/logo-black.png" 
                          alt="Pairova" 
                          className="h-6 w-auto"
                          onError={(e) => {
                            // Fallback to text if logo doesn't load
                            e.currentTarget.style.display = 'none';
                            const textSpan = document.createElement('span');
                            textSpan.textContent = 'P';
                            textSpan.className = 'text-2xl font-bold text-black';
                            e.currentTarget.parentElement!.appendChild(textSpan);
                          }}
                        />
                      </div>
                      <span className="text-white font-semibold text-lg">pairova</span>
                    </div>
                    <p className="text-white text-xl font-medium leading-relaxed">
                      Connecting nonprofits with talented individuals passionate about making a social impact
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Ayra Gbolade"
                    required
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="ayragbolade@gmail.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="+1 817-2345-221"
                    required
                  />
                </div>

                {/* Message Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <select
                    value={formData.messageType}
                    onChange={(e) => setFormData({ ...formData, messageType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white cursor-pointer"
                    required
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      paddingRight: '40px'
                    }}
                  >
                    <option value="">Select inquiry type...</option>
                    {messageTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Text Area */}
                <div>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Enter Text"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NonprofitHelpCenter;
