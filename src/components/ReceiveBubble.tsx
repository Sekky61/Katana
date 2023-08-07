import { ChangeEvent, useState } from "react";
import { FileInfo } from "../misc/Protocol";
import { useFileSharingClientContext } from "../misc/FileSharingClientContext";
import prettyBytes from "pretty-bytes";

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
    <div className="bg-orange-300 rounded flex-grow">
      <div className="p-1">
        <h2 className="text-xl">Download files</h2>
        <h3>Offered files</h3>
      </div>
      <div>
        <ul className="flex flex-col divide-y-2 border-y-2 border-white divide-white">
          {[...offeredFiles.values()].map((offeredFile, index) => {
            return <FileListing key={index} isChecked={isChecked(index)} file={offeredFile.fileInfo} onCheck={(checked) => {
              selectFile(index, checked);
            }} />
          })}
        </ul>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button onClick={handleDownload} className="button">Download</button>
        <p>(selected {nOfPickedFiles} / {nOfFiles} files)</p>
      </div>
      <div className="w-8 h-8"></div>
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
  const prettySize = prettyBytes(size);

  const localHandleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    onCheck(checked);
  };

  return (
    <li className="flex items-center px-1 gap-3 py-1">
      <input type="checkbox" value={name} className="w-5 h-5 shrink-0 accent-orange-600 bg-gray-100 border-gray-300" onChange={localHandleCheck} checked={isChecked} />
      <div className="flex-grow truncate">{name}</div>
      <div className="whitespace-nowrap text-sm">{prettySize}</div>
    </li>
  );
}
