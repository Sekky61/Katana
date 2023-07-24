import { Peer } from "peerjs";

interface IClientState {
    // Id of the client
    id: string,
    // Peer object (from peerjs)
    peer: Peer,
    // List of files that the client wants to share
    registered_files: string[],
}

function id_gen(): string {
    // Source: https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + "-" + S4() + "-" + S4());
}

// State transitions for the client
export const reducer = (state: IClientState, action: any): IClientState => {
    switch (action.type) {
        case "toggle_button":
            return {
                ...state,
                id: id_gen(),
            }
        case "set_open_callback":
            state.peer.on('open', action.callback);
            return state;
        default:
            return state
    }
}

// Initial state for the client
export function create_initial_client(): IClientState {
    const id = id_gen();
    return {
        id,
        peer: new Peer(id),
        registered_files: [],
    }
}
