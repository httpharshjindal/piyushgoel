"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import type { CardData } from "@/app/lib/default-data";

const fieldClass = "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm";

interface FanCardDialogProps {
  open: boolean;
  draft: CardData | null;
  onChange: (card: CardData) => void;
  onClose: () => void;
  onSave: (card: CardData) => void;
}

export function FanCardDialog({ open, draft, onChange, onClose, onSave }: FanCardDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error: uploadError, reset: resetUpload } = useCloudinaryUpload();
  const [localUploading, setLocalUploading] = useState(false);

  if (!open || !draft) return null;

  function update<K extends keyof CardData>(field: K, value: CardData[K]) {
    onChange({ ...draft, [field]: value });
  }

  function updateMeta(key: string, value: unknown) {
    onChange({ ...draft, metadata: { ...draft.metadata, [key]: value } });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalUploading(true);
    resetUpload();

    const result = await upload(file);
    if (result) {
      update("imageUrl", result.url);
    }
    setLocalUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const meta = draft.metadata || {};
  const tag = (meta.tag as string) || "";
  const score = (meta.score as number) || 0;
  const isUploading = uploading || localUploading;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-lg bg-paper p-5 shadow-2xl">
        <h2 className="font-serif text-4xl font-bold text-oxblood">Fan Card Editor</h2>
        <p className="mt-1 text-sm text-muted">Edit the fan card details below.</p>

        <form
          className="mt-4 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(draft);
          }}
        >
          <label className="grid gap-1 text-sm">
            Project Name
            <input
              className={fieldClass}
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              required
            />
          </label>

          <label className="grid gap-1 text-sm">
            Tag / Category
            <input
              className={fieldClass}
              placeholder="e.g. Web App, Brand Identity"
              value={tag}
              onChange={(e) => updateMeta("tag", e.target.value)}
            />
          </label>

          <label className="grid gap-1 text-sm">
            Score
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              className={fieldClass}
              value={score}
              onChange={(e) => updateMeta("score", Number(e.target.value))}
            />
          </label>

          <div className="grid gap-2">
            <label className="grid gap-1 text-sm">
              Image URL
              <input
                className={fieldClass}
                placeholder="https://..."
                value={draft.imageUrl || ""}
                onChange={(e) => update("imageUrl", e.target.value)}
              />
            </label>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">or</span>
              <button
                type="button"
                disabled={isUploading}
                className="rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold hover:bg-white disabled:opacity-50"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? "Uploading..." : "Upload Image"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {uploadError ? (
              <p className="text-xs text-red-500">{uploadError}</p>
            ) : null}

            {draft.imageUrl ? (
              <div className="mt-1 flex items-center gap-3">
                <Image
                  src={draft.imageUrl}
                  alt="Preview"
                  width={48}
                  height={48}
                  className="rounded border border-ink/10 object-cover"
                />
                <span className="text-xs text-muted truncate">{draft.imageUrl}</span>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded-full border border-ink/10 px-5 py-3 font-bold"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="rounded-full bg-oxblood px-5 py-3 font-bold text-white disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
