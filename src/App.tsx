import Peer from 'peerjs';
import { ClientProvider, ClientContext, useClient, readUserIDFromParams } from './ClientContext'
import ClientInfo from './ClientInfo';
import SendBubble from './SendBubble';
import { useEffect } from 'react';

// Files available to download will be listed here
function ReceiveBubble() {

  // const stateAsString = JSON.stringify(client?.id, null, 2);

  return (
    <div className="bg-orange-300 rounded p-1 flex-grow">
      <h2>Receive</h2>
      <p>State: -</p>
      <p>Connection status: <span id="conn_status"></span></p>
      <h3>Offered files</h3>
      <ul>
        <li>file1</li>
        <li>file2</li>
      </ul>
    </div>
  );
}

function Page() {

  const client = useClient();

  const othersId = readUserIDFromParams();

  useEffect(() => {
    if (!client.isConnecting && !client.isConnected && othersId) {
      client.connectTo(othersId);
    }
  }, [client]
  );

  return (
    <div className="container mx-auto px-4 mt-20">
      <h1 className='text-4xl mb-10'>Katana - a File sender</h1>

      <div className="mb-1">
        <ClientInfo></ClientInfo>
      </div>
      <div className="flex gap-1 w-full">
        <SendBubble />
        <ReceiveBubble />
      </div>
    </div>
  );
}

function App() {

  return (
    <ClientProvider>
      <Page />
    </ClientProvider>
  );
}

export default App;
