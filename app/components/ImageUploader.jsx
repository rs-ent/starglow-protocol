/// app\components\ImageUploader.jsx

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadFiles } from "../firebase/fetch";
import { UploadCloudIcon } from 'lucide-react';

export default function ImageUploader({ onUploadComplete, previewWidth = 100 }) {
    const [uploadProgress, setUploadProgress] = useState({});
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            try {
                const uploadedFiles = await uploadFiles(files, "uploads/", (id, progress) => {
                    setUploadProgress((prev) => ({ ...prev, [id]: Math.round(progress) }));
                });

                const urls = uploadedFiles.map(file => file.downloadURL);
                setPreviewUrls(prev => [...prev, ...urls]);

                if (onUploadComplete) {
                    onUploadComplete(urls);
                }
            } catch (error) {
                console.error("File upload error:", error);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div
                onClick={() => fileInputRef.current.click()}
                className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[var(--primary)] rounded-xl p-6 bg-[var(--background-second)] hover:bg-[var(--background-muted)] transition duration-300"
            >
                <UploadCloudIcon size={40} className="text-[var(--primary)] mb-2" />
                <p className="text-[var(--text-secondary)]">Click or Drag & Drop to Upload</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </div>

            {Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-2">
                    {Object.entries(uploadProgress).map(([index, progress]) => (
                        progress < 100 && (
                            <div key={index} className="w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="bg-[var(--primary)] text-white text-xs py-1 text-center transition-all duration-300 ease-in-out"
                                    style={{ width: `${progress}%` }}
                                >
                                    {progress}%
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}

            {previewUrls.length > 0 && (
                <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${previewUrls.length}, minmax(0, 1fr))` }}>
                    {previewUrls.map((url, idx) => (
                        <Image
                            key={idx}
                            src={url}
                            width={400}
                            height={300}
                            style={{ width: `${previewWidth}%` }}
                            className="rounded-md mx-auto h-auto object-cover"
                            alt={`Uploaded Image Preview ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}