// ClientContext - global client for the app
// 
// A single connection is needed, it is provided by the ClientContext and can be accessed by the usePeer hook.

import { createContext, useContext, useState } from 'react';
import { usePeerClient, PeerClient } from '../hooks/usePeerClient';
import Peer, { DataConnection } from 'peerjs';
import { FileInfo, OfferMessage, ProtocolMessage, UnOfferMessage } from '../Protocol';
import { MyMap, useMap } from '../hooks/useMap';
import { FileSharingClient, OfferedFile, useFileSharingClient } from '../hooks/useFileSharingClient';

const defaultClient: PeerClient = {
  peerId: null,
  isConnecting: false,
  isConnected: false,
  connectTo: () => { },
  sendMessage: () => { },
};

const defaultFileSharingClient = {
  client: defaultClient,
  myOfferedFiles: new Map<string, OfferedFile>(),
  offeredFiles: new Map<string, FileInfo>(),
  offerFile: (file: File) => { },
  unOfferFile: (file: FileInfo) => { },
};

export const FileSharingClientContext = createContext<FileSharingClient>(defaultFileSharingClient);

export const ClientProvider = ({ children }: any) => {
  const clientObject = useFileSharingClient();

  return (
    <FileSharingClientContext.Provider value={clientObject}>
      {children}
    </FileSharingClientContext.Provider>
  )
}

export function useFileSharingClientContext() {
  const x = useContext(FileSharingClientContext);
  return x;
}
