import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";

const NonprofitDeleteAccount = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" to confirm');
      return;
    }

    if (!confirm("Are you absolutely sure? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");
      
      // TODO: Call API to delete account
      // await NonprofitService.deleteAccount();
      
      console.log("⚠️ Account deletion requested (API not implemented yet)");
      
      // Logout and redirect
      alert("Account deletion feature coming soon. For now, please contact support to delete your account.");
      // logout();
      // navigate("/");
    } catch (err: any) {
      console.error("❌ Failed to delete account:", err);
      setError(err.message || "Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:mx-5 my-5 rounded-md py-10 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Icon icon="mynaui:x-octagon" className="text-4xl text-red-600" />
          <h1 className="text-3xl font-bold text-red-600">Delete Account</h1>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Icon icon="material-symbols:warning" className="text-3xl text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-red-900 mb-2">Warning: This action is permanent!</h2>
              <p className="text-red-800 mb-3">
                Deleting your account will permanently remove all your data, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-red-800">
                <li>Your organization profile and information</li>
                <li>All job postings you've created</li>
                <li>All applications and applicant data</li>
                <li>Messages and communication history</li>
                <li>Settings and preferences</li>
              </ul>
              <p className="mt-3 font-semibold text-red-900">
                This action cannot be undone. Please make sure you have downloaded any data you need before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Alternatives */}
        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Before you go...</h2>
          <p className="text-gray-600 mb-4">
            Consider these alternatives instead of deleting your account:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
              <Icon icon="material-symbols:pause-circle-outline" className="text-2xl text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Deactivate your account temporarily</p>
                <p className="text-sm text-gray-600">Your account will be hidden but can be restored later</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
              <Icon icon="material-symbols:visibility-off-outline" className="text-2xl text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Make your profile private</p>
                <p className="text-sm text-gray-600">Hide your organization from public view</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
              <Icon icon="material-symbols:help-outline" className="text-2xl text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Contact support</p>
                <p className="text-sm text-gray-600">We're here to help resolve any issues you're experiencing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        <div className="border-2 border-red-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Confirm Account Deletion</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Type DELETE here"
              disabled={isDeleting}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/non-profit")}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={confirmText !== "DELETE" || isDeleting}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Icon icon="mynaui:x-octagon" className="text-xl" />
                  Delete My Account Permanently
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Need help or have questions?{" "}
            <button 
              onClick={() => navigate("/non-profit/help-center")}
              className="text-blue-600 hover:underline font-medium"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NonprofitDeleteAccount;

