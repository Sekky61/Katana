// Display information about yourself and the peer

import { useFileSharingClientContext } from "../misc/FileSharingClientContext";
import { QrCode } from "./QrCode";

// Create link to share
// If the url already contains an id, overwrite it
function getShareLink(peerId: string) {
  const base = new URL(document.URL);
  base.searchParams.set('id', peerId);
  return base.href;
}

function ShareLink() {
  const { client: { peerId } } = useFileSharingClientContext();

  if (!peerId) {
    return (
      <div className="bg-white rounded">
        <div className="flex justify-center">
          <Spinner></Spinner>
        </div>
      </div>
    )
  }

  const link = getShareLink(peerId);

  return (
    <div className="bg-white rounded ">
      <div className="flex justify-center">
        <QrCode link={link}></QrCode>
      </div>
      <div className="flex justify-center pb-1">
        <CopyLinkButton link={link}></CopyLinkButton>
      </div>
    </div>
  );
}

// Connection window
//
// Allow user to copy the link to join the session
// Displays the status of the connection
export default function ConnectionWindow() {
  const { client: { isConnected, peerId } } = useFileSharingClientContext();

  return (
    <div className='bg-orange-300 rounded px-4 py-1'>
      <div className="flex justify-center gap-2">
        <div className="bg-orange-400 p-2 rounded w-48">
          <h2 className="text-xl">You</h2>
          <ShareLink></ShareLink>
        </div>
        <div className="flex items-center">
          <span className="text-4xl p-2">...</span>
        </div>
        <div className="bg-orange-400 p-2 rounded w-48 flex flex-col">
          <h2 className="text-xl">The other</h2>
          <div className="flex justify-center items-center p-4 flex-grow">
            {isConnected ?
              <p>Connected</p> :
              <Spinner></Spinner>
            }
          </div>
          <p>Wait for the other side to connect to you</p>
        </div>
      </div>
      <p className="py-2">Share the ID with the other computer to make a connection. Keep this a secret, everybody who knows your ID can send you files.</p>
    </div>
  )
}

function Spinner() {
  return (
    <div role="status">
      <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin animation-duration-2000 fill-orange-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
      <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
    </svg>

  );
}

function CopyLinkButton({ link }: { link: string }) {
  const copyText = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <button onClick={copyText} className="relative group flex items-center rounded px-1.5 py-0.5 border bg-orange-200 hover:bg-orange-500 hover:text-white active:bg-orange-700">
      <LinkIcon></LinkIcon>
      <span className="text-md">Copy Link</span>
      <span className="absolute bottom-full -left-8 bg-white text-black rounded drop-shadow border p-1 mb-2 hidden group-hover:block">{link}</span>
    </button>
  );
}
