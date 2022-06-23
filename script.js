import Client from './client.js'

const name_input = document.querySelector("#name");
const name_btn = document.querySelector("#name_btn");
const copy_link = document.querySelector("#copy_link");
const qr_space = document.querySelector("#qr_space");

const conn_status = document.querySelector("#conn_status");

const input = document.querySelector("#connect");
const connect_btn = document.querySelector("#connect_button");

const file_upload = document.querySelector("#file_upload");
const send_file_btn = document.querySelector("#send_file");

const id_display = document.querySelector("#id_display");
const drop_cont = document.querySelector("#drop_cont");
const file_list = document.querySelector("#file_list");

var cl = new Client()
await cl.init_peer();
var qrcode;

check_url_params();
update_id_display();
update_conn_status();

var writable;

// Connect, if site is loaded with id param
function check_url_params() {
    let url = new URL(window.location);
    let id_param = url.searchParams.get('id')
    console.log("read and connecting to --")
    console.log(id_param)

    if (id_param !== null) {
        console.log("Actually connecting")
        cl.connect(id_param)
        update_conn_status()

    }
}

// dragover and dragenter events need to have 'preventDefault' called
// in order for the 'drop' event to register. 
// See: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#droptargets
drop_cont.ondragover = drop_cont.ondragenter = function (evt) {
    evt.preventDefault();
};

// Updates both Client and UI
function update_file_list() {
    cl.files = file_upload.files;
    let ul = document.createElement("ul");
    for (const file of file_upload.files) {
        let li = document.createElement("li");
        li.innerText = file.name;
        ul.appendChild(li);
    }
    if (file_list.children.length == 0) {
        file_list.appendChild(ul)
    } else {
        file_list.childNodes[0].replaceWith(ul)
    }
}

drop_cont.ondrop = function (evt) {
    console.log("File dropped")
    console.dir(file_upload)
    let updated_file_list = new DataTransfer();
    // Append dropped files to input field
    for (const file of file_upload.files) {
        updated_file_list.items.add(file)
    }
    for (const file of evt.dataTransfer.files) {
        updated_file_list.items.add(file)
    }

    file_upload.files = updated_file_list.files;

    evt.preventDefault();
    update_file_list()
    cl.send_file_offer()
};

file_upload.onchange = function (e) {
    console.log("File picked")

    console.dir(e)
    console.dir(file_upload)
    update_file_list()
    cl.send_file_offer()
};

document.querySelector("#close").onclick = async () => {
    await cl.writable.close()
}

// Opens file for writing
// Creates writeable attribute on client
document.querySelector("#save_file").onclick = async () => {
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

copy_link.addEventListener("click", () => {
    let id = cl.peer.id;
    let link = get_link(id);
    navigator.clipboard.writeText(link);
});

send_file_btn.addEventListener("click", () => {
    let file = file_upload.files[0];
    console.dir(file)

    parseFile(file, (file_string) => {
        cl.send_all(file_string)
    })
});

name_btn.addEventListener("click", async () => {
    let connect_name = name_input.value;
    cl = new Client(connect_name)
    await cl.init_peer();
    update_id_display();
});

connect_btn.addEventListener("click", () => {
    console.log("cl")
    let in_id = input.value;

    cl.connect(in_id)
    update_conn_status()
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

function update_conn_status() {
    conn_status.innerText = cl.get_status()
}

function get_link(id) {
    let url = new URL(window.location);
    url.searchParams.set('id', id)
    return url.toString()
}

function update_id_display() {
    let id = cl.peer && cl.peer.id;

    let link = get_link(id);

    id_display.innerText = id;

    if (qrcode !== undefined) {
        qrcode.clear(); // clear the code.
        qrcode.makeCode(link);
    } else {
        qrcode = new QRCode(qr_space, {
            text: link,
            width: 128,
            height: 128,
            colorDark: '#000',
            colorLight: '#fff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}
