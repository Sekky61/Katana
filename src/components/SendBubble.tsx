import { FileInfo } from "../misc/fileTypes";
import { ChangeEvent } from "react";
import { useFileSharingClientContext } from "../misc/FileSharingClientContext";
import { MyOfferedFile } from "../hooks/useFileSharingClient";
import prettyBytes from "pretty-bytes";

// Provide interface to add files to share
export default function SendBubble() {

  const { myOfferedFiles, offerFile, unOfferFile } = useFileSharingClientContext();

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

  return (
    <div className="card card-padding flex-grow">
      <h2 className="text-xl">Share files</h2>
      <div className="flex items-center gap-2 my-3">
        <label htmlFor="multiple_files" className="button">Add multiple files</label>
        <input id="multiple_files" type="file" multiple onChange={handleFileChange} className="hidden"></input>
        <span> or drag and drop</span>
      </div>
      <ul className="flex flex-col divide-y border-y border-equator-400 divide-equator-400">
        {[...myOfferedFiles.values()].map((file, index) => {
          return <FileListing key={index} file={file} handleRemove={removeOfferedFile} />
        })}
      </ul>
      <div className="w-8 h-8"></div>
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
    <li className="flex items-center px-1 gap-3 py-1">
      <div className="flex-grow truncate">{fileInfo.name}</div>
      <div className="whitespace-nowrap text-sm">{prettySize}</div>
      <button onClick={() => handleRemove(fileInfo)} className=""><CloseIcon></CloseIcon></button>
    </li>
  );
}

function CloseIcon() {
  return (
    <div className="bg-equator-500 hover:bg-equator-600 active:bg-equator-700 p-1 rounded-sm">
      <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
      </svg>
    </div>
  )
}
