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
    kind: _kind = 'general',
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

      // Upload to backend using simple upload endpoint
      console.log('📤 Uploading file to backend...');
      console.log('📦 File details:', { name: file.name, size: file.size, type: file.type });
      
      const response = await apiClient.post<any>(
        `/uploads/simple`,
        formData,
        {
          // Don't set Content-Type for FormData - browser sets it automatically with boundary
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
              console.log(`📊 Upload progress: ${progress}%`);
            }
          },
        }
      );
      
      console.log('✅ Upload response:', response);
      console.log('✅ Upload response data:', response.data);

      // Check if response has the expected structure
      if (!response.data || !response.data.url) {
        throw new Error('Invalid response format: missing url');
      }

      const uploadedFileUrl = response.data.url;
      setUploadedUrl(uploadedFileUrl);
      setUploadProgress(100);

      console.log(`✅ File uploaded successfully to Cloudinary:`, uploadedFileUrl);
      onSuccess?.(uploadedFileUrl, response.data);

      return uploadedFileUrl;
    } catch (err: any) {
      console.error('Failed to upload file:', err);
      // Handle API client error format (fetch-based, not axios)
      const errorMessage =
        err.message || 
        err.details?.message || 
        (typeof err === 'string' ? err : 'Failed to upload file. Please try again.');
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

