import Client from './client.js'

const name_input = document.querySelector("#name");
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
const offered_file_list = document.querySelector("#offered_file_list");

async function construct_client(id) {
    let client = new Client(id);
    await client.init_peer();

    client.register_files_changed_callback((client) => {
        console.log(`Client callback 1 ${client.files}`)

        let ul = document.createElement("ul");
        for (const file of client.files) {
            let li = document.createElement("li");
            li.innerText = file.name;
            ul.appendChild(li);
        }
        if (file_list.children.length == 0) {
            file_list.appendChild(ul)
        } else {
            file_list.childNodes[0].replaceWith(ul)
        }
    });

    client.register_offered_files_changed_callback((client) => {
        console.log(`Client callback 2 ${client.offered_files}`)

        let ul = document.createElement("ul");
        for (const file of client.offered_files) {
            let li = document.createElement("li");
            li.setAttribute("file_name", file.name)
            li.onclick = (e) => {
                let file_name = li.getAttribute("file_name");
                console.log(`File ${file_name} clicked.`);
                cl.request_download(file_name);
            }
            li.innerText = file.name;
            ul.appendChild(li);
        }
        if (offered_file_list.children.length == 0) {
            offered_file_list.appendChild(ul)
        } else {
            offered_file_list.childNodes[0].replaceWith(ul)
        }
    });

    return client;
}

var cl = await construct_client();
console.dir(cl)
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

drop_cont.ondrop = function (evt) {
    console.log("File dropped")

    // Append dropped files to input field
    for (const file of evt.dataTransfer.files) {
        cl.add_file(file)
    }

    evt.preventDefault();
    cl.send_file_offer()
};

file_upload.onchange = function (e) {
    console.log("File picked")

    console.dir(e)
    console.dir(file_upload)

    for (const file of file_upload.files) {
        cl.add_file(file)
    }
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
    console.error("Depr")
    // let file = file_upload.files[0];
    // console.dir(file)

    // parseFile(file, (file_string) => {
    //     cl.send_all(file_string)
    // })
});

connect_btn.addEventListener("click", () => {
    console.log("cl")
    let in_id = input.value;

    cl.connect(in_id)
    update_conn_status()
})

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
