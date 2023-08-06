// useFileSharingClient - hook to handle file sharing using the global peer client
//
// Business logic for file sharing

import { FileInfo, OfferMessage, ProtocolMessage, UnOfferMessage, createHelloMessage, isOfferMessage, isProtocolMessage } from '../Protocol';
import { PeerClient, usePeerClient } from './usePeerClient';
import { MyMap, useMap } from './useMap';
import { DataConnection } from 'peerjs';
import { fileToFileInfo } from '../util/misc';
import { useCallback } from 'react';

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

    const onConnectionOpened = (conn: DataConnection) => {
        console.log("CONN FROM CALLBACK", conn);

        // const helloMessage = createHelloMessage(pId);
        // conn.send(helloMessage);
    };

    const onConnectionClosed = useCallback(() => {
        console.log("Connection closed");
        // Delete offered files
        offeredFilesActions.reset();
    }, [offeredFilesActions]);

    const onMessageReceived = useCallback((message: ProtocolMessage) => {
        console.log("Message received FROM CALLBACK");
        console.dir(message)
        console.dir(offeredFilesActions)
        if (isOfferMessage(message)) {
            const offeredFile: OfferedFile = {
                fileInfo: message.offeredFile,
                downloadStatus: { isDownloading: false, progress: 0 },
            };
            offeredFilesActions.set(message.offeredFile.name, offeredFile);
        } else {
            console.warn(`Unhandled message type ${typeof message}`);
            console.dir(message);
        }
    }, [offeredFilesActions]);

    const client = usePeerClient({
        onConnectionOpened,
        onConnectionClosed,
        onMessageReceived
    });

    const offerFile = useCallback((file: File) => {
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
    }, [client, myOfferedFilesActions]);

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