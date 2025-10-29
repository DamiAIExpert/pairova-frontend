import { useState } from 'react';
import { apiClient } from '@/services/api';

interface UploadResponse {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  publicId: string;
  size: number;
  mimeType: string;
  fileType: string;
}

interface UseFileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  kind?: string; // 'logo', 'avatar', 'resume', etc.
  onSuccess?: (url: string, response: UploadResponse) => void;
  onError?: (error: string) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxSize = 2 * 1024 * 1024, // 2MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
    kind = 'general',
    onSuccess,
    onError,
  } = options;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const validateFile = (file: File): string | null => {
    // Validate file size
    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return `File size must be less than ${sizeMB}MB`;
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions = allowedTypes
        .map(type => type.split('/')[1])
        .join(', ');
      return `File must be one of: ${allowedExtensions}`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onError?.(validationError);
      return null;
    }

    try {
      setUploading(true);
      setError('');
      setUploadProgress(0);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend
      const response = await apiClient.post<UploadResponse>(
        `/profiles/uploads?kind=${kind}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        }
      );

      const uploadedFileUrl = response.data.url;
      setUploadedUrl(uploadedFileUrl);
      setUploadProgress(100);

      console.log(`✅ File uploaded successfully to Cloudinary:`, uploadedFileUrl);
      onSuccess?.(uploadedFileUrl, response.data);

      return uploadedFileUrl;
    } catch (err: any) {
      console.error('Failed to upload file:', err);
      const errorMessage =
        err.response?.data?.message || 'Failed to upload file. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadedUrl('');
    setError('');
    setUploadProgress(0);
  };

  return {
    uploading,
    error,
    uploadedUrl,
    uploadProgress,
    uploadFile,
    resetUpload,
  };
};

