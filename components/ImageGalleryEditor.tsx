import React, { useState, useCallback } from 'react';

interface ImageGalleryEditorProps {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
}

const ImageGalleryEditor: React.FC<ImageGalleryEditorProps> = ({ imageUrls, onImagesChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = 4 - imageUrls.length;
      const filesToAdd = files.slice(0, remainingSlots);
      
      const newUrls = filesToAdd.map(file => URL.createObjectURL(file));
      onImagesChange([...imageUrls, ...newUrls]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const remainingSlots = 4 - imageUrls.length;
      const filesToAdd = files.slice(0, remainingSlots);
      
      const newUrls = filesToAdd.map(file => URL.createObjectURL(file));
      onImagesChange([...imageUrls, ...newUrls]);
    }
  }, [imageUrls, onImagesChange]);

  const removeImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    onImagesChange(newUrls);
  };

  const canAddMore = imageUrls.length < 4;

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Item image ${index + 1}`}
                className="w-full h-24 object-cover rounded-md border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <label
          htmlFor="image-upload"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            flex justify-center items-center w-full h-32 px-6 pt-5 pb-6 border-2 border-dashed rounded-md
            cursor-pointer transition-colors duration-300
            ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}
          `}
        >
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <span className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                Add images
              </span>
              <input 
                id="image-upload" 
                name="image-upload" 
                type="file" 
                className="sr-only" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange} 
              />
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              {4 - imageUrls.length} slot{4 - imageUrls.length !== 1 ? 's' : ''} remaining
            </p>
          </div>
        </label>
      )}
    </div>
  );
};

export default ImageGalleryEditor;