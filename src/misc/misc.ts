// Utility functions without a better place

import { FileInfo } from "./fileTypes";

// Read the user id from the url parameters
export function readUserIDFromParams(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

export function fileToFileInfo(file: File): FileInfo {
  return {
    name: file.name,
    size: file.size,
  };
}

export function saveArrayBuffer(arrayBuffer: ArrayBuffer, fileName: string) {
  const a = document.createElement("a");
  a.style.display = "none";
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(new Blob([arrayBuffer]));
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function getRandomId(): string {
  return Math.random().toString(36).slice(2);
}
