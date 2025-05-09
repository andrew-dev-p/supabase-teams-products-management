"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CircularAvatarPickerProps {
  onImageSelect: (file: File) => void;
  defaultImage?: string;
  size?: number;
}

export function CircularAvatarPicker({
  onImageSelect,
  defaultImage = "",
  size = 150,
}: CircularAvatarPickerProps) {
  const [preview, setPreview] = useState<string>(defaultImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      onImageSelect(file);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const clearImage = () => {
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative rounded-full overflow-hidden flex items-center justify-center bg-white
          ${isDragging ? "ring-4 ring-primary" : ""}
          ${isLoading ? "opacity-70" : ""}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            <Image
              src={preview || "/placeholder.svg"}
              alt="Selected image"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-background/80 p-1 rounded-full hover:bg-background"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
            <Camera className="h-8 w-8 mb-2" />
            <p className="text-xs text-center">
              Drag & drop or click to upload
            </p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        id="circular-avatar-upload"
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        size="sm"
        type="button"
        className="flex items-center gap-2 bg-white"
      >
        <Upload className="h-4 w-4" />
        {preview ? "Change photo" : "Upload photo"}
      </Button>
    </div>
  );
}
