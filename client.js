export default class Client {
    constructor(id) {
        if (id == undefined) {
            // No parameter passed, generate id
            id = Client.id_gen()
        }
        this.id = id;
        this.peer = null;
        this.conns = [];
        this.files = [];

        console.log("Client initiated");
    }

    async init_peer() {
        return new Promise((resolve, reject) => {
            this.peer = new Peer(this.id);

            // Connection to brokering server estabilished
            this.peer.on('open', function (id) {
                console.log('My peer ID is: ' + id);
                resolve()
            });

            // Passive connection opened
            this.peer.on('connection', (conn) => {
                console.log('3 Received new connection:');
                console.dir(conn);

                this.conns.push(conn);
                conn.on('data', function (data) {
                    console.log('2 Received', data);
                });

                conn.on("open", () => {
                    // Send file offer
                    let offer = this.get_file_offer();
                    conn.send(offer)
                });
            });

            this.peer.on('error', function (err) {
                console.log("Error");
                console.dir(err);
                reject();
            });

            console.log("Peer initiated");
        });

    }

    add_file(file_meta) {
        this.files.push(file_meta)
    }

    get_file_offer() {
        return { msg: "file_offer", files: this.files }
    }

    static id_gen() {
        // Source: https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + "-" + S4() + "-" + S4());
    }

    get_status() {
        if (this.conns.length == 0) {
            return "No connection";
        } else {
            let con_ids = this.conns.map((conn) => {
                return conn.peer;
            });
            return `${this.conns.length} connection(s): ${con_ids}`;
        }
    }

    // Connect to peer with id
    // todo callback for connection
    connect(id) {
        let client_ref = this;
        let conn = this.peer.connect(id, { reliable: true, meta_name: "Metaname" });
        this.conns.push(conn);

        // On receiving messages
        conn.on('data', async function (data) {
            console.log('4 Received', data);
            console.log(typeof (data));
            await client_ref.writable?.write(data);
        });

        // When connection is estabilished
        conn.on('open', function () {

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