import { FileInfo } from "../misc/fileTypes";
import { ChangeEvent, useContext, useState } from "react";
import { useFileSharingClientContext } from "../misc/FileSharingClientContext";
import { MyOfferedFile } from "../hooks/useFileSharingClient";
import prettyBytes from "pretty-bytes";
import { CloseIcon } from "../misc/icons/CloseIcon";
import { IsDraggingContext } from "../misc/IsDraggingContext";

// Provide interface to add files to share
export default function SendBubble() {

  const { myOfferedFiles, offerFile, unOfferFile } = useFileSharingClientContext();

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const isDraggingGlobal = useContext(IsDraggingContext);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    // offer each file
    for (const file of e.target.files) {
      offerFile(file);
    }
  };

  const removeOfferedFile = (file: FileInfo) => {
    unOfferFile(file);
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { relatedTarget } = e;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget as Node)) {
      setIsDraggingOver(false);
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (!e.dataTransfer.files) {
      console.warn("no files dropped");
      return;
    }

    // offer each file
    for (const file of e.dataTransfer.files) {
      console.log("ofering file", file)
      offerFile(file);
    }
  }

  const dropFile = (
    <div className={"absolute inset-0 m-4 bg-equator-50 border border-dashed border-equator-300 duration-200 "
      + (isDraggingGlobal ? "" : "hidden ")
      + (isDraggingOver ? "bg-equator-300" : "")}>
      <div className={"flex justify-center items-center text-2xl w-full h-full "}>
        Drop files here
      </div>
    </div>
  );

  // cancel onDragOver
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  return (
    <div className="card card-padding flex-grow relative" onDragLeave={handleDragLeave} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDrop}>
      {dropFile}
      <div className="">
        <h2 className="text-xl pb-4">Shared files</h2>
        <ul className="flex flex-col divide-y border-y border-equator-400 divide-equator-400">
          {[...myOfferedFiles.values()].map((file, index) => {
            return <FileListing key={index} file={file} handleRemove={removeOfferedFile} />
          })}
        </ul>
        <div className="flex items-center gap-2 pt-4">
          <label htmlFor="multiple_files" className="button">Add multiple files</label>
          <input id="multiple_files" type="file" multiple onChange={handleFileChange} className="hidden"></input>
          <span> or drag and drop</span>
        </div>
      </div>
    </div>
  );
}

interface FileListingProps {
  file: MyOfferedFile;
  handleRemove: (filename: FileInfo) => void;
}

function FileListing({ file, handleRemove }: FileListingProps) {

  const { fileInfo } = file;
  const prettySize = prettyBytes(fileInfo.size);

  return (
    <li className="flex items-center px-1 gap-3 py-1.5 hover:bg-equator-100">
      <div className="flex-grow truncate">{fileInfo.name}</div>
      <div className="whitespace-nowrap text-sm">{prettySize}</div>
      <button onClick={() => handleRemove(fileInfo)} className=""><CloseIcon></CloseIcon></button>
    </li>
  );
}
