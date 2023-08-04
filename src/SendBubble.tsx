import Peer from "peerjs";
import { useClient } from "./ClientContext";
import { FileInfo, OfferMessage, createHelloMessage, isOfferMessage, isProtocolMessage } from "./Protocol";

// Provide interface to add files to share
export default function SendBubble() {

  const { peerId, messages, connectTo, isConnected, sendMessage } = useClient();

  const files: OfferMessage[] = messages.filter(isOfferMessage);

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

  return (
    <div className="bg-orange-300 rounded p-1 flex-grow">
      <h2 className="text-xl">Send</h2>
      <button>Add files</button>
      <h3 className="text-lg">Shared files</h3>
      {isConnected ? messagesList : <p>Not connected</p>}
      <button onClick={sendHello}>Send rn</button>
      <div>
        <ul className="flex flex-col gap-1">
          {files.map((file, index) => {
            return <FileListing key={index} file={file.offeredFile} />
          })}
        </ul>
      </div>
    </div>
  );
}

function FileListing({ file }: { file: FileInfo }) {
  return (
    <li className="flex border px-2">
      <input type="checkbox" name="" id="" className="w-4 mr-2" />
      <div className="flex-grow">{file.name}</div>
      <div>{file.size}B</div>
    </li>
  );
}