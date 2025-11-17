import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuthStore } from "@/store/authStore";
import { AuthService } from "@/services/auth.service";
import { apiClient } from "@/services/api";

interface FileItem {
  id: string;
  file: File | null;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'uploaded' | 'error';
  url?: string;
  uploadId?: string; // Backend upload record ID
  error?: string;
}

const OtherAttachments = () => {
  const navigate = useNavigate();
  const { setStepCompleted, resetProgress } = useOnboardingStore();
  const { user, setUser } = useAuthStore();
  const [attachedFiles, setAttachedFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  // Load existing attachments on mount
  useEffect(() => {
    const loadAttachments = async () => {
      try {
        // Note: Backend doesn't have a GET endpoint for uploads by kind yet,
        // but we can check if there's a way to retrieve them
        // For now, we'll just upload new files and they'll be persisted
        // If needed, we can add a GET endpoint later or use a different approach
      } catch (err) {
        console.error("Failed to load attachments:", err);
      }
    };

    loadAttachments();
  }, []);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    // Match backend validation: image/jpeg, image/jpg, image/png, image/svg+xml, application/pdf
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/svg+xml',
    ];
    if (!allowedTypes.includes(file.type)) {
      return "File must be PDF, JPG, PNG, or SVG";
    }

    return null;
  };

  const uploadFile = async (fileItem: FileItem) => {
    if (!fileItem.file) return;

    try {
      const formData = new FormData();
      formData.append('file', fileItem.file);

      // Use the profiles/uploads endpoint with kind=attachment to persist to database
      const response = await apiClient.post<{ id: string; url: string; publicId?: string; mimeType?: string; sizeBytes?: number }>(
        '/profiles/uploads?kind=attachment',
        formData
      );

      const uploadData = response.data;
      setAttachedFiles(prev =>
        prev.map(item =>
          item.id === fileItem.id
            ? { 
                ...item, 
                url: uploadData.url, 
                progress: 100, 
                status: 'uploaded',
                // Store the upload ID for potential deletion later
                uploadId: uploadData.id 
              }
            : item
        )
      );
    } catch (err: any) {
      console.error('Failed to upload file:', err);
      setAttachedFiles(prev =>
        prev.map(item =>
          item.id === fileItem.id
            ? { ...item, status: 'error', progress: 100, error: err.response?.data?.message || 'Upload failed' }
            : item
        )
      );
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
    }
  };

  const handleFiles = (files: File[]) => {
    setError("");
    files.forEach((file) => {
      const validation = validateFile(file);
      if (validation) {
        setError(validation);
        return;
      }

      const newItem: FileItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
        file,
        name: file.name,
        size: file.size,
        progress: 5,
        status: 'uploading',
      };
      setAttachedFiles(prev => [...prev, newItem]);
      uploadFile(newItem);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const removeFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Mark this step as completed
      setStepCompleted('other-attachments');

      // ✅ MARK ONBOARDING AS COMPLETE
      await AuthService.completeOnboarding();
      
      // Update user in auth store
      if (user) {
        setUser({ ...user, hasCompletedOnboarding: true });
      }

      // Reset onboarding progress for next time
      resetProgress();

      // Navigate to privacy settings (next step after onboarding)
      navigate('/seeker/create-account/privacy-settings');
    } catch (err: any) {
      console.error("Failed to complete onboarding:", err);
      setError(err.response?.data?.message || "Failed to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="my-8">
        <Icon
          icon="line-md:arrow-left-circle"
          className="text-2xl my-3 md:hidden cursor-pointer hover:text-gray-600"
          onClick={() => navigate('/seeker/create-account/certificates')}
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative pb-[100px]">
          <div className="py-5 px-5 border-b border-black/30 flex items-center justify-between">
            <h4 className="font-semibold">Other Attachments</h4>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black text-white w-8 h-8 rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              <Icon icon="mdi:plus" className="text-xl" />
            </button>
          </div>

          {error && (
            <div className="mx-5 mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="px-5 py-5">
            {/* Drag and Drop Zone */}
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="w-full border border-black/30 rounded-md text-center cursor-pointer py-12 hover:bg-gray-50 transition-colors mb-5"
            >
              <label htmlFor="attachments" className="cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  id="attachments"
                  accept=".pdf,.jpg,.jpeg,.png,.svg"
                  multiple
                  onChange={handleFileInputChange}
                  disabled={loading}
                />
                <div className="w-full py-6">
                  <Icon
                    icon="material-symbols:upload-rounded"
                    className="text-4xl text-center w-[100px] mx-auto cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">
                    Drag and Drop or <span className="text-black font-medium">Choose Files</span> for upload
                  </span>
                  <p className="text-xs text-gray-500 mt-2">Resume, Portfolio, etc. (PDF, JPG, PNG, SVG - Max 10MB each)</p>
                </div>
              </label>
            </div>

            {/* Uploaded Files List */}
            {attachedFiles.length > 0 && (
              <div className="space-y-3">
                {attachedFiles.map((item) => (
                  <div key={item.id} className="border border-black/30 rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Icon icon="mdi:file-document" className="text-2xl text-gray-600" />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {(item.size / 1024).toFixed(2)} KB
                            {item.status === 'uploading' && ` • ${item.progress}% uploaded`}
                            {item.status === 'uploaded' && ' • Uploaded'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(item.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        <Icon icon="mdi:close" className="text-xl" />
                      </button>
                    </div>
                    {item.progress > 0 && item.progress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                    {item.error && (
                      <p className="text-xs text-red-600 mt-1">{item.error}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
            <div>
              <button
                onClick={() => navigate('/seeker/create-account/certificates')}
                className="py-2 px-7 rounded-md border border-black/30 hidden md:block hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Back
              </button>
            </div>
            <div>
              <button
                onClick={handleSubmit}
                className={`bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  loading ? 'opacity-50' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Completing Setup...
                  </>
                ) : (
                  '✓ Complete Setup'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherAttachments;

