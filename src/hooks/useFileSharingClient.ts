// useFileSharingClient - hook to handle file sharing using the global peer client
//
// Business logic for file sharing

import { Protocol, ProtocolMsg, createHelloMessage } from '../misc/Protocol';
import { PeerClient, usePeerClient } from './usePeerClient';
import { MyMap, useMap } from './useMap';
import Peer, { DataConnection } from 'peerjs';
import { fileToFileInfo, saveArrayBuffer } from '../misc/misc';
import { FileInfo } from '../misc/fileTypes';

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
  acceptFiles: (files: FileInfo[]) => void;
}

export function useFileSharingClient(): FileSharingClient {

  const [myOfferedFiles, myOfferedFilesActions] = useMap<string, MyOfferedFile>();
  const [offeredFiles, offeredFilesActions] = useMap<string, OfferedFile>();

  const onConnectionOpened = (peer: Peer, conn: DataConnection) => {
    console.log("CONN FROM CALLBACK", conn);

    const helloMessage = createHelloMessage(peer.id);
    conn.send(helloMessage);

    // Send offered files
    for (const file of myOfferedFiles.values()) {
      const offerMessage: ProtocolMsg.Offer = {
        messageType: 'offer',
        offeredFile: file.fileInfo,
      };
      console.log("OFFER FILE", offerMessage)
      conn.send(offerMessage);
    }
  };

  const onConnectionClosed = (peer: Peer) => {
    console.log("Connection closed");
    // Delete offered files
    offeredFilesActions.reset();
  };

  const onMessageReceived = (peer: Peer, message: Protocol) => {
    console.log("Message received FROM CALLBACK");
    console.dir(message)

    switch (message.messageType) {
      case 'hello':
        break;
      case 'offer':
        const offeredFile: OfferedFile = {
          fileInfo: message.offeredFile,
          downloadStatus: { isDownloading: false, progress: 0 },
        };
        offeredFilesActions.set(message.offeredFile.name, offeredFile);
        break;
      case 'unoffer':
        offeredFilesActions.remove(message.unOfferedFile.name);
        break;
      case 'accept':
        // Send back the files
        const files = [...myOfferedFiles.values()].filter(f => message.acceptedFiles.includes(f.fileInfo.name));
        files.forEach(f => {
          const reader = new FileReader();
          reader.onload = () => {
            const fileContentMessage: ProtocolMsg.FileContent = {
              messageType: 'fileContent',
              fileInfo: f.fileInfo,
              content: reader.result as ArrayBuffer,
            };
            console.log("(accept) Sending", fileContentMessage);
            client.sendMessage(fileContentMessage);
          };
          reader.readAsArrayBuffer(f.file);
        });
        break;
      case 'fileContent':
        // save the blob to the file
        const { content } = message;
        const { name } = message.fileInfo;
        // TODO: protect against downloading unsolicited files
        saveArrayBuffer(content, name);
        break;
      default:
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
    const offerMessage: ProtocolMsg.Offer = {
      messageType: 'offer',
      offeredFile: fileInfo,
    };
    console.log("OFFER FILE", offerMessage)
    myOfferedFilesActions.set(file.name, offeredFile);
    client.sendMessage(offerMessage);
  };

  const unOfferFile = (file: FileInfo) => {
    const unOfferMessage: ProtocolMsg.UnOffer = {
      messageType: 'unoffer',
      unOfferedFile: file,
    };
    client.sendMessage(unOfferMessage);
    myOfferedFilesActions.remove(file.name);
  }

  const acceptFiles = (files: FileInfo[]) => {
    const acceptMessage: ProtocolMsg.Accept = {
      messageType: 'accept',
      acceptedFiles: files.map(f => f.name),
    };
    client.sendMessage(acceptMessage);
  }

  return { client, myOfferedFiles, offeredFiles, offerFile, unOfferFile, acceptFiles };
}