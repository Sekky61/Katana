// ClientContext - global client for the app
// 
// A single connection is needed, it is provided by the ClientContext and can be accessed by the usePeer hook.

import { createContext } from 'react';
import { usePeerClient, PeerClient } from '../hooks/usePeerClient';

const defaultClient: PeerClient = {
  peerId: null,
  isConnecting: false,
  isConnected: false,
  messages: [],
  offeredFiles: [],
  connectTo: () => { },
  sendMessage: () => { },
};

export const ClientContext = createContext<PeerClient>(defaultClient);

export const ClientProvider = ({ children }: any) => {
  const clientObject = usePeerClient();

  return (
    <ClientContext.Provider value={clientObject}>
      {children}
    </ClientContext.Provider>
  )
}
