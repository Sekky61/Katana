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
        this.offered_files = [];

        this.files_changed_callback = null;
        this.offered_files_changed_callback = null;


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
                let client_ref = this;

                this.conns.push(conn);
                conn.on('data', function (data) {
                    console.log('2 Received', data);
                    client_ref.handle_message(data);
                });

                conn.on("open", () => {
                    // Send file offer
                    console.log("Send file offer")
                    this.send_file_offer()
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

    register_files_changed_callback(callback) {
        this.files_changed_callback = callback;
    }

    register_offered_files_changed_callback(callback) {
        this.offered_files_changed_callback = callback;
    }

    add_file(file_meta) {
        this.files.push(file_meta)
        console.log(`Files now ${this.files}`)
        if (this.files_changed_callback) {
            this.files_changed_callback(this);
        }
    }

    get_file_offer() {
        let files_meta = [];
        for (const file of this.files) {
            files_meta.push({ name: file.name, size: file.size })
        }
        return { msg_type: "file_offer", files: files_meta }
    }

    send_file_offer() {
        let offer = this.get_file_offer();
        this.send_all(offer);
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
            client_ref.handle_message(data);
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

    request_download(file_name) {
        this.offered_files.forEach((file) => {
            if (file_name === file.name) {
                console.log("Request file download")
                let request = { msg_type: "file_request", file_name: file.name }
                this.send_all(request)
            }
        })
    }

    handle_message(msg) {
        if (!msg) {
            console.error("No message to handle");
            return;
        }
        if (typeof msg !== 'object') {
            console.log(`Non-object message: ${msg}`);
            return;
        }

        if ("msg_type" in msg) {
            let msg_type = msg.msg_type;
            if (msg_type === "file_offer") {
                // New file offer
                console.log("Handle file offer");
                if (!msg.files) {
                    console.error("File offer has no field 'files'");
                }
                this.offered_files = msg.files;
                this.offered_files_changed_callback(this);
            } else if (msg_type === "file_request") {
                console.log("Handle file request");
                if (!msg.file_name) {
                    console.error("File offer has no field 'file_name'");
                }

                // Lookup file and send it
                this.files.forEach((file) => {
                    if (msg.file_name === file.name) {
                        console.log("Sending file")
                        parseFile(file, (file_string) => {
                            this.send_all(file_string)
                        })
                    }
                });
            } else {
                console.error(`Unrecognised msg type: ${msg_type}`);
            }
        }
    }
}

function parseFile(file, callback) {
    var fileSize = file.size;
    var chunkSize = 1 * 64; // bytes
    var offset = 0;
    var chunkReaderBlock = null;

    chunkReaderBlock = function (_offset, length, _file) {
        var blob = _file.slice(_offset, length + _offset);
        console.log("blob")
        console.dir(blob)

        blob.arrayBuffer()
            .then((array) => {
                console.log("Loaded");
                console.dir(array);
                callback(array)
                offset += array.byteLength;
                if (offset >= fileSize) {
                    return;
                }
                chunkReaderBlock(offset, chunkSize, file);
            })
            .catch((e) => console.log(e))
    }

    // now let's start the read with the first block
    chunkReaderBlock(offset, chunkSize, file);
}