import Peer from "peerjs";
import { useClient } from "./ClientContext";

// Provide interface to add files to share
export default function SendBubble() {

    const { peer, messages, connectTo, isConnected } = useClient();

    const messagesList = (
        <ul>
            {messages.map((message: string, index: number) => {
                return <li key={index}>{message}</li>
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
        </div>
    );
}