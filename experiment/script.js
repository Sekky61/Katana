// Select b1 button and in1 text input
const b1 = document.querySelector('#b1');
const b2 = document.querySelector('#b2');
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

peer.on('connection', function (conn) {
    console.log('connection');
    connection = conn;
    console.log(`Connection: ${connection}`);
    conn.on('data', function (data) {
        console.log(data);
    });
});

// On conn2, connect to peer from conn1 field
conn2.addEventListener('click', () => {
    var conn = peer.connect(conn1.value);
    connection = conn;
    conn.on('open', function () {
        console.log("New conn. Sending")
        conn.send('hi!');
    });
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
