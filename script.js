import Client from './client.js'

const name_input = document.querySelector("#name");
const name_btn = document.querySelector("#name_btn");
const copy_id = document.querySelector("#copy_id");

const input = document.querySelector("#connect");
const connect_btn = document.querySelector("#b");

const message_field = document.querySelector("#message");
const send_text_btn = document.querySelector("#send_text");

const conns_dump = document.querySelector("#conns_dump");

const file_in = document.querySelector("#file_in");
const send_file_btn = document.querySelector("#send_file");

const id_display = document.querySelector("#id_display");
const drop_cont = document.querySelector("#drop_cont");

let cl = new Client()
console.log("pog")
update_id_display();

var writable;

// dragover and dragenter events need to have 'preventDefault' called
// in order for the 'drop' event to register. 
// See: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#droptargets
drop_cont.ondragover = drop_cont.ondragenter = function (evt) {
    console.log("Prevented")
    console.log(evt)
    evt.preventDefault();
};

drop_cont.ondrop = function (evt) {
    // pretty simple -- but not for IE :(
    console.dir(evt)
    file_in.files = evt.dataTransfer.files;

    // If you want to use some of the dropped files
    // const dT = new DataTransfer();
    // dT.items.add(evt.dataTransfer.files[0]);
    // dT.items.add(evt.dataTransfer.files[3]);
    // file_in.files = dT.files;

    evt.preventDefault();
};

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

copy_id.addEventListener("click", () => {
    let id = cl.peer.id;
    navigator.clipboard.writeText(id);
});

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
    update_id_display();
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

function update_id_display() {
    let id = cl.peer.id;
    id_display.innerText = id;
}
