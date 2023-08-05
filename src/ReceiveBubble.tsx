import { useEffect, useState } from "react";
import { useClient } from "./ClientContext";
import { FileInfo, OfferMessage, isOfferMessage } from "./Protocol";

// To keep track of which files are selected, being downloaded
interface FileMetadata {
    file: FileInfo;
    selected: boolean;
    download_state: 'not_started' | 'in_progress' | 'finished';
}

type FileMetadataMap = Map<string, FileMetadata>;

// Files available to download will be listed here
export default function ReceiveBubble() {

    const { offeredFiles } = useClient();

    const [files, setFiles] = useState<FileMetadataMap>(new Map());
    const nOfFiles = files.size;
    const nOfPickedFiles = Array.from(files.values()).filter((file) => file.selected).length;

    // When new offer comes in, add it to the list of files
    // Todo register a callback in the client context
    useEffect(() => {
        console.log("offeredFiles changed:");
        console.log(offeredFiles);
        for (const file of offeredFiles) {
            if (!files.has(file.name)) {
                files.set(file.name, {
                    file: file,
                    selected: false,
                    download_state: 'not_started',
                });
            }
        }
        setFiles(new Map(files));
    }, [offeredFiles]);

    const setFile = (filename: string, file: FileMetadata) => {
        files.set(filename, file);
        setFiles(new Map(files));
    }

    console.dir(files);

    const handleDownload = () => {
    }

    return (
        <div className="bg-orange-300 rounded p-1 flex-grow">
            <h2>Receive</h2>
            <p>Connection status: <span id="conn_status"></span></p>
            <h3>Offered files</h3>
            <FilePicker files={files} setFile={setFile}></FilePicker>
            <p>Files selected: {nOfPickedFiles} / {nOfFiles}</p>
            <button onClick={handleDownload}>Download</button>
        </div>
    );
}

function FilePicker({ files, setFile }: { files: FileMetadataMap, setFile: (filename: string, file: FileMetadata) => void }) {

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const filename = event.target.value;

        const file = files.get(filename);

        if (!file) {
            throw new Error("File not found in map");
        }

        file.selected = checked;
        setFile(filename, file);
    }

    return (
        <div>
            <ul className="flex flex-col gap-1">
                {[...files.values()].map((file, index) => {
                    return <FileListing key={index} file={file} handleCheck={handleCheck} />
                })}
            </ul>
        </div>
    )
}

interface FileListingProps {
    file: FileMetadata;
    handleCheck: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileListing({ file, handleCheck }: FileListingProps) {
    const { download_state, selected, file: { name, size } } = file;

    const [checked, setChecked] = useState(selected);

    const localHandleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        handleCheck(event);
    };

    return (
        <li className="flex border px-2">
            <input type="checkbox" value={name} className="w-4 mr-2" onChange={localHandleCheck} checked={checked} />
            <div className="flex-grow">{name}</div>
            <div>{size}B</div>
        </li>
    );
}
