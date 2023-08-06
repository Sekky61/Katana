import { FileInfo, OfferMessage, createHelloMessage, isOfferMessage, isProtocolMessage } from "./Protocol";
import { ChangeEvent, useState } from "react";
import { useFileSharingClientContext } from "./util/FileSharingClientContext";
import { OfferedFile } from "./hooks/useFileSharingClient";

// Provide interface to add files to share
export default function SendBubble() {

  const { client: { peerId, sendMessage }, myOfferedFiles, offerFile, unOfferFile } = useFileSharingClientContext();

  const sendHello = () => {
    if (!peerId) {
      return;
    }
    const msg = createHelloMessage(peerId);
    sendMessage(msg);
  }

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
    <div className="bg-orange-300 rounded p-1 flex-grow">
      <h2 className="text-xl">Send</h2>
      <label htmlFor="multiple_files" className="hover:cursor-pointer p-1 bg-orange-400">Add multiple files</label>
      <input id="multiple_files" type="file" multiple onChange={handleFileChange} className="hidden"></input>
      <h3 className="text-lg">Shared files</h3>
      <ul className="flex flex-col gap-1">
        {[...myOfferedFiles.values()].map((file, index) => {
          return <FileListing key={index} file={file} handleRemove={removeOfferedFile} />
        })}
      </ul>
      <button onClick={sendHello}>Send rn</button>
    </div>
  );
}

interface FileListingProps {
  file: OfferedFile;
  handleRemove: (filename: FileInfo) => void;
}

function FileListing({ file, handleRemove }: FileListingProps) {

  const { fileInfo } = file;

  return (
    <li className="flex border px-2">
      <div className="flex-grow">{fileInfo.name}</div>
      <div>{fileInfo.size}B</div>
      <button onClick={() => handleRemove(fileInfo)}>Delete</button>
    </li>
  );
}
