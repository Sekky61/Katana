// useFileSharingClient - hook to handle file sharing using the global peer client
//
// Business logic for file sharing

import { FileInfo, OfferMessage, ProtocolMessage, UnOfferMessage, createHelloMessage, isOfferMessage } from '../misc/Protocol';
import { PeerClient, usePeerClient } from './usePeerClient';
import { MyMap, useMap } from './useMap';
import Peer, { DataConnection } from 'peerjs';
import { fileToFileInfo } from '../misc/misc';

export interface MyOfferedFile {
  file: File,
  fileInfo: FileInfo,
}

export interface OfferedFile {
  fileInfo: FileInfo,
  downloadStatus: { isDownloading: boolean, progress: number },
}

export interface FileSharingClient {
  client: PeerClient;
  // Files offered by this client
  myOfferedFiles: MyMap<string, MyOfferedFile>;
  // Files offered by peer
  offeredFiles: MyMap<string, OfferedFile>;
  offerFile: (file: File) => void;
  unOfferFile: (file: FileInfo) => void;
}

export function useFileSharingClient(): FileSharingClient {

  const [myOfferedFiles, myOfferedFilesActions] = useMap<string, MyOfferedFile>();
  const [offeredFiles, offeredFilesActions] = useMap<string, OfferedFile>();

  const onConnectionOpened = (peer: Peer, conn: DataConnection) => {
    console.log("CONN FROM CALLBACK", conn);

    const helloMessage = createHelloMessage(peer.id);
    conn.send(helloMessage);
  };

  const onConnectionClosed = (peer: Peer) => {
    console.log("Connection closed");
    // Delete offered files
    offeredFilesActions.reset();
  };

  const onMessageReceived = (peer: Peer, message: ProtocolMessage) => {
    console.log("Message received FROM CALLBACK");
    console.dir(message)
    if (isOfferMessage(message)) {
      const offeredFile: OfferedFile = {
        fileInfo: message.offeredFile,
        downloadStatus: { isDownloading: false, progress: 0 },
      };
      offeredFilesActions.set(message.offeredFile.name, offeredFile);
    } else {
      console.warn(`Unhandled message type ${typeof message}`);
    }
  };

  const client = usePeerClient({
    onConnectionOpened,
    onConnectionClosed,
    onMessageReceived
  });

  const offerFile = (file: File) => {
    const fileInfo = fileToFileInfo(file);
    const offeredFile: MyOfferedFile = {
      file: file,
      fileInfo: fileInfo,
    };
    const offerMessage: OfferMessage = {
      messageType: 'offer',
      offeredFile: fileInfo,
    };
    console.log("OFFER FILE", offerMessage)
    myOfferedFilesActions.set(file.name, offeredFile);
    client.sendMessage(offerMessage);
  };

  const unOfferFile = (file: FileInfo) => {
    const unOfferMessage: UnOfferMessage = {
      messageType: 'unoffer',
      unOfferedFile: file,
    };
    client.sendMessage(unOfferMessage);
    myOfferedFilesActions.remove(file.name);
  }

  return { client, myOfferedFiles, offeredFiles, offerFile, unOfferFile };
}