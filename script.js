import Client from './client.js'

let cl = new Client()

var writable;

document.querySelector("#close").onclick = async () => {
    await cl.writable.close()
}

document.querySelector("#save-file").onclick = async () => {
    const options = {
        types: [
            {
                description: "Test files",
                accept: {
                    "text/plain": [".txt"],
                },
            },
        ],
    };

    const handle = await window.showSaveFilePicker(options);
    console.dir(handle)
    writable = await handle.createWritable();
    console.dir(writable)
    cl.writable = writable;
}

const name_input = document.querySelector("#name");
const name_btn = document.querySelector("#name_btn");

const input = document.querySelector("#connect");
const connect_btn = document.querySelector("#b");

const message_field = document.querySelector("#message");
const send_text_btn = document.querySelector("#send_text");

const conns_dump = document.querySelector("#conns_dump");

const file_in = document.querySelector("#file_in");
const send_file_btn = document.querySelector("#send_file");

send_text_btn.addEventListener("click", () => {
    let msg = message_field.value;
    console.log("Sending " + msg)
    cl.send_all(msg)
});

send_file_btn.addEventListener("click", () => {
    let file = file_in.files[0];
    console.dir(file)

    parseFile(file, (file_string) => {
        cl.send_all(file_string)
    })
});

name_btn.addEventListener("click", () => {
    let connect_name = name_input.value;
    cl = new Client(connect_name)
});

connect_btn.addEventListener("click", () => {
    console.log("cl")
    let in_id = input.value;
    let meta_name = name_input.value;
    console.log(in_id)

    cl.connect(in_id)
})

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
