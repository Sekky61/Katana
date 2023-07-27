// The protocol between two peers

interface HelloMessage {
    messageType: 'hello',
    id: string,
}

interface FileInfo {
    name: string,
    size: number,
}

interface OfferMessage {
    messageType: 'offer',
    offeredFile: FileInfo,
}

interface AcceptMessage {
    messageType: 'accept',
    acceptedFiles: string[],
}

export type ProtocolMessage = HelloMessage | OfferMessage | AcceptMessage;

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

