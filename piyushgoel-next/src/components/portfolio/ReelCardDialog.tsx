"use client";

import { useState, useRef, useEffect } from "react";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import Image from "next/image";
import type { CardData } from "@/app/lib/default-data";

interface ReelCardDialogProps {
  open: boolean;
  draft: CardData | null;
  onChange: (card: CardData) => void;
  onClose: () => void;
  onSave: (card: CardData) => void;
}

export function ReelCardDialog({ open, draft, onChange, onClose, onSave }: ReelCardDialogProps) {
  const { upload, uploading, error: uploadError } = useCloudinaryUpload();
  const [localImageUrl, setLocalImageUrl] = useState(draft?.imageUrl || "");
  const [localRedirectUrl, setLocalRedirectUrl] = useState(draft?.url || "");
  const [zoom, setZoom] = useState((draft?.metadata?.cropZoom as number) || 1);
  const [posX, setPosX] = useState((draft?.metadata?.cropX as number) || 0);
  const [posY, setPosY] = useState((draft?.metadata?.cropY as number) || 0);
  const [showCrop, setShowCrop] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (draft) {
      setLocalImageUrl(draft.imageUrl || "");
      setLocalRedirectUrl(draft.url || "");
      setZoom((draft.metadata?.cropZoom as number) || 1);
      setPosX((draft.metadata?.cropX as number) || 0);
      setPosY((draft.metadata?.cropY as number) || 0);
    }
  }, [draft]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !draft) return null;
  const currentDraft = draft;

  function updateDraft(imageUrl: string, redirectUrl: string) {
    setLocalImageUrl(imageUrl);
    setLocalRedirectUrl(redirectUrl);
    onChange({
      ...currentDraft,
      imageUrl,
      url: redirectUrl,
      metadata: { ...currentDraft.metadata, cropZoom: zoom, cropX: posX, cropY: posY },
    } as CardData);
  }

  function updateCrop(z: number, x: number, y: number) {
    setZoom(z);
    setPosX(x);
    setPosY(y);
    onChange({
      ...currentDraft,
      imageUrl: localImageUrl,
      url: localRedirectUrl,
      metadata: { ...currentDraft.metadata, cropZoom: z, cropX: x, cropY: y },
    } as CardData);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    if (result) {
      setZoom(1); setPosX(0); setPosY(0);
      setLocalImageUrl(result.url);
      onChange({
        ...currentDraft,
        imageUrl: result.url,
        url: localRedirectUrl,
        metadata: { ...currentDraft.metadata, cropZoom: 1, cropX: 0, cropY: 0 },
      } as CardData);
    }
  }

  async function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (!file) return;
        const result = await upload(file);
        if (result) {
          setZoom(1); setPosX(0); setPosY(0);
          setLocalImageUrl(result.url);
          onChange({
            ...currentDraft,
            imageUrl: result.url,
            url: localRedirectUrl,
            metadata: { ...currentDraft.metadata, cropZoom: 1, cropX: 0, cropY: 0 },
          } as CardData);
        }
        return;
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={onClose}>
      <div ref={dialogRef} className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-lg bg-paper p-6 shadow-2xl" onClick={(e) => e.stopPropagation()} onPaste={handlePaste}>
        <h2 className="font-serif text-3xl font-bold text-oxblood">Edit Reel Card</h2>
        <p className="mt-1 text-sm text-muted">Set the thumbnail and where it redirects on click.</p>

        {localImageUrl && (
          <>
            <div className="relative mx-auto mt-4 w-48 h-[270px] overflow-hidden rounded-[10px] bg-black/5">
              <Image
                src={localImageUrl}
                alt=""
                fill
                draggable={false}
                className="select-none pointer-events-none"
                style={{
                  objectFit: "cover",
                  objectPosition: `${50 + posX}% ${50 + posY}%`,
                  transform: `scale(${zoom})`,
                }}
              />
            </div>
            <button
              type="button"
              className="mt-2 w-full text-xs text-muted underline underline-offset-2 hover:text-ink"
              onClick={() => setShowCrop(!showCrop)}
            >
              {showCrop ? "Hide" : "Adjust"} size &amp; position
            </button>
            {showCrop && (
              <div className="mt-3 grid gap-2.5 rounded-lg border border-ink/10 bg-white/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">Crop Controls</span>
                  <button type="button" className="rounded-full border border-ink/10 px-2.5 py-0.5 text-[10px] font-semibold text-muted hover:text-ink" onClick={() => updateCrop(1, 0, 0)}>Reset</button>
                </div>
                <label className="grid gap-1 text-xs">
                  Zoom ({zoom.toFixed(1)}x)
                  <input type="range" min="1" max="3" step="0.1" value={zoom}
                    className="w-full accent-oxblood"
                    onChange={(e) => updateCrop(Number(e.target.value), posX, posY)}
                  />
                </label>
                <label className="grid gap-1 text-xs">
                  Horizontal
                  <input type="range" min="-40" max="40" step="1" value={posX}
                    className="w-full accent-oxblood"
                    onChange={(e) => updateCrop(zoom, Number(e.target.value), posY)}
                  />
                </label>
                <label className="grid gap-1 text-xs">
                  Vertical
                  <input type="range" min="-40" max="40" step="1" value={posY}
                    className="w-full accent-oxblood"
                    onChange={(e) => updateCrop(zoom, posX, Number(e.target.value))}
                  />
                </label>
              </div>
            )}
          </>
        )}

        <div className="mt-5 grid gap-3">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Thumbnail Image</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="w-full text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-oxblood file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-oxblood/90"
              onChange={handleFile}
              disabled={uploading}
            />
            <p className="mt-0.5 text-[11px] text-muted">Or press Ctrl+V to paste from clipboard.</p>
            {uploading && <p className="mt-1 text-xs text-muted">Uploading...</p>}
            {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="h-px flex-1 bg-ink/10" />
            <span>or</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Image URL</label>
            <input
              className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm"
              value={localImageUrl}
              onChange={(e) => {
                setLocalImageUrl(e.target.value);
                onChange({ ...currentDraft, imageUrl: e.target.value, url: localRedirectUrl, metadata: { ...currentDraft.metadata, cropZoom: zoom, cropX: posX, cropY: posY } } as CardData);
              }}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1">Redirect Link</label>
            <input
              className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm"
              value={localRedirectUrl}
              onChange={(e) => {
                setLocalRedirectUrl(e.target.value);
                onChange({ ...currentDraft, imageUrl: localImageUrl, url: e.target.value, metadata: { ...currentDraft.metadata, cropZoom: zoom, cropX: posX, cropY: posY } } as CardData);
              }}
              placeholder="https://instagram.com/reel/..."
            />
            <p className="mt-0.5 text-[11px] text-muted">When someone clicks this card, they&apos;ll be taken to this link.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="rounded-full border border-ink/10 px-5 py-3 font-bold" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="rounded-full bg-oxblood px-5 py-3 font-bold text-white disabled:opacity-50"
            disabled={!localImageUrl || uploading}
            onClick={() => onSave({
              ...currentDraft,
              imageUrl: localImageUrl,
              url: localRedirectUrl,
              metadata: { ...currentDraft.metadata, cropZoom: zoom, cropX: posX, cropY: posY },
            } as CardData)}
          >
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
