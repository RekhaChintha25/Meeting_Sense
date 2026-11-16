
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

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); if(!disabled) setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled && e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
      }}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`relative group border-[3px] border-dashed rounded-[4rem] p-20 transition-all duration-500 flex flex-col items-center justify-center gap-10 ${
        disabled 
          ? 'border-slate-100 bg-white/50 cursor-not-allowed grayscale' 
          : isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98] shadow-3xl shadow-indigo-100/50'
            : 'border-slate-200 bg-white hover:border-indigo-400 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] cursor-pointer'
      }`}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="audio/*" 
        onChange={handleFileChange}
        disabled={disabled}
      />
      
      <div className={`w-36 h-36 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-105 group-hover:rotate-3 ${
        disabled ? 'bg-slate-100 text-slate-300' : 'bg-indigo-600 text-white shadow-[0_25px_50px_-12px_rgba(79,70,229,0.4)]'
      }`}>
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <div className="text-center space-y-4">
        <h3 className={`text-5xl font-black tracking-tighter ${disabled ? 'text-slate-400' : 'text-slate-900'}`}>
          {isDragging ? 'Drop to Analyze' : 'Analyze Meeting'}
        </h3>
        <p className={`text-xl text-slate-500 font-medium max-w-lg mx-auto leading-snug ${disabled ? 'opacity-50' : ''}`}>
          Drag your audio file here or click to browse recordings. <br/>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mt-6 block">Supported: MP3 • WAV • M4A</span>
        </p>
      </div>
      
      {!disabled && (
        <div className="flex flex-col items-center gap-6 pt-4">
          <div className="flex -space-x-4">
            {[1,2,3,4].map(i => (
               <div key={i} className={`w-12 h-12 rounded-full border-[5px] border-white shadow-lg bg-gradient-to-br from-slate-${1+i}00 to-slate-${3+i}00 transition-transform group-hover:translate-y-[-5px]`} style={{ transitionDelay: `${i*50}ms` }}></div>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Trusted by Global Leadership</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
