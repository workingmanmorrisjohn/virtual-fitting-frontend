import { BASE_URL } from "../constants/BaseUrl";
import type { ModalNames } from "../enums/ModalNames";
import type { Avatar } from "../types/Avatar";
import type { Clothes } from "../types/Clothes";
import type { Post } from "../types/Post";

export const openModal = (modal_name: ModalNames) => {
  (document.getElementById(modal_name) as HTMLDialogElement).showModal();
}

export const closeModal = (modal_name: ModalNames) => {
  (document.getElementById(modal_name) as HTMLDialogElement).close();
}

export function getFileURL(post: Post): string | null {
  const file_url = post.image ? `${BASE_URL}/api/files/${post.collectionName}/${post.id}/${post.image}` : null
  return file_url
}

export function getFileURLFromAvatar(post: Avatar, filename: string | null): string | null {
  const file_url = filename ? `${BASE_URL}/api/files/${post.collectionName}/${post.id}/${filename}` : null
  return file_url
}

export function getFileURLFromClothes(post: Clothes, filename: string | null): string | null {
  const file_url = filename ? `${BASE_URL}/api/files/${post.collectionName}/${post.id}/${filename}` : null
  return file_url
}

export const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
          let { width, height } = img;

          // Calculate new dimensions while preserving aspect ratio
          if (width > maxWidth || height > maxHeight) {
              const aspectRatio = width / height;
              if (width > height) {
                  width = maxWidth;
                  height = Math.round(maxWidth / aspectRatio);
              } else {
                  height = maxHeight;
                  width = Math.round(maxHeight * aspectRatio);
              }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) return reject("Canvas context is null");

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
              blob => {
                  if (blob) resolve(blob);
                  else reject("Failed to convert canvas to blob");
              },
              file.type, // Keep original file type (e.g., "image/jpeg" or "image/png")
              0.8 // Compression quality (0 to 1) — adjust as needed
          );

          URL.revokeObjectURL(url);
      };

      img.onerror = () => {
          URL.revokeObjectURL(url);
          reject("Failed to load image");
      };

      img.src = url;
  });
};

export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type });
}