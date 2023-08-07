// Utility functions without a better place

import { FileInfo } from "./Protocol";

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
