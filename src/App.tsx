import React, { useContext } from 'react';
import { ClientProvider, ClientContext, useClient } from './ClientContext'
import Client from './client';

function SendBubble() {

  const { client, toggle } = useClient();

  const handleClick = () => {
    toggle();
  }

  return (
    <div className="left">
      <h2>Send</h2>
      <button onClick={handleClick}>clll</button>
      <div className="share">
        <div className="share_bubble">
          <span>Your ID: <span id="id_display"></span></span>
          <button id="copy_link">Copy link to clipboard <i className="fa-solid fa-clipboard"></i></button>
        </div>
        <div className="share_bubble">
          <span>Or scan this</span>
          <div id="qr_space">
            {/* 128x128 qr */}
          </div>
        </div>
      </div>
      <div id="drop_cont">
        <div className="empty_upload">
          <label htmlFor="file_upload" className="custom-file-upload">
            <i className="fa fa-cloud-upload"></i> Click here to upload or drag and drop
          </label>
          <input type="file" id="file_upload" multiple />
        </div>
        <div className="not_empty_upload">
          <div className="upload_list_toolbar"></div>
          <div id="file_list"></div>
        </div>
      </div>
    </div>
  );
}

function ReceiveBubble() {

  const { client, toggle } = useClient();

  const stateAsString = JSON.stringify(client, null, 2);

  return (
    <div className="right">
      <h2>Receive</h2>
      <p>State: {stateAsString}</p>
      <p>Connection status: <span id="conn_status"></span></p>
      <div id="offered_file_list"></div>
    </div>
  );
}

function Page() {
  return (
    <div className="container mx-auto px-4 mt-20">
      <h1 className='text-4xl mb-10'>File sender</h1>

      <div className="flex">
        <SendBubble />
        <ReceiveBubble />
      </div>
    </div>
  );
}

function App() {

  return (
    <ClientProvider>
      <Page />
    </ClientProvider>
  );
}

export default App;
