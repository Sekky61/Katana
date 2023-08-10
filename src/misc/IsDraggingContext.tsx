import { createContext, useState } from "react";

export const IsDraggingContext = createContext(false);

export const IsDraggingContextProvider = ({ children }: any) => {

  const [isDragging, setIsDragging] = useState(false);

  // listen for drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    console.warn("drag enter global")
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { relatedTarget } = e;
    console.log("drag leave");
    console.log("related target", relatedTarget);
    console.log("current target", e.currentTarget)
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget as Node)) {
      setIsDragging(false);
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  return (
    <div onDragLeave={handleDragLeave} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDrop}>
      <IsDraggingContext.Provider value={isDragging}>
        {children}
      </IsDraggingContext.Provider>
    </div>
  )
}
