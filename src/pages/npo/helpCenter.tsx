import { Icon } from "@iconify/react";
import { useState } from "react";

const NonprofitHelpCenter = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create a job posting?",
      answer: "Click the 'Create Job' button on your dashboard, fill in the job details including title, description, requirements, and submit. Your job will be published immediately."
    },
    {
      question: "How do I review applications?",
      answer: "Go to the 'Recruitment Board' section from the sidebar. There you can see all applications, review applicant profiles, and update application statuses."
    },
    {
      question: "Can I edit my organization profile?",
      answer: "Yes! Go to Settings > Profile Settings to update your organization information, logo, mission statement, and other details."
    },
    {
      question: "How do I delete a job posting?",
      answer: "On the Jobs page, click the delete icon on any job card. Confirm the deletion when prompted. Note: Deleting a job will also archive all its applications."
    },
    {
      question: "What information do applicants see?",
      answer: "Applicants can see your organization name, logo, mission statement, job details, and contact information (if you've enabled it in Settings)."
    },
    {
      question: "How do I contact an applicant?",
      answer: "You can see applicant contact information in their application details on the Recruitment Board. Direct messaging feature is coming soon!"
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white md:mx-5 my-5 rounded-md py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Icon icon="lucide:file-question-mark" className="text-4xl" />
          <h1 className="text-3xl font-bold">Help Center</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <div className="flex items-center gap-3 py-3 px-4 border border-gray-300 rounded-lg">
            <Icon icon="iconamoon:search-light" className="text-xl text-gray-400" />
            <input
              type="text"
              className="w-full focus:outline-none bg-transparent"
              placeholder="Search for help..."
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  <Icon
                    icon={openFaq === index ? "mdi:chevron-up" : "mdi:chevron-down"}
                    className="text-2xl text-gray-600"
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Contact our support team and we'll get back to you within 24 hours.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icon icon="mynaui:envelope" className="text-2xl text-gray-600" />
              <div>
                <p className="font-medium">Email Support</p>
                <a href="mailto:support@pairova.com" className="text-blue-600 hover:underline">
                  support@pairova.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Icon icon="material-symbols:phone-in-talk" className="text-2xl text-gray-600" />
              <div>
                <p className="font-medium">Phone Support</p>
                <a href="tel:+2348000000000" className="text-blue-600 hover:underline">
                  +234 800 000 0000
                </a>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full bg-black text-white px-6 py-3 rounded-md hover:bg-black/80 transition-colors">
            <Icon icon="mynaui:envelope" className="inline mr-2" />
            Send us a message
          </button>
        </div>

        {/* Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Icon icon="material-symbols:article-outline" className="text-3xl mb-2" />
            <h3 className="font-semibold mb-1">Documentation</h3>
            <p className="text-sm text-gray-600">Learn how to use Pairova</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Icon icon="material-symbols:video-library-outline" className="text-3xl mb-2" />
            <h3 className="font-semibold mb-1">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Watch step-by-step guides</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Icon icon="material-symbols:forum-outline" className="text-3xl mb-2" />
            <h3 className="font-semibold mb-1">Community Forum</h3>
            <p className="text-sm text-gray-600">Ask the community</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonprofitHelpCenter;

