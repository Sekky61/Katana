import { FileInfo, OfferMessage, createHelloMessage, isOfferMessage, isProtocolMessage } from "./Protocol";
import { ChangeEvent, useState } from "react";
import { useFileSharing } from "./hooks/useFileSharing";

// Provide interface to add files to share
export default function SendBubble() {

  const { client: { peerId, messages, connectTo, isConnected, sendMessage } } = useFileSharing();

  const [offeredFiles, setOfferedFiles] = useState(new Map<string, FileInfo>());

  const messagesList = (
    <ul>
      {messages.map((message: any, index: number) => {
        if (isProtocolMessage(message)) {
          return <li key={index}>{message.messageType}</li>
        } else if (typeof message === 'string') {
          return <li key={index}>{message}</li>
        } else {
          throw new Error("Unknown message type " + typeof message)
        }
      })
      }
    </ul>
  );

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

    for (const file of Array.from(e.target.files)) {
      if (!offeredFiles.has(file.name)) {
        offeredFiles.set(file.name, {
          name: file.name,
          size: file.size,
        });
      }
    }
    setOfferedFiles(new Map(offeredFiles))
  };

  const removeOfferedFile = (filename: string) => {
    offeredFiles.delete(filename);
    setOfferedFiles(new Map(offeredFiles));
  }

  return (
    <div className="bg-orange-300 rounded p-1 flex-grow">
      <h2 className="text-xl">Send</h2>
      <label htmlFor="multiple_files" className="hover:cursor-pointer p-1 bg-orange-400">Add multiple files</label>
      <input id="multiple_files" type="file" multiple onChange={handleFileChange} className="hidden"></input>
      <h3 className="text-lg">Shared files</h3>
      {isConnected ? messagesList : <p>Not connected</p>}
      <ul className="flex flex-col gap-1">
        {[...offeredFiles.values()].map((file, index) => {
          return <FileListing key={index} file={file} handleRemove={removeOfferedFile} />
        })}
      </ul>
      <button onClick={sendHello}>Send rn</button>
    </div>
  );
}

interface FileListingProps {
  file: FileInfo;
  handleRemove: (filename: string) => void;
}

function FileListing({ file, handleRemove }: FileListingProps) {

  return (
    <li className="flex border px-2">
      <div className="flex-grow">{file.name}</div>
      <div>{file.size}B</div>
      <button onClick={() => handleRemove(file.name)}>Delete</button>
    </li>
  );
}
