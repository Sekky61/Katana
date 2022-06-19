export default class Client {
    constructor(id) {
        if (id == undefined) {
            // No parameter passed, generate id
            id = Client.id_gen()
        }
        console.log(`Gen ${id}`)
        this.peer = new Peer(id);
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

    static id_gen() {
        // Source: https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
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