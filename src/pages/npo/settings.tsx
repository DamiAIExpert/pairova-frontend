import { Icon } from "@iconify/react";

const NonprofitSettings = () => {
  return (
    <div className="min-h-screen bg-white md:mx-5 my-5 rounded-md py-10 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Icon icon="lucide:lock-keyhole" className="text-4xl" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Notifications
                </label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-600">Receive email notifications for new applications</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Alerts
                </label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-gray-600">Get notified when someone applies to your jobs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Visibility */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Visibility</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-600">Make my organization profile public</span>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-600">Show contact information to applicants</span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Confirm new password"
                />
              </div>
              
              <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-black/80 transition-colors">
                Update Password
              </button>
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex justify-end gap-4">
            <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-black/80 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonprofitSettings;

