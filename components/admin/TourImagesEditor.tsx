"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import {
  useAddTourImage,
  useDeleteTourImage,
  useUploadTourImage,
} from "@/hooks/admin/useTours";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { t } from "@/lib/i18n";
import { ApiError } from "@/lib/api-client";
import type { TourImage } from "@/types/tour";

/**
 * Admin tour-image manager — either upload a file straight from the
 * admin's computer (POST /admin/uploads/tour-image, multipart) or paste an
 * external URL, both funnel into the same "attach this url to the tour"
 * step (useAddTourImage). Keeping the URL field around is intentional —
 * sometimes a hosted image elsewhere is genuinely easier than a re-upload.
 */
export function TourImagesEditor({ tourId, images }: { tourId: string; images: TourImage[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useUploadTourImage();
  const addImage = useAddTourImage(tourId);
  const deleteImage = useDeleteTourImage(tourId);

  const isBusy = uploadImage.isPending || addImage.isPending;
  const sorted = [...images].sort((a, b) => a.order - b.order);

  async function handleFileSelect(file: File) {
    setError(null);
    try {
      const { url } = await uploadImage.mutateAsync(file);
      await addImage.mutateAsync({ url });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("admin.tourForm.imageUploadError"));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleAddUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setError(null);
    try {
      await addImage.mutateAsync({ url: trimmed });
      setUrlInput("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("admin.tourForm.imageUploadError"));
    }
  }

  return (
    <section className="rounded-xl2 border border-border p-5">
      <h2 className="mb-4 font-semibold">{t("admin.tourForm.images")}</h2>

      {error && <p className="mb-3 text-sm text-danger">{error}</p>}

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {sorted.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-video overflow-hidden rounded-lg border border-border"
          >
            <Image src={image.url} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => deleteImage.mutate(image.id)}
              disabled={deleteImage.isPending}
              className="absolute right-1.5 top-1.5 rounded-full bg-background/80 p-1.5 text-danger opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
              aria-label={t("common.delete")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="col-span-full text-sm text-muted">{t("admin.tourForm.imagesEmpty")}</p>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            isLoading={uploadImage.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" /> {t("admin.tourForm.uploadImage")}
          </Button>
        </div>
        <Input
          label={t("admin.tourForm.imageUrlLabel")}
          placeholder="https://..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <Button type="button" variant="secondary" isLoading={addImage.isPending} onClick={handleAddUrl}>
          {t("admin.tourForm.addImageUrl")}
        </Button>
      </div>
      {isBusy && <p className="mt-2 text-xs text-muted">{t("common.uploading")}</p>}
    </section>
  );
}