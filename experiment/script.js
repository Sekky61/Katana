// Select b1 button and in1 text input
const b1 = document.querySelector('#b1');
const b2 = document.querySelector('#b2');
const b3 = document.querySelector('#b3');
const in1 = document.querySelector('#in1');
const idid = document.querySelector('#idid');

const conn1 = document.querySelector('#conn1');
const conn2 = document.querySelector('#conn2');

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
    console.log('connection');
    conn.on('data', onData);
    connection = conn;
    console.log(`Connection: ${connection}`);
});

// On conn2, connect to peer from conn1 field
conn2.addEventListener('click', () => {
    var conn = peer.connect(conn1.value);
    conn.on('data', onData);
    conn.on('open', function () {
        console.log("New conn. Sending")
        conn.send('hi!');
    });
    connection = conn;
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
