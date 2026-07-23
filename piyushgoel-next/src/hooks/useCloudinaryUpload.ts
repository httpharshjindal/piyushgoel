"use client";

import { useState, useCallback } from "react";

interface UploadState {
  url: string;
  publicId: string;
}

interface UseCloudinaryUploadReturn {
  upload: (file: File) => Promise<UploadState | null>;
  uploading: boolean;
  error: string | null;
  reset: () => void;
}

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<UploadState | null> => {
    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/cloudinary", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploading(false);
      return { url: data.url, publicId: data.publicId };
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      setUploading(false);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setUploading(false);
  }, []);

  return { upload, uploading, error, reset };
}
