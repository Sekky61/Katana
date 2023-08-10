// Display information about yourself and the peer

import { useFileSharingClientContext } from "../misc/FileSharingClientContext";
import { CheckCircle } from "../misc/icons/CheckCircle";
import { LinkIcon } from "../misc/icons/LinkIcon";
import { QrCode } from "./QrCode";
import { Spinner } from "./Spinner";

// Create link to share
// If the url already contains an id, overwrite it
function getShareLink(peerId: string) {
  const base = new URL(document.URL);
  base.searchParams.set('id', peerId);
  return base.href;
}

function ShareLink() {
  const { client: { peerId } } = useFileSharingClientContext();
  const link = peerId ? getShareLink(peerId) : null;
  const qr = <QrCode link={link}></QrCode>;
  const showLoading = !peerId || !qr;

  // The placeholder is 176 + 36 = 212px

  return (
    <div className="bg-white rounded w-[176px]">
      {
        showLoading ?
          <div className="flex justify-center items-center w-[176px] h-[212px]">
            <Spinner></Spinner>
          </div>
          :
          <div className="flex flex-col justify-between items-center h-full">
            <div className="w-[176px] h-[176px] rounded overflow-hidden">
              {qr}
            </div>
            <div className="w-full border-t flex items-center justify-center">
              <CopyLinkButton link={link || ""}></CopyLinkButton>
            </div>
          </div>
      }
    </div>
  );
}

// Connection window
//
// Allow user to copy the link to join the session
// Displays the status of the connection
export default function ConnectionWindow() {
  const { client: { isConnected } } = useFileSharingClientContext();

  return (
    <div className=' card-padding'>
      <div className="flex flex-wrap justify-center gap-2">
        <div className="full-card w-52">
          <h2 className="text-xl mb-1">You</h2>
          <ShareLink></ShareLink>
        </div>
        <div className="flex items-center">
          <span className="hidden sm:block text-4xl p-3">...</span>
        </div>
        <div className="full-card w-52 flex flex-col">
          <h2 className="text-xl mb-1">The other</h2>
          {isConnected ?
            <div className="flex flex-col justify-center items-center p-4 flex-grow">
              <CheckCircle></CheckCircle>
              <p className="text-lg">Connected</p>
            </div> :
            <div className="flex flex-col justify-center items-center flex-grow">
              <div className="flex-grow flex flex-col justify-center">
                <Spinner></Spinner>
              </div>
              <p className="text-center">Wait for the other side to connect to you</p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

function CopyLinkButton({ link }: { link: string }) {
  const copyText = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="relative group w-full h-9">
      <button onClick={copyText} className="flex justify-center items-center rounded-b-lg px-4 py-2 w-full group-hover:bg-equator-50 active:!bg-equator-100">
        <LinkIcon></LinkIcon>
        <span className="text-md">Copy Link</span>
      </button>
      <div className="hidden group-hover:block absolute bottom-full left-0 right-0 -mx-14">
        <div className="card text-black p-2 drop-shadow text-center">
          <div>{link}</div>
          <div className="mt-2">Share this link with your buddy</div>
        </div>
        <div className="w-full h-2"></div>
      </div>
    </div>
  );
}
