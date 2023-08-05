// The protocol between two peers

export type ProtocolMessage = {
    messageType: string
};

export interface HelloMessage extends ProtocolMessage {
    messageType: 'hello',
    id: string,
}

export interface FileInfo {
    name: string,
    size: number,
}

export interface OfferMessage extends ProtocolMessage {
    messageType: 'offer',
    offeredFile: FileInfo,
}

export interface AcceptMessage extends ProtocolMessage {
    messageType: 'accept',
    // Names of files that are accepted
    acceptedFiles: string[],
}

export function createHelloMessage(id: string): HelloMessage {
    return {
        messageType: 'hello',
        id,
    };
}

export function isProtocolMessage(message: any): message is ProtocolMessage {
    return isHelloMessage(message) || isOfferMessage(message) || isAcceptMessage(message);
}

export function isHelloMessage(message: any): message is HelloMessage {
    return message.messageType === 'hello';
}

export function isOfferMessage(message: any): message is OfferMessage {
    return message.messageType === 'offer';
}

export function isAcceptMessage(message: any): message is AcceptMessage {
    return message.messageType === 'accept';
}

