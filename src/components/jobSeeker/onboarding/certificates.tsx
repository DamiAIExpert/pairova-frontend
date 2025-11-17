import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { apiClient } from "@/services/api";

interface CertificateEntry {
  id: string;
  file: File | null;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  progress: number;
  status?: 'uploading' | 'uploaded' | 'error';
  error?: string;
}

const Certificates = () => {
  const navigate = useNavigate();
  const { setStepCompleted } = useOnboardingStore();
  const [certificateEntries, setCertificateEntries] = useState<CertificateEntry[]>([
    { id: "1", file: null, name: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", progress: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load existing certificates
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const certifications = await apiClient.get('/profiles/certifications').then(r => r.data).catch(() => []);
        if (Array.isArray(certifications) && certifications.length > 0) {
          setCertificateEntries(certifications.map((cert: any) => ({
            id: cert.id || Math.random().toString(),
            file: null,
            name: cert.name || "",
            issuer: cert.issuer || "",
            issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : "",
            credentialId: cert.credentialId || "",
            credentialUrl: cert.credentialUrl || "",
            progress: 100,
            status: 'uploaded',
          })));
        }
      } catch (err) {
        console.error("Failed to load certificates:", err);
      }
    };

    loadCertificates();
  }, []);

  const addCertificateEntry = () => {
    setCertificateEntries(prev => [...prev, {
      id: Math.random().toString(),
      file: null,
      name: "",
      issuer: "",
      issueDate: "",
      credentialId: "",
      credentialUrl: "",
      progress: 0,
    }]);
  };

  const removeCertificateEntry = (id: string) => {
    setCertificateEntries(prev => prev.filter(cert => cert.id !== id));
  };

  const updateCertificateEntry = (id: string, field: keyof CertificateEntry, value: string) => {
    setCertificateEntries(prev =>
      prev.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const handleFileChange = async (certId: string, file: File | null) => {
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError("File must be PDF, JPG, or PNG");
      return;
    }

    setError("");
    updateCertificateEntry(certId, 'file', file as any);
    updateCertificateEntry(certId, 'status', 'uploading' as any);
    updateCertificateEntry(certId, 'progress', 5 as any);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ url: string; publicId?: string }>(
        '/uploads/simple',
        formData
      );

      const uploadedUrl = response.data.url;
      updateCertificateEntry(certId, 'credentialUrl', uploadedUrl);
      updateCertificateEntry(certId, 'progress', 100 as any);
      updateCertificateEntry(certId, 'status', 'uploaded' as any);
    } catch (err: any) {
      console.error('Failed to upload certificate file:', err);
      updateCertificateEntry(certId, 'progress', 0 as any);
      updateCertificateEntry(certId, 'status', 'error' as any);
      updateCertificateEntry(certId, 'error', err.response?.data?.message || 'Upload failed' as any);
      setError(err.response?.data?.message || 'Failed to upload certificate file. Please try again.');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Save certificates to backend
      const certificatesToSave = certificateEntries
        .filter(cert => cert.credentialUrl || cert.name || cert.issuer)
        .map(cert => ({
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issueDate || undefined,
          credentialId: cert.credentialId,
          credentialUrl: cert.credentialUrl,
        }));

      if (certificatesToSave.length > 0) {
        // Delete existing certificates first, then create new ones
        const existingCerts = await apiClient.get('/profiles/certifications').then(r => r.data).catch(() => []) as any[];
        for (const cert of existingCerts) {
          await apiClient.delete(`/profiles/certifications/${cert.id}`).catch(() => {});
        }

        // Create new certificates
        for (const cert of certificatesToSave) {
          await apiClient.post('/profiles/certifications', cert);
        }
      }

      // Mark this step as completed
      setStepCompleted('certificates');

      // Navigate to next step
      navigate('/seeker/create-account/other-attachments');
    } catch (err: any) {
      console.error("Failed to save certificates:", err);
      setError(err.response?.data?.message || "Failed to save certificates. Please try again.");
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
          onClick={() => navigate('/seeker/create-account/skill')}
        />
        <h2 className="font-semibold text-xl">Form</h2>

        <div className="bg-white border border-black/30 my-5 rounded-md relative pb-[100px]">
          <div className="py-5 px-5 border-b border-black/30 flex items-center justify-between">
            <h4 className="font-semibold">Certificates</h4>
            <button
              onClick={addCertificateEntry}
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

          <div className="px-5 py-5 space-y-5">
            {certificateEntries.map((cert, index) => (
              <div key={cert.id} className="border border-black/30 rounded-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium">Certificate {index + 1}</h5>
                  {certificateEntries.length > 1 && (
                    <button
                      onClick={() => removeCertificateEntry(cert.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <Icon icon="mdi:close" className="text-xl" />
                    </button>
                  )}
                </div>

                {/* File Upload */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Certificate File</label>
                  <div className="w-full border border-black/30 rounded-md text-center cursor-pointer py-8 hover:bg-gray-50 transition-colors">
                    <label htmlFor={`cert-file-${cert.id}`} className="cursor-pointer">
                      <input
                        ref={(el) => { fileInputRefs.current[cert.id] = el; }}
                        type="file"
                        className="hidden"
                        id={`cert-file-${cert.id}`}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(cert.id, e.target.files?.[0] || null)}
                        disabled={loading}
                      />
                      <div className="w-full py-6">
                        <Icon
                          icon="material-symbols:upload-rounded"
                          className="text-4xl text-center w-[100px] mx-auto cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">
                          Drag and Drop or <span className="text-black font-medium">Choose File</span> for upload
                        </span>
                        <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (Max 5MB)</p>
                      </div>
                    </label>
                  </div>

                  {/* File Upload Progress/Status */}
                  {cert.file && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{cert.file.name}</span>
                        {cert.status === 'uploaded' && (
                          <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                        )}
                        {cert.status === 'error' && (
                          <Icon icon="mdi:close-circle" className="text-red-600 text-xl" />
                        )}
                      </div>
                      {cert.progress > 0 && cert.progress < 100 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${cert.progress}%` }}
                          />
                        </div>
                      )}
                      {cert.error && (
                        <p className="text-xs text-red-600 mt-1">{cert.error}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Certificate Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Certificate Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertificateEntry(cert.id, 'name', e.target.value)}
                      className="py-2 px-4 border border-black/30 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter certificate name"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertificateEntry(cert.id, 'issuer', e.target.value)}
                      className="py-2 px-4 border border-black/30 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter issuing organization"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Issue Date</label>
                    <input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => updateCertificateEntry(cert.id, 'issueDate', e.target.value)}
                      className="py-2 px-4 border border-black/30 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Credential ID</label>
                    <input
                      type="text"
                      value={cert.credentialId}
                      onChange={(e) => updateCertificateEntry(cert.id, 'credentialId', e.target.value)}
                      className="py-2 px-4 border border-black/30 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter credential ID (optional)"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-black/30 py-4 px-5 absolute bottom-0 right-0 w-full flex items-center justify-between bg-white">
            <div>
              <button
                onClick={() => navigate('/seeker/create-account/skill')}
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
                    Saving...
                  </>
                ) : (
                  'Save and Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;




