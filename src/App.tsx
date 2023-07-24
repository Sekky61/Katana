import { ClientProvider, ClientContext, useClient } from './ClientContext'
import ClientInfo from './ClientInfo';
import Client from './client';

// Provide interface to add files to share
function SendBubble() {

  const { client, setOpenCallback } = useClient();

  const handleClick = () => {
    setOpenCallback(() => {
      console.log('open callback!!');
    });
  }

  return (
    <div className="bg-orange-300 rounded p-1">
      <h2>Send</h2>
      <button>Add files</button>
      <h3>Shared files</h3>
      <ul>
        <li>file1</li>
        <li>file2</li>
      </ul>
    </div>
  );
}

// Files available to download will be listed here
function ReceiveBubble() {

  const { client, toggle } = useClient();

  const stateAsString = JSON.stringify(client.id, null, 2);

  return (
    <div className="bg-orange-300 rounded p-1">
      <h2>Receive</h2>
      <p>State: {stateAsString}</p>
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
  return (
    <div className="container mx-auto px-4 mt-20">
      <h1 className='text-4xl mb-10'>File sender</h1>

      <div className="flex mb-1">
        <ClientInfo></ClientInfo>
      </div>
      <div className="flex gap-1">
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
