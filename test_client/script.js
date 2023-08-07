// Select b1 button and in1 text input
const b1 = document.querySelector('#b1');
const b2 = document.querySelector('#b2');
const b3 = document.querySelector('#b3');
const b4 = document.querySelector('#b4');
const in1 = document.querySelector('#in1');
const idid = document.querySelector('#idid');

const conn1 = document.querySelector('#conn1');
const conn2 = document.querySelector('#conn2');
const disconnect = document.querySelector('#disconnect');

const en1 = document.querySelector('#en1');

var send = true;
var peer = new Peer();
var connection;

// show peer id in idid
peer.on('open', function (id) {
    idid.innerHTML = id;
});

function onData(data) {
    console.log("Received:");
    console.dir(data);
}

peer.on('connection', function (conn) {
    conn.on('data', onData);
    connection = conn;
    console.log(`New Connection:`);
    console.dir(conn);
});

// On conn2, connect to peer from conn1 field
conn2.addEventListener('click', () => {
    const text = conn1.value;

    // if text is in form http://localhost:3000/?id=bd5cf31f-007c-4673-818e-1111b4c2bd09, extract id
    const url = new URL(text);
    const id_extracted = url.searchParams.get("id");

    // if id is null, assume text is id
    let id = text;
    if (id_extracted) {
        id = id_extracted;
    }

    console.log(`Trying to connect: ${id}`)
    var conn = peer.connect(id);
    conn.on('data', onData);
    conn.on('open', function () {
        console.log("New conn. Sending")
        conn.send('hi!');
    });
    connection = conn;
});

disconnect.addEventListener('click', () => {
    console.log("Closing connection");
    connection.close();
    connection = null;
});

// Add event listener to b1 button
b1.addEventListener('click', () => {
    send = !send;
});

// b2 button sends message from in1 text input
b2.addEventListener('click', function () {
    if (send) {
        // Send message to server
        connection.send(in1.value);
    }
});

// send a hello message 
// interface HelloMessage {
//     messageType: 'hello',
//     id: string,
// }
b3.addEventListener('click', function () {
    connection.send({
        messageType: 'hello',
        id: peer.id,
    });
});

// File message
// export interface FileInfo {
//     name: string,
//     size: number,
// }

// export interface OfferMessage extends ProtocolMessage {
//     messageType: 'offer',
//     offeredFile: FileInfo,
// }
b4.addEventListener('click', function () {
    connection.send({
        messageType: 'offer',
        offeredFile: {
            name: 'test.txt',
            size: 100,
        }
    });
});

// close connection on window close
window.addEventListener('beforeunload', function () {

    // if en1 is not checked, just shutdown
    if (!en1.checked) {
        return;
    }

    // send bye message
    connection.send({
        messageType: 'bye',
    });

    if (connection) {
        connection.close();
    }

    peer.destroy();
});

// check the checkbox on js start
en1.checked = true;
