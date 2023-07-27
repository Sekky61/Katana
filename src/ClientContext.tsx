import { createContext, useReducer, useContext, useState, useEffect, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { createHelloMessage } from './Protocol';

export interface IClient {
  // The peer object
  peer: Peer | null;
  peerId: string | null;
  isConnected: boolean;
  messages: string[];
  // Connect to another peer
  connectTo: (id: string) => void;
  sendMessage: (message: string) => void;
}

const defaultClient: IClient = {
  peer: null,
  isConnected: false,
  messages: [],
  connectTo: () => { },
  sendMessage: () => { },
  peerId: null,
};

export const ClientContext = createContext<IClient>(defaultClient);

// Read the user id from the url parameters
export function readUserIDFromParams(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

export const ClientProvider = ({ children }: any) => {
  const clientObject = useInitClient();
  const isInitialized = clientObject.peer !== null;

  const uId = readUserIDFromParams();
  useEffect(function () {
    if (!uId || !isInitialized) {
      console.log("NOT connecting")
      return;
    }

    console.log("23 Connecting to " + uId)
    clientObject.connectTo(uId);
  }, [isInitialized]);

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

  function registerConnection(p: Peer, conn: DataConnection) {
    conn.on('open', function () {
      // Send a hello message
      const pId = p?.id;
      if (!pId) {
        console.warn("peerId is null before sending hello message")
        return;
      }
      const helloMessage = createHelloMessage(pId);
      conn.send(helloMessage);
    });

    conn.on('data', function (data) {
      setMessages((messages) => [...messages, data as string]);
    });
  }

  useEffect(function () {
    const newPeer = new Peer();

    newPeer.on('open', (id) => {
      setPeerId(id);
    });

    newPeer.on('connection', function (conn) {
      connection.current = conn;
      setIsConnected(true);

      registerConnection(newPeer, conn);
    });

    setPeer(newPeer);

    return () => {
      newPeer.disconnect();
      newPeer.destroy();
    };
  }, []);

  const connectTo = (id: string) => {
    console.log(`Connecting to ${id}`);

    if (!peer) {
      console.warn("but Peer not initialized")
      return;
    }

    const conn = peer.connect(id, { reliable: true });
    connection.current = conn;
    registerConnection(peer, conn);
  }

  const sendMessage = (message: string) => {
    if (!connection.current) {
      console.warn("Connection not initialized")
      return;
    }

    connection.current.send(message);
  }

  return { peer, messages, connectTo, isConnected, peerId, sendMessage };
}
