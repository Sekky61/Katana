// usePeerClient - a custom hook to connect to peer

import { useState, useEffect, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { Protocol, isProtocolMessage } from '../misc/Protocol';
import useUnload from './useUnload';
import { getRandomId } from '../misc/misc';

export interface PeerClient {
  // The peer object
  peerId: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  // Connect to another peer
  connectTo: (id: string) => void;
  sendMessage: (message: Protocol) => void;
}

export interface PeerCallbacks {
  onConnectionOpened: (peer: Peer, conn: DataConnection) => void;
  onConnectionClosed: (peer: Peer) => void;
  onMessageReceived: (peer: Peer, message: Protocol) => void;
}

// The peer client context
// Does not handle business logic, only provides the peer client
// Capable of sending and receiving messages of type ProtocolMessage
export function usePeerClient(callbacks: PeerCallbacks): PeerClient {

  const callbacksRef = useRef(callbacks);

  const peer = useRef<Peer | null>(null);
  const connection = useRef<DataConnection | null>(null);

  const [peerId, setPeerId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    callbacksRef.current = callbacks; // Update ref to the latest callback.
  }, [callbacks]);

  function registerConnection(p: Peer, conn: DataConnection) {
    conn.on('open', function () {
      console.log("Connection opened inner")
      setIsConnected(true);
      setIsConnecting(false);
      // Send a hello message
      const pId = p?.id;
      if (!pId) {
        console.warn("peerId is null before sending hello message")
        return;
      }
      callbacksRef.current.onConnectionOpened(p, conn);
    });

    conn.on('data', function (data) {
      if (isProtocolMessage(data)) {
        callbacksRef.current.onMessageReceived(p, data);
      } else {
        console.warn(`Received unknown message type ${typeof data}. The message is:`);
        console.dir(data);
      }
    });

    conn.on('close', function () {
      console.log("Connection closed inner")
      setIsConnected(false);
      setIsConnecting(false);
      callbacksRef.current.onConnectionClosed(p);
    });

    conn.on('error', function (err) {
      console.log("Connection error inner")
      console.error(err);
    });
  }

  useEffect(function () {
    // Generate a new peer id
    const id = getRandomId();
    setPeerId(id);
    const newPeer = new Peer(id);

    newPeer.on('error', (err) => {
      console.error(err);
    });

    newPeer.on('open', (id) => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    newPeer.on('connection', function (conn) {
      connection.current = conn;
      setIsConnected(true);
      setIsConnecting(false);
      registerConnection(newPeer, conn);
    });

    newPeer.on('disconnected', function () {
      console.log("Peer disconnected")
      setIsConnected(false);
      setIsConnecting(false);

    });

    peer.current = newPeer;

    return () => {
      console.warn("Destroying peer")
      setIsConnected(false);
      setIsConnecting(false);
      newPeer.disconnect();
      newPeer.destroy();
      callbacksRef.current.onConnectionClosed(newPeer);
    };
  }, []);

  // When the user leaves the page, disconnect from the peer
  useUnload(() => {
    console.warn("Destroying peer")
    setIsConnected(false);
    setIsConnecting(false);
    if (!peer.current) {
      console.warn("Nothing to destroy")
      return;
    }
    peer.current.disconnect();
    peer.current.destroy();
    callbacksRef.current.onConnectionClosed(peer.current);
  });

  // every second, print peer
  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         if (!peer.current) {
  //             console.warn("Peer not initialized")
  //             return;
  //         }
  //         console.log(peer.current)
  //     }, 1000);
  //     return () => clearInterval(interval);
  // });

  const connectTo = function (id: string) {
    console.log(`Connecting to ${id}`);

    const p = peer.current;
    if (!p) {
      console.warn("but Peer not initialized")
      return;
    }

    if (p.destroyed || p.disconnected) {
      console.warn("Peer is disconnected or destroyed so aborting connecting")
      return;
    }

    if (isConnecting) {
      console.warn("Already connecting")
      return;
    }

    setIsConnecting(true);
    const conn = p.connect(id, { reliable: true });
    console.dir(peer)
    console.dir(conn)
    connection.current = conn;
    registerConnection(p, conn);
  }

  const sendMessage = (message: any) => {
    if (!connection.current) {
      console.warn("Connection not initialized. IsConnected: " + isConnected)
      console.log(peer.current)
      return;
    }
    // const chunked = true;
    connection.current.send(message);
  }

  return { connectTo, isConnecting, isConnected, peerId, sendMessage };
}