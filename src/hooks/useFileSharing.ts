// useFileSharing - hook to handle file sharing using the global peer client
//
// Business logic for file sharing

import { useContext } from 'react';
import { FileInfo, OfferMessage, ProtocolMessage, UnOfferMessage, createHelloMessage, isOfferMessage, isProtocolMessage } from '../Protocol';
import { ClientContext } from '../util/ClientContext';

export function useFileSharing() {
    const client = useContext(ClientContext);

    const offerFile = (file: FileInfo) => {
        const offerMessage: OfferMessage = {
            messageType: 'offer',
            offeredFile: file,
        };
        client.sendMessage(offerMessage);
    }

    const unOfferFile = (file: FileInfo) => {
        const offerMessage: UnOfferMessage = {
            messageType: 'unoffer',
            unOfferedFile: file,
        };
        client.sendMessage(offerMessage);
    }

    const actions = {
        offerFile,
        unOfferFile,
    };

    return { client, actions }
}


