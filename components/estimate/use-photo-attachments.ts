"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_PHOTOS } from "@/common/lib/estimate-photos";
import { compressImage } from "./compress-image";

export type PhotoItem = { id: number; file: File; url: string };

/** Holds the photos chosen in the estimate form, resized and ready to upload. */
export function usePhotoAttachments() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(1);
  const urls = useRef(new Set<string>());

  useEffect(() => {
    const created = urls.current;
    return () => created.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const add = useCallback(
    async (list: FileList | File[]) => {
      const incoming = Array.from(list);
      const room = MAX_PHOTOS - photos.length;
      if (incoming.length === 0) return;
      if (room <= 0) {
        setError(`You can attach up to ${MAX_PHOTOS} photos.`);
        return;
      }
      setError(null);
      setBusy(true);
      const added: PhotoItem[] = [];
      const unreadable: string[] = [];
      for (const file of incoming.slice(0, room)) {
        try {
          const resized = await compressImage(file);
          const url = URL.createObjectURL(resized);
          urls.current.add(url);
          added.push({ id: nextId.current++, file: resized, url });
        } catch {
          unreadable.push(file.name);
        }
      }
      setPhotos((current) => [...current, ...added]);
      if (unreadable.length) {
        setError(`We couldn’t read ${unreadable.join(", ")}. Please choose JPEG, PNG or WebP photos.`);
      } else if (incoming.length > room) {
        setError(`Only ${MAX_PHOTOS} photos can be attached, so the extras were skipped.`);
      }
      setBusy(false);
    },
    [photos.length],
  );

  const remove = useCallback((id: number) => {
    setError(null);
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        urls.current.delete(target.url);
      }
      return current.filter((photo) => photo.id !== id);
    });
  }, []);

  return { photos, busy, error, add, remove };
}
