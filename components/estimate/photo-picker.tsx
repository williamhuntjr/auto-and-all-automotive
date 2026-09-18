"use client";

import { CameraIcon, XIcon } from "lucide-react";
import { MAX_PHOTOS } from "@/common/lib/estimate-photos";
import type { PhotoItem } from "./use-photo-attachments";

type PhotoPickerProps = {
  photos: PhotoItem[];
  busy: boolean;
  error: string | null;
  onAdd: (files: FileList) => void;
  onRemove: (id: number) => void;
};

export function PhotoPicker({ photos, busy, error, onAdd, onRemove }: PhotoPickerProps) {
  const full = photos.length >= MAX_PHOTOS;
  return (
    <div className="photoPicker">
      <span className="photoLabel">Photos (optional)</span>
      <p className="photoHint">
        Add up to {MAX_PHOTOS} photos of the damage, symptoms or project.
        They’re resized automatically.
      </p>
      <label className={`photoAdd${full || busy ? " disabled" : ""}`}>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={full || busy}
          onChange={(event) => {
            if (event.target.files) onAdd(event.target.files);
            event.target.value = ""; // allow choosing the same photo again
          }}
        />
        <CameraIcon size={18} aria-hidden="true" />
        {busy ? "Preparing photos…" : "Attach photos"}
      </label>
      {photos.length > 0 && (
        <>
          <ul className="photoList">
            {photos.map((photo, index) => (
              <li key={photo.id}>
                {/* Local blob preview; next/image can't optimize these. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={`Attached photo ${index + 1}`} />
                <button
                  type="button"
                  aria-label={`Remove photo ${index + 1}`}
                  onClick={() => onRemove(photo.id)}
                >
                  <XIcon size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <p className="photoCount">
            {photos.length} of {MAX_PHOTOS} photos attached
          </p>
        </>
      )}
      {error && (
        <p className="fieldError" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
