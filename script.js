
let name_input = document.querySelector("#name");
let name_btn = document.querySelector("#name_btn");

let input = document.querySelector("#connect");
let connect_btn = document.querySelector("#b");

let message_field = document.querySelector("#message");
let send_btn = document.querySelector("#send");

let conns_dump = document.querySelector("#conns_dump");

var peer;
var conns = [];

send_btn.addEventListener("click", () => {
    let msg = message_field.value;
    console.log("Sending " + msg)
    conns[0].send(msg);
});

name_btn.addEventListener("click", () => {
    let connect_name = name_input.value;
    peer = new Peer(connect_name);

    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
    });

    peer.on('connection', function (conn) {
        console.log('Received new connection: ' + conn);
        console.dir(conn);

        conns.push(conn);
        conn.on('data', function (data) {
            console.log('Received', data);
        });
        conns_dump.innerText = conns;
    });
});

connect_btn.addEventListener("click", () => {
    console.log("cl")
    let in_id = input.value;
    let meta_name = name_input.value;
    console.log(in_id)

    // returns DataConnection
    var conn = peer.connect(in_id, { meta_name });
    conns.push(conn);

    conn.on('open', function () {
        // Receive messages
        conn.on('data', function (data) {
            console.log('Received', data);
        });

        // Send messages
        conn.send('Hello!');
    });
})