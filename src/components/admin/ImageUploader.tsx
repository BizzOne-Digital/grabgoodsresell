"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  primaryUrl?: string;
  onPrimaryChange?: (url: string) => void;
}

interface SortableImageProps {
  image: ProductImage;
  index: number;
  isPrimary: boolean;
  uploading: boolean;
  onRemove: () => void;
  onSetPrimary: () => void;
}

function SortableImage({
  image,
  index,
  isPrimary,
  uploading,
  onRemove,
  onSetPrimary,
}: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl border bg-muted",
        isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border",
        isDragging && "z-10 opacity-80 shadow-lg",
      )}
    >
      <Image
        src={image.url}
        alt={image.alt || `Product image ${index + 1}`}
        fill
        className="object-cover"
        sizes="160px"
      />

      {isPrimary && (
        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
          Primary
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          className="rounded-md bg-white/10 p-1.5 text-white backdrop-blur-sm"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex gap-1">
          {!isPrimary && (
            <button
              type="button"
              onClick={onSetPrimary}
              className="rounded-md bg-white/10 p-1.5 text-white backdrop-blur-sm hover:bg-white/20"
              aria-label="Set as primary image"
            >
              <Star className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            disabled={uploading}
            className="rounded-md bg-white/10 p-1.5 text-white backdrop-blur-sm hover:bg-danger/80"
            aria-label="Remove image"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImageUploader({
  images,
  onChange,
  primaryUrl,
  onPrimaryChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const primary = primaryUrl || images[0]?.url;

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/uploads", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        const newImage: ProductImage = {
          url: data.url,
          alt: file.name.replace(/\.[^.]+$/, ""),
          fileId: data.fileId,
        };

        onChange([...images, newImage]);

        if (!primary && onPrimaryChange) {
          onPrimaryChange(newImage.url);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, onPrimaryChange, primary],
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      await uploadFile(file);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = async (image: ProductImage) => {
    const nextImages = images.filter((item) => item.url !== image.url);
    onChange(nextImages);

    if (primary === image.url) {
      onPrimaryChange?.(nextImages[0]?.url || "");
    }

    if (image.fileId) {
      try {
        await fetch(
          `/api/admin/uploads?fileId=${encodeURIComponent(image.fileId)}`,
          { method: "DELETE" },
        );
      } catch {
        // Ignore delete errors; image already removed from form state
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.url === active.id);
    const newIndex = images.findIndex((img) => img.url === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onChange(arrayMove(images, oldIndex, newIndex));
  };

  const handleSetPrimary = (url: string) => {
    onPrimaryChange?.(url);
    const index = images.findIndex((img) => img.url === url);
    if (index > 0) {
      onChange(arrayMove(images, index, 0));
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 transition hover:border-primary/50 hover:bg-muted/50",
          uploading && "pointer-events-none opacity-60",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFiles(e.dataTransfer.files);
        }}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground" />
        )}
        <p className="mt-2 text-sm font-medium">Click or drop images to upload</p>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP, GIF — max 5MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.url)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((image, index) => (
                <SortableImage
                  key={image.url}
                  image={image}
                  index={index}
                  isPrimary={primary === image.url}
                  uploading={uploading}
                  onRemove={() => void handleRemove(image)}
                  onSetPrimary={() => handleSetPrimary(image.url)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
