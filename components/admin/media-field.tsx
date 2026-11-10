"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { Media } from "@/lib/data/projects";

const input =
  "w-full rounded-[6px] border border-border bg-background px-3 py-2 font-mono text-[12px] text-foreground outline-none focus:border-foreground/60";

export function emptyMedia(): Media {
  return { type: "image", src: "" };
}

/** One slot for an image or a video: pick the kind, upload a file, or paste a URL. */
export function MediaField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: Media | undefined;
  onChange: (value: Media) => void;
  folder: string;
}) {
  const media = value ?? emptyMedia();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file: File) => {
    setError(null);
    setBusy(0);
    try {
      const result = await upload(`${folder}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setBusy(Math.round(percentage)),
      });
      onChange({
        ...media,
        type: file.type.startsWith("video/") ? "video" : "image",
        src: result.url,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Is a Blob store connected?");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-[8px] border border-border p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-muted">{label}</p>
        <div className="flex rounded-[6px] bg-foreground/[0.07] p-0.5 font-mono text-[11px]">
          {(["image", "video"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => onChange({ ...media, type: kind })}
              className={`rounded-[4px] px-2.5 py-1 transition-colors ${
                media.type === kind ? "bg-foreground text-background" : "text-foreground"
              }`}
            >
              {kind === "image" ? "Image" : "Video"}
            </button>
          ))}
        </div>
      </div>

      {media.src ? (
        <div className="mt-3 overflow-hidden rounded-[6px] bg-foreground/[0.05]">
          {media.type === "video" ? (
            <video src={media.src} poster={media.poster} muted loop autoPlay playsInline className="max-h-48 w-full object-contain" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.src} alt="" className="max-h-48 w-full object-contain" />
          )}
        </div>
      ) : null}

      <div className="mt-3 flex gap-2">
        <input
          className={input}
          placeholder={media.type === "video" ? "Video URL (mp4/webm)" : "Image URL"}
          value={media.src}
          onChange={(e) => onChange({ ...media, src: e.target.value })}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="shrink-0 rounded-[6px] bg-foreground px-3 py-2 font-mono text-[12px] text-background transition-opacity hover:opacity-85"
        >
          {busy !== null ? `${busy}%` : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={media.type === "video" ? "video/*" : "image/*"}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pick(f);
            e.target.value = "";
          }}
        />
      </div>
      {media.type === "video" ? (
        <input
          className={`${input} mt-2`}
          placeholder="Poster image URL (optional)"
          value={media.poster ?? ""}
          onChange={(e) => onChange({ ...media, poster: e.target.value || undefined })}
        />
      ) : (
        <input
          className={`${input} mt-2`}
          placeholder="Alt text (optional)"
          value={media.alt ?? ""}
          onChange={(e) => onChange({ ...media, alt: e.target.value || undefined })}
        />
      )}
      {error ? <p className="mt-2 font-mono text-[11px] text-accent-red">{error}</p> : null}
    </div>
  );
}
