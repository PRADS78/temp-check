import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./FileUpload.module.scss";
import DropZone from "./components/DropZone/DropZone";
import { useResumable } from "./resumable";
import FileHelpers from "./utils/FileHelpers";
import UploadProgressItem from "./components/UploadProgress/UploadProgressItem";
import UploadedFile from "./components/UploadedFile/UploadedFile";
import { useMemo } from "react";
import { useCallback } from "react";

const FileUpload = ({
  ctrCls,
  isMultiple,
  maxFileSize,
  maxNoOfFiles,
  supportedFormats,
  Urls,
  accessToken,
  fileContextType,
  attachmentId,
  isInteractive,
  onCompleted,
  onProgress,
  onCancel,
  onDelete,
  onError,
}) => {
  const { baseUrl, completionEndPoint } = Urls;
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const onUpdateProgress = useCallback(
    (file, progress) => {
      updateUploadProgress(file, progress);
      onProgress(file);
    },
    [onProgress]
  );

  const onUploadFailed = useCallback(
    (file, error) => {
      setErrorMessage(error);
      updateUploadProgress(file, 0);
      onError(file, error);
    },
    [onError]
  );

  const onUploadCancel = (file) => {
    removeFile(file);
    onCancel(file);
    setErrorMessage("");
  };

  const fileUploadComplete = useCallback(
    (file, uploadedFile) => {
      file.fileId = new Date().getTime();
      file.referenceFileUrl = file.url;
      file.sharedReferenceFileUrl = file.consumableUrl;
      addUploadedFile(file);
      updateUploadProgress(uploadedFile, 0);
      removeSelectedFile(uploadedFile);
      setErrorMessage("");
      removeFile(file);
      onCompleted(file);
    },
    [removeFile, onCompleted]
  );

  const onUploadComplete = useCallback(
    (payload, file) => {
      const url = `${baseUrl}${completionEndPoint}`;
      fetch(url, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Token": accessToken,
          contextType: fileContextType,
          isInteractive: isInteractive,
          attachmentId: attachmentId,
        },
        body: payload,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          fileUploadComplete(responseJson, file);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [
      accessToken,
      baseUrl,
      fileContextType,
      attachmentId,
      isInteractive,
      completionEndPoint,
      fileUploadComplete,
    ]
  );

  const resumableProps = useMemo(() => {
    return {
      Urls,
      accessToken,
      fileContextType,
      attachmentId,
      onUpdateProgress,
      onUploadComplete,
      onUploadFailed,
    };
  }, [
    Urls,
    accessToken,
    fileContextType,
    attachmentId,
    onUpdateProgress,
    onUploadComplete,
    onUploadFailed,
  ]);

  const { addFile, removeFile } = useResumable(resumableProps);

  const addSelectedFile = (file) => {
    file.id = new Date().getTime();
    file.uploadProgress = null;
    setSelectedFiles(file);
    addFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFiles(null);
  };

  const addUploadedFile = (file) => {
    setUploadedFiles((prevState) => [...prevState, file]);
  };

  const removeUploadedFile = (file) => {
    const { fileId } = file;
    setUploadedFiles((prevState) => {
      const uploadedFiles = prevState.filter((file) => file.fileId !== fileId);
      return [...uploadedFiles];
    });
  };

  const updateUploadProgress = (file, progress) => {
    setSelectedFiles((prevState) => {
      let file = structuredClone(prevState);
      file.uploadProgress = progress;
      return file;
    });
  };

  const onClickDownload = (file) => {
    const { sharedReferenceFileUrl } = file;
    FileHelpers.downloadUrlAsFile(sharedReferenceFileUrl);
  };

  const onClickDelete = (file) => {
    removeUploadedFile(file);
    onDelete(file);
  };

  const renderDropZoneContainer = () => {
    return (
      <DropZone
        ctrCls={selectedFiles !== null ? styles.isDisabled : ""}
        supportedFormats={supportedFormats}
        maxNoOfFiles={maxNoOfFiles}
        maxFileSize={maxFileSize}
        uploadedNoOfFiles={uploadedFiles.length}
        onSelect={addSelectedFile}
      />
    );
  };

  return (
    <div className={`${styles.innerContainer} ${ctrCls}`} role="region">
      {isMultiple
        ? renderDropZoneContainer()
        : selectedFiles == null &&
          uploadedFiles.length <= 0 &&
          renderDropZoneContainer()}

      {selectedFiles != null && (
        <UploadProgressItem
          key={selectedFiles.id}
          selectedFiles={selectedFiles}
          errorMessage={errorMessage}
          cancelUpload={onUploadCancel}
          removeSelectedFile={removeSelectedFile}
        />
      )}

      {uploadedFiles.length > 0 && (
        <UploadedFile
          showDownload={true}
          showDelete={true}
          onClickDelete={onClickDelete}
          onClickDownload={onClickDownload}
          files={uploadedFiles}
        />
      )}
    </div>
  );
};

FileUpload.propTypes = {
  ctrCls: PropTypes.string,
  isMultiple: PropTypes.bool,
  maxFileSize: PropTypes.number,
  maxFilesSize: PropTypes.number,
  maxNoOfFiles: PropTypes.number,
  supportedFormats: PropTypes.arrayOf(PropTypes.string),
  Urls: PropTypes.object,
  accessToken: PropTypes.string,
  fileContextType: PropTypes.number,
  attachmentId: PropTypes.number,
  isInteractive: PropTypes.bool,
  onCompleted: PropTypes.func,
  onProgress: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onError: PropTypes.func,
};

FileUpload.defaultProps = {
  ctrCls: "",
  isMultiple: false,
  fileContextType: 14,
  attachmentId: 0,
  isInteractive: false,
  maxFileSize: 10, //10MB
  onCompleted: () => undefined,
  onProgress: () => undefined,
  onCancel: () => undefined,
  onDelete: () => undefined,
  onError: () => undefined,
};

export default FileUpload;
