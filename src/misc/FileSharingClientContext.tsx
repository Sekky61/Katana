// ClientContext - global client for the app
// 
// A single connection is needed, it is provided by the ClientContext and can be accessed by the usePeer hook.

import { createContext, useContext } from 'react';
import { PeerClient } from '../hooks/usePeerClient';
import { FileSharingClient, MyOfferedFile, OfferedFile, useFileSharingClient } from '../hooks/useFileSharingClient';
import { FileInfo } from './fileTypes';

const defaultClient: PeerClient = {
  peerId: null,
  isConnecting: false,
  isConnected: false,
  connectTo: () => { },
  sendMessage: () => { },
};

const defaultFileSharingClient = {
  client: defaultClient,
  myOfferedFiles: new Map<string, MyOfferedFile>(),
  offeredFiles: new Map<string, OfferedFile>(),
  offerFile: (file: File) => { },
  unOfferFile: (file: FileInfo) => { },
  acceptFiles: (fileInfos: FileInfo[]) => { },
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
