import Peer from 'peerjs';
import { ClientProvider, FileSharingClientContext, useFileSharingClientContext } from './util/FileSharingClientContext'
import ClientInfo from './ClientInfo';
import SendBubble from './SendBubble';
import { useEffect } from 'react';
import ReceiveBubble from './ReceiveBubble';
import { readUserIDFromParams } from './util/misc';

function Page() {

  const { client } = useFileSharingClientContext();

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
      <div className="grid grid-cols-2 gap-1">
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
