import { createContext, useReducer, useContext, useState, useEffect, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';

export interface IClient {
  // The peer object
  peer: Peer | null;
  peerId: string | null;
  isConnected: boolean;
  messages: string[];
  // Connect to another peer
  connectTo: (id: string) => void;
}

const defaultClient: IClient = {
  peer: null,
  isConnected: false,
  messages: [],
  connectTo: () => { },
  peerId: null,
};

export const ClientContext = createContext<IClient>(defaultClient);

export const ClientProvider = ({ children }: any) => {
  const clientObject = useInitClient();

  return (
    <ClientContext.Provider value={clientObject}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClient() {
  const client = useContext(ClientContext);

  return client;
}

function useInitClient(): IClient {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);

  const connection = useRef<DataConnection | null>(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      console.log('My bloody peer ID is: ' + id);
      console.log("What is this");
      console.log(peer);
      setPeerId(id);
    });

    peer.on('connection', function (conn) {
      console.log("Connection received")
      connection.current = conn;
      setIsConnected(true);
      conn.on('data', function (data) {
        // Will print 'hi!'
        console.log("Received data")
        console.log(data);
        setMessages((messages) => [...messages, data as string]);
      });
    });

    setPeer(peer);

    return () => {
      peer.disconnect();
      peer.destroy();
    };
  }, []);

  const connectTo = (id: string) => {
    console.log(`Connecting to ${id}`);

    if (!peer) {
      console.log("but Peer not initialized")
      return;
    }

    const conn = peer.connect(id, { reliable: true });
    connection.current = conn;
    conn.on('open', function () {
      console.log("Connection open")
      setIsConnected(true);
      conn.send('hi!');
    });
  }

  return { peer, messages, connectTo, isConnected, peerId };
}
