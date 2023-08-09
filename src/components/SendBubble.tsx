import { FileInfo } from "../misc/fileTypes";
import { ChangeEvent } from "react";
import { useFileSharingClientContext } from "../misc/FileSharingClientContext";
import { MyOfferedFile } from "../hooks/useFileSharingClient";
import prettyBytes from "pretty-bytes";
import { CloseIcon } from "../misc/icons/CloseIcon";

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
