import { useState, useRef, useCallback } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

type ImageUploadProps = {
  value?: string;
  onChange: (imageUrl: string) => void;
  onRemove: () => void;
};

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file (JPG, PNG, or WebP)'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image size should be less than 5MB'
      });
      return;
    }

    // Show loading state
    setIsLoading(true);
    const loadingToast = toast.loading('Uploading image...');

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
      setIsLoading(false);
      toast.success('Image uploaded successfully', {
        id: loadingToast,
        description: 'Your opportunity image has been added'
      });
    };
    reader.onerror = () => {
      setIsLoading(false);
      toast.error('Upload failed', {
        id: loadingToast,
        description: 'There was an error uploading your image. Please try again.'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveClick = () => {
    onRemove();
    toast.info('Image removed', {
      description: 'You can upload a new image if needed'
    });
  };

  return (
    <div className="space-y-3">
      {value && !isLoading ? (
        // Preview uploaded image
        <div className="relative group">
          <div className="aspect-[16/9] overflow-hidden rounded-lg border-2 border-border">
            <ImageWithFallback
              src={value}
              alt="Uploaded opportunity image"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemoveClick}
            className="absolute top-3 right-3 bg-destructive text-destructive-foreground rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Change image button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Change Image
            </Button>
          </div>
        </div>
      ) : isLoading ? (
        // Loading state
        <div className="aspect-[16/9] border-2 border-border rounded-lg flex flex-col items-center justify-center bg-muted/30">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="mb-2">Processing image...</p>
            <p className="text-sm text-muted-foreground">Please wait</p>
          </div>
        </div>
      ) : (
        // Upload area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            aspect-[16/9] border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center
            cursor-pointer transition-all
            ${isDragging 
              ? 'border-primary bg-primary/5 scale-[0.98]' 
              : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
            }
          `}
        >
          <div className="text-center p-4 md:p-6">
            <div className={`
              w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full flex items-center justify-center
              ${isDragging ? 'bg-primary/20' : 'bg-primary/10'}
            `}>
              {isDragging ? (
                <Upload className="w-6 h-6 md:w-8 md:h-8 text-primary animate-bounce" />
              ) : (
                <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              )}
            </div>
            
            <p className="mb-1 md:mb-2">
              {isDragging ? 'Drop your image here' : 'Upload opportunity image'}
            </p>
            
            <p className="text-sm text-muted-foreground mb-3 md:mb-4">
              <span className="hidden sm:inline">Drag and drop or </span>
              <span className="sm:hidden">Tap to browse or </span>
              <span className="hidden sm:inline">click to browse</span>
              <span className="sm:hidden">drag and drop</span>
            </p>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="hidden md:block">Recommended: 1200x675px (16:9 ratio)</p>
              <p>Maximum size: 5MB</p>
              <p>JPG, PNG, or WebP</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
