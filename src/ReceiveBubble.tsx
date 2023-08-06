import { ChangeEvent, useEffect, useState } from "react";
import { FileInfo, OfferMessage, isOfferMessage } from "./Protocol";
import { useFileSharingClientContext } from "./util/FileSharingClientContext";

// Files available to download will be listed here
export default function ReceiveBubble() {

    const { offeredFiles } = useFileSharingClientContext();
    const [pickedIndexes, setPickedIndexes] = useState<number[]>([]);

    const nOfFiles = offeredFiles.size;
    const nOfPickedFiles = pickedIndexes.length;

    const isChecked = (index: number) => {
        return pickedIndexes.includes(index);
    }

    const selectFile = (index: number, check: boolean) => {
        if (check) {
            // if it's not already in the list, add it
            if (!pickedIndexes.includes(index)) {
                setPickedIndexes([...pickedIndexes, index]);
            }
        } else {
            setPickedIndexes(pickedIndexes.filter((i) => i !== index));
        }
    }

    const handleDownload = () => {
    }

    return (
        <div className="bg-orange-300 rounded p-1 flex-grow">
            <h2>Receive</h2>
            <p>Connection status: <span id="conn_status"></span></p>
            <h3>Offered files</h3>
            <div>
                <ul className="flex flex-col gap-1">
                    {[...offeredFiles.values()].map((offeredFile, index) => {
                        return <FileListing key={index} isChecked={isChecked(index)} file={offeredFile.fileInfo} onCheck={(checked) => {
                            selectFile(index, checked);
                        }} />
                    })}
                </ul>
            </div>
            <p>Files selected: {nOfPickedFiles} / {nOfFiles}</p>
            <button onClick={handleDownload}>Download</button>
        </div>
    );
}

interface FileListingProps {
    isChecked: boolean;
    file: FileInfo;
    onCheck: (checked: boolean) => void;
}

function FileListing({ isChecked, file, onCheck }: FileListingProps) {
    const { name, size } = file;

    const localHandleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        onCheck(checked);
    };

    return (
        <li className="flex border px-2">
            <input type="checkbox" value={name} className="w-4 mr-2" onChange={localHandleCheck} checked={isChecked} />
            <div className="flex-grow">{name}</div>
            <div>{size}B</div>
        </li>
    );
}
