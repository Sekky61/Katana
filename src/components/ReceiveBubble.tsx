import { ChangeEvent, useState } from "react";
import { FileInfo } from "../misc/Protocol";
import { useFileSharingClientContext } from "../misc/FileSharingClientContext";
import prettyBytes from "pretty-bytes";
import { useSet } from "../hooks/useSet";

// Files available to download will be listed here
export default function ReceiveBubble() {

  const { offeredFiles, acceptFiles } = useFileSharingClientContext();
  const [pickedFiles, pickedFilesActions] = useSet<string>();

  const nOfFiles = offeredFiles.size;
  const nOfPickedFiles = pickedFiles.size;

  const isChecked = (fileName: string) => {
    return pickedFiles.has(fileName);
  }

  const selectFile = (file: string, check: boolean) => {
    if (check) {
      pickedFilesActions.add(file);
    } else {
      pickedFilesActions.remove(file);
    }
  }

  const downloadSelectedFiles = () => {
    const pickedFileInfos = [...pickedFiles].map(fileName => {
      const fileInfo = offeredFiles.get(fileName);
      if (!fileInfo) {
        throw new Error(`File ${fileName} not found in offered files`);
      }
      return fileInfo.fileInfo;
    });

    acceptFiles(pickedFileInfos);
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
            return <FileListing key={index} isChecked={isChecked(offeredFile.fileInfo.name)} file={offeredFile.fileInfo} onCheck={(checked) => {
              selectFile(offeredFile.fileInfo.name, checked);
            }} />
          })}
        </ul>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button onClick={downloadSelectedFiles} className="button">Download</button>
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
