export default class Client {
    constructor(name) {
        this.peer = new Peer(name);
        this.conns = [];

        this.peer.on('open', function (id) {
            console.log('My peer ID is: ' + id);
        });

        this.peer.on('connection', (conn) => {
            console.log('Received new connection: ' + conn);
            console.dir(conn);

            this.conns.push(conn);
            conn.on('data', function (data) {
                console.log('Received', data);
            });
            conns_dump.innerText = this.conns.toString();
        });

        console.log("Client initiated");
    }

    connect(id) {
        // returns DataConnection
        let client_ref = this;
        let conn = client_ref.peer.connect(id); // options { meta_name }
        this.conns.push(conn);

        conn.on('open', function () {
            // Receive messages
            conn.on('data', async function (data) {
                console.log('Received', data);
                console.log(typeof (data));
                await client_ref.writable?.write(data);
            });

            // Send messages
            conn.send('Hello!');
        });

        conn.on('error', function (err) { console.dir(err) });
    }

    send_all(msg) {
        for (const con of this.conns) {

            con.send(msg)
            console.log("tick")
        }
    }
}