import { ClientProvider, useFileSharingClientContext } from './misc/FileSharingClientContext'
import ConnectionWindow from './components/ConnectionWindow';
import SendBubble from './components/SendBubble';
import { useEffect } from 'react';
import ReceiveBubble from './components/ReceiveBubble';
import { readUserIDFromParams } from './misc/misc';
import { GithubIcon } from './misc/icons/GithubIcon';
import { IsDraggingContextProvider } from './misc/IsDraggingContext';

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
    <div className="flex flex-col min-h-screen">
      <div className="container flex-grow mx-auto px-4 mt-20">
        <div className='flex flex-wrap items-center text-4xl mb-2'>
          <h1>Katana</h1>
          <span>&nbsp;—&nbsp;</span>
          <h2>a File sender</h2>
        </div>
        <p className="mb-4">Share the ID with the other computer to make a connection. Keep this a secret, everybody who knows your ID can send you files.</p>
        <div className="mb-4">
          <ConnectionWindow></ConnectionWindow>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SendBubble />
          <ReceiveBubble />
        </div>
      </div>
      <div className='w-full h-10 bg-equator-50 flex items-center px-4 gap-2'>
        <GithubIcon></GithubIcon>
        <div>
          <span>Check it out at&nbsp;</span>
          <a href="https://github.com/Sekky61/Katana" className='link'>Github</a>
        </div>
      </div>
    </div>
  );
}

function App() {

  return (
    <IsDraggingContextProvider>
      <ClientProvider>
        <Page />
      </ClientProvider>
    </IsDraggingContextProvider>
  );
}

export default App;
