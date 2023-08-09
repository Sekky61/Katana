import { ChangeEvent, useEffect } from "react";
import { FileInfo } from "../misc/fileTypes";
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

  // When a file gets unoffered, remove it from the picked files
  useEffect(() => {
    const unOfferedFiles = [...pickedFiles].filter(fileName => !offeredFiles.has(fileName));
    for (const unOfferedFile of unOfferedFiles) {
      pickedFilesActions.remove(unOfferedFile);
    }
  }, [offeredFiles]);

  return (
    <div className="card card-padding flex-grow">
      <h2 className="text-xl pb-4">Offered files</h2>
      <ul className="flex flex-col divide-y border-y border-equator-400 divide-equator-400">
        {[...offeredFiles.values()].map((offeredFile, index) => {
          return <FileListing key={index} isChecked={isChecked(offeredFile.fileInfo.name)} file={offeredFile.fileInfo} onCheck={(checked) => {
            selectFile(offeredFile.fileInfo.name, checked);
          }} />
        })}
      </ul>
      <div className=" flex items-center gap-2 pt-4">
        <button onClick={downloadSelectedFiles} className="button">Download</button>
        <p>(selected {nOfPickedFiles} / {nOfFiles} files)</p>
      </div>
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
    <li className="flex items-center px-1 gap-3 py-1.5 hover:bg-equator-100">
      <input type="checkbox" value={name} className="w-5 h-5 shrink-0 accent-equator-600 bg-gray-100 border-equator-800" onChange={localHandleCheck} checked={isChecked} />
      <div className="flex-grow truncate">{name}</div>
      <div className="whitespace-nowrap text-sm">{prettySize}</div>
    </li>
  );
}
