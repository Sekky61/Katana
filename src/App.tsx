import { ClientProvider, useFileSharingClientContext } from './misc/FileSharingClientContext'
import ConnectionWindow from './components/ConnectionWindow';
import SendBubble from './components/SendBubble';
import { useEffect } from 'react';
import ReceiveBubble from './components/ReceiveBubble';
import { readUserIDFromParams } from './misc/misc';

// The main page, layout
function Page() {

  // Init the peer client
  const { client } = useFileSharingClientContext();

  // Connect to the other peer if the id is in the URL
  const othersId = readUserIDFromParams();
  useEffect(() => {
    if (!client.isConnecting && !client.isConnected && othersId) {
      client.connectTo(othersId);
    }
  }, [client, othersId]
  );

  return (
    <div className="container mx-auto px-4 mt-20">
      <h1 className='text-4xl mb-2'>Katana — a File sender</h1>
      <p className="mb-4">Share the ID with the other computer to make a connection. Keep this a secret, everybody who knows your ID can send you files.</p>
      <div className="mb-4">
        <ConnectionWindow></ConnectionWindow>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
