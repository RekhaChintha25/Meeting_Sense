
import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files?.[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative group border-2 border-dashed rounded-[2.5rem] p-16 transition-all duration-500 flex flex-col items-center justify-center gap-6 ${
        disabled 
          ? 'border-slate-100 bg-white/50 cursor-not-allowed grayscale' 
          : isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99] shadow-inner'
            : 'border-slate-200 bg-white hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100 cursor-pointer'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={!disabled ? () => fileInputRef.current?.click() : undefined}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="audio/*" 
        onChange={handleFileChange}
        disabled={disabled}
      />
      
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
        disabled ? 'bg-slate-100 text-slate-300' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
      }`}>
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <div className="text-center">
        <h3 className={`text-2xl font-extrabold tracking-tight ${disabled ? 'text-slate-400' : 'text-slate-900'}`}>
          {isDragging ? 'Release to process' : 'Analyze your meeting'}
        </h3>
        <p className={`text-slate-500 font-medium mt-2 max-w-xs mx-auto ${disabled ? 'opacity-50' : ''}`}>
          Drag and drop your audio file or click to browse. Supported: MP3, WAV, M4A.
        </p>
      </div>
      
      {!disabled && (
        <div className="flex items-center gap-4 mt-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Trusted by Global Teams</span>
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
               <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-slate-${2+i}00`}></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
