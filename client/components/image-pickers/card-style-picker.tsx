"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Crop, Upload, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface CardStylePickerProps {
  onImageSelect: (file: File) => void;
  defaultImage?: string;
}

export function CardStylePicker({
  onImageSelect,
  defaultImage = "",
}: CardStylePickerProps) {
  const [preview, setPreview] = useState<string>(defaultImage);
  const [isLoading, setIsLoading] = useState(false);
  const [showCropTools, setShowCropTools] = useState(false);
  const [zoom, setZoom] = useState([1]);
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
      setShowCropTools(true);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview("");
    setShowCropTools(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value);
  };

  const finishCropping = () => {
    setShowCropTools(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <div className="relative bg-muted rounded-md overflow-hidden aspect-video flex items-center justify-center">
          {preview ? (
            <div className="relative w-full h-full">
              <Image
                src={preview || "/placeholder.svg"}
                alt="Selected image"
                fill
                className="object-cover"
                style={{ transform: `scale(${zoom[0]})` }}
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 bg-background/80 p-1 rounded-full hover:bg-background z-10"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center text-muted-foreground p-8 w-full h-full cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mb-4" />
              <p className="text-sm text-center">Click to upload an image</p>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Supports JPG, PNG and GIF files
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
          id="card-style-upload"
        />

        {showCropTools && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={zoom}
                onValueChange={handleZoomChange}
                min={1}
                max={3}
                step={0.1}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {!preview ? (
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Select Image
          </Button>
        ) : showCropTools ? (
          <>
            <Button type="button" variant="outline" onClick={clearImage}>
              Cancel
            </Button>
            <Button type="button" onClick={finishCropping}>
              <Crop className="h-4 w-4 mr-2" />
              Apply Crop
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            Change Image
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
