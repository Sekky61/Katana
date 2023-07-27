import Peer from "peerjs";
import { useClient } from "./ClientContext";
import { isProtocolMessage } from "./Protocol";

// Provide interface to add files to share
export default function SendBubble() {

    const { peer, messages, connectTo, isConnected, sendMessage } = useClient();

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

    return (
        <div className="bg-orange-300 rounded p-1 flex-grow">
            <h2 className="text-xl">Send</h2>
            <button>Add files</button>
            <h3 className="text-lg">Shared files</h3>
            {isConnected ? messagesList : <p>Not connected</p>}
            <button onClick={() => { sendMessage("hahah") }}>Send rn</button>
        </div>
    );
}