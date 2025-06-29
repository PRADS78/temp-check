import Resumablejs from "resumablejs";
import FileHelpers from "../utils/FileHelpers";
import { useRef } from "react";
import { FileUploadErrorMessage } from "../../../Enums";

const useResumable = ({
  simultaneousUploads = 5,
  fileContextType,
  attachmentId,
  Urls,
  accessToken,
  onUpdateProgress,
  onUploadFailed,
  onUploadComplete,
}) => {
  const resumable = useRef(null);
  const { baseUrl, endPoint } = Urls;

  const initializeResumable = () => {
    resumable.current = new Resumablejs({
      query: { fileId: 0 },
      testChunks: false,
      withCredentials: false,
      prioritizeFirstAndLastChunk: true,
      simultaneousUploads,
    });
    resumable.current.defaults.headers = {
      "Access-Token": accessToken,
      contextType: fileContextType,
      fileIdentifier: FileHelpers.uniqueId(),
      attachmentId: attachmentId,
    };
    resumable.current.opts.target = `${baseUrl}${endPoint}`;
    resumable.current.on("fileAdded", onFileAdded);
    resumable.current.on("fileSuccess", onUploadSuccess);
    resumable.current.on("progress", onUploadProgress);
    resumable.current.on("fileError", onUploadError);
  };

  /**
   * Resumablejs callback functions
   */

  const onFileAdded = (resumableFile) => {
    const { file } = resumableFile;
    resumableFile.resumableObj.upload();
    onUpdateProgress(file, 0);
  };

  const onUploadSuccess = (resumableFile, uploadResponse) => {
    const { file } = resumableFile;
    resumable.current.removeFile(file);
    onUploadComplete(uploadResponse, file);
  };

  const onUploadProgress = () => {
    const resumableFile = resumable.current.files[0];
    if (resumableFile) {
      const { file } = resumableFile;
      const percentage = Math.floor(resumable.current.progress() * 100);
      onUpdateProgress(file, percentage);
    }
  };

  const onUploadError = (file) => {
    onUploadFailed(file, FileUploadErrorMessage.FILE_UPLOAD_ERROR);
  };

  /**
   * Component callback functions
   */
  const addFile = (file) => {
    initializeResumable();
    const fileSize = FileHelpers.formatBytes(file.size).split(" ");
    let chunkSize = FileHelpers.getChunkSizeFromFileSize(
      fileSize[0],
      fileSize[1]
    );
    resumable.current.opts.chunkSize = chunkSize;
    resumable.current.addFile(file);
  };

  const removeFile = (file) => {
    resumable.current.cancel();
    resumable.current.removeFile(file);
  };

  return {
    addFile,
    removeFile,
  };
};

export default useResumable;
