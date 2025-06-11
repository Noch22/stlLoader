import React, { useCallback, useState } from 'react';
import { Upload, File, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const stlFile = files.find(file => 
      file.name.toLowerCase().endsWith('.stl')
    );

    if (stlFile) {
      setUploadedFile(stlFile);
      onFileSelect(stlFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      setUploadedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-cyan-400 bg-cyan-400/10' 
            : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
          }
        `}
      >
        <div className="flex flex-col items-center space-y-3">
          <Upload className={`w-8 h-8 ${isDragOver ? 'text-cyan-400' : 'text-gray-400'}`} />
          <div>
            <p className="text-white font-medium">Drop STL file here</p>
            <p className="text-gray-400 text-sm mt-1">or click to browse</p>
          </div>
          <input
            type="file"
            accept=".stl"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {uploadedFile && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="flex-1 min-w-0">
              <p className="text-green-400 font-medium truncate">{uploadedFile.name}</p>
              <p className="text-green-300/70 text-sm">{formatFileSize(uploadedFile.size)}</p>
            </div>
            <File className="w-5 h-5 text-green-400" />
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported format: STL files only</p>
        <p>• Maximum file size: 50MB</p>
        <p>• Binary and ASCII STL formats supported</p>
      </div>
    </div>
  );
}