// usePeerClient - a custom hook to connect to peer

import { createContext, useReducer, useContext, useState, useEffect, useRef } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { FileInfo, OfferMessage, ProtocolMessage, UnOfferMessage, createHelloMessage, isOfferMessage, isProtocolMessage } from '../Protocol';
import useUnload from './useUnload';

export interface PeerClient {
    // The peer object
    peerId: string | null;
    isConnecting: boolean;
    isConnected: boolean;
    // Connect to another peer
    connectTo: (id: string) => void;
    sendMessage: (message: ProtocolMessage) => void;
}

export interface PeerCallbacks {
    onConnectionOpened: (conn: DataConnection) => void;
    onConnectionClosed: () => void;
    onMessageReceived: (message: ProtocolMessage) => void;
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
            callbacksRef.current.onConnectionOpened(conn);
        });

        conn.on('data', function (data) {
            if (isProtocolMessage(data)) {
                callbacksRef.current.onMessageReceived(data);
            } else {
                console.warn(`Received unknown message type ${typeof data}`);
            }
        });

        conn.on('close', function () {
            console.log("Connection closed inner")
            setIsConnected(false);
            setIsConnecting(false);
            callbacksRef.current.onConnectionClosed();
        });
    }

    useEffect(function () {
        const newPeer = new Peer();

        newPeer.on('error', (err) => {
            console.error(err);
        });

        newPeer.on('open', (id) => {
            setPeerId(id);
            setIsConnected(false);
            setIsConnecting(false);
        });

        newPeer.on('connection', function (conn) {
            connection.current = conn;
            setIsConnected(true);
            setIsConnecting(false);
            registerConnection(newPeer, conn);
        });

        peer.current = newPeer;

        return () => {
            console.warn("Destroying peer")
            setIsConnected(false);
            setIsConnecting(false);
            newPeer.disconnect();
            newPeer.destroy();
            callbacksRef.current.onConnectionClosed();
        };
    }, []);

    // When the user leaves the page, disconnect from the peer
    useUnload(() => {
        console.warn("Destroying peer")
        setIsConnected(false);
        setIsConnecting(false);
        peer.current?.disconnect();
        peer.current?.destroy();
        callbacksRef.current.onConnectionClosed();
    });

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