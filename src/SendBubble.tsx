import Peer from "peerjs";
import { useClient } from "./ClientContext";
import { FileInfo, OfferMessage, createHelloMessage, isOfferMessage, isProtocolMessage } from "./Protocol";
import { ChangeEvent, useState } from "react";

// Provide interface to add files to share
export default function SendBubble() {

  const { peerId, messages, connectTo, isConnected, sendMessage } = useClient();

  const [offeredFiles, setOfferedFiles] = useState<File[]>([]);

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
    if (e.target.files) {
      setOfferedFiles([...offeredFiles, ...Array.from(e.target.files)])
    }
  };

  console.log(offeredFiles);

  return (
    <div className="bg-orange-300 rounded p-1 flex-grow">
      <h2 className="text-xl">Send</h2>
      <label htmlFor="multiple_files" className="hover:cursor-pointer p-1 bg-orange-400">Add multiple files</label>
      <input id="multiple_files" type="file" multiple onChange={handleFileChange} className="hidden"></input>
      <h3 className="text-lg">Shared files</h3>
      {isConnected ? messagesList : <p>Not connected</p>}
      <button onClick={sendHello}>Send rn</button>
    </div>
  );
}
