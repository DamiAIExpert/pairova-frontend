import { Icon } from "@iconify/react";

const NonprofitMessages = () => {
  return (
    <div className="min-h-screen bg-white md:mx-5 my-5 rounded-md py-10 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Icon icon="mynaui:envelope" className="text-4xl" />
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        {/* Empty State */}
        <div className="text-center py-20">
          <div className="text-gray-300 mb-4">
            <Icon icon="mynaui:envelope" className="text-8xl mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500 mb-6">
            Your messages with applicants and volunteers will appear here
          </p>
        </div>

        {/* Coming Soon Badge */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Icon icon="material-symbols:info-outline" className="text-2xl text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">Messaging Feature Coming Soon</p>
              <p className="text-sm text-blue-700">
                We're working on a messaging system to help you communicate with applicants directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonprofitMessages;

