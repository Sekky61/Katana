// The protocol between two peers

export type ProtocolMessage = HelloMessage | OfferMessage | AcceptMessage | UnOfferMessage | FileContentMessage;

export type ProtocolMessagebase = {
  messageType: string
};

export interface HelloMessage extends ProtocolMessagebase {
  messageType: 'hello',
  id: string,
}

export interface FileInfo {
  name: string,
  size: number,
}

export interface OfferMessage extends ProtocolMessagebase {
  messageType: 'offer',
  offeredFile: FileInfo,
}

export interface UnOfferMessage extends ProtocolMessagebase {
  messageType: 'unoffer',
  unOfferedFile: FileInfo,
}

export interface AcceptMessage extends ProtocolMessagebase {
  messageType: 'accept',
  // Names of files that are accepted
  acceptedFiles: string[],
}

export interface FileContentMessage extends ProtocolMessagebase {
  messageType: 'fileContent',
  fileInfo: FileInfo,
  content: ArrayBuffer,
}

export function createHelloMessage(id: string): HelloMessage {
  return {
    messageType: 'hello',
    id,
  };
}

export function isProtocolMessage(message: any): message is ProtocolMessage {
  return isHelloMessage(message) || isOfferMessage(message) || isAcceptMessage(message) || isUnOfferMessage(message) || isFileContentMessage(message);
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

export function isUnOfferMessage(message: any): message is UnOfferMessage {
  return message.messageType === 'unoffer';
}

export function isFileContentMessage(message: any): message is FileContentMessage {
  return message.messageType === 'fileContent';
}

