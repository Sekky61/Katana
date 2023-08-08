// The protocol between two peers

import { FileInfo } from "./fileTypes";

export type Protocol = ProtocolMsg.Hello
  | ProtocolMsg.Offer
  | ProtocolMsg.Accept
  | ProtocolMsg.UnOffer
  | ProtocolMsg.FileContent;

export namespace ProtocolMsg {

  export type ProtocolMessageBase = {
    messageType: string
  };

  export interface Hello extends ProtocolMessageBase {
    messageType: 'hello',
    id: string,
  }

  export interface Offer extends ProtocolMessageBase {
    messageType: 'offer',
    offeredFile: FileInfo,
  }

  export interface UnOffer extends ProtocolMessageBase {
    messageType: 'unoffer',
    unOfferedFile: FileInfo,
  }

  export interface Accept extends ProtocolMessageBase {
    messageType: 'accept',
    // Names of files that are accepted
    acceptedFiles: string[],
  }

  export interface FileContent extends ProtocolMessageBase {
    messageType: 'fileContent',
    fileInfo: FileInfo,
    content: ArrayBuffer,
  }
}

export function createHelloMessage(id: string): ProtocolMsg.Hello {
  return {
    messageType: 'hello',
    id,
  };
}

export function isProtocolMessage(message: any): message is Protocol {
  return isHelloMessage(message) || isOfferMessage(message) || isAcceptMessage(message) || isUnOfferMessage(message) || isFileContentMessage(message);
}

export function isHelloMessage(message: any): message is ProtocolMsg.Hello {
  return message.messageType === 'hello';
}

export function isOfferMessage(message: any): message is ProtocolMsg.Offer {
  return message.messageType === 'offer';
}

export function isAcceptMessage(message: any): message is ProtocolMsg.Accept {
  return message.messageType === 'accept';
}

export function isUnOfferMessage(message: any): message is ProtocolMsg.UnOffer {
  return message.messageType === 'unoffer';
}

export function isFileContentMessage(message: any): message is ProtocolMsg.FileContent {
  return message.messageType === 'fileContent';
}

