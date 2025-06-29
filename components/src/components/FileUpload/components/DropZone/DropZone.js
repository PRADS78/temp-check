import { useRef } from "react";
import styles from "./DropZone.module.scss";
import FileHelpers from "../../utils/FileHelpers";
import PropTypes from "prop-types";
import { FileUploadErrorMessage } from "../../../../Enums";
import { useState } from "react";
import FilePicker from "../FilePicker";

const DropZone = ({
  ctrCls,
  supportedFormats,
  maxNoOfFiles,
  maxFileSize,
  uploadedNoOfFiles,
  onSelect,
  onError,
}) => {
  const filePickerRef = useRef(null);
  const dropContainerStyle = isDragOver ? styles.drag : "";
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onClick = () => {
    filePickerRef.current.click();
  };

  const handleSelectedFile = (file) => {
    const isFileLimitExceed = maxNoOfFiles <= uploadedNoOfFiles;
    const fileExtension = FileHelpers.fileExtensionFromFileName(file.name);
    const isAllowedFileFormat = supportedFormats.includes("." + fileExtension);
    const isFileSizeExceed = file.size / (1024 * 1024) > maxFileSize;
    if (isFileLimitExceed) {
      setErrorMessage(FileUploadErrorMessage.MAX_FILE_LIMIT_EXCEED);
      onError(FileUploadErrorMessage.MAX_FILE_LIMIT_EXCEED);
    } else if (isFileSizeExceed) {
      setErrorMessage(FileUploadErrorMessage.FILE_SIZE_EXCEED);
      onError(FileUploadErrorMessage.FILE_SIZE_EXCEED);
    } else if (!isAllowedFileFormat) {
      setErrorMessage(FileUploadErrorMessage.INVALID_FORMAT);
      onError(FileUploadErrorMessage.INVALID_FORMAT);
    } else {
      setErrorMessage("");
      onSelect(file);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (event?.dataTransfer?.files[0]) {
      handleSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDrag = (event) => {
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragOver(true);
    } else if (event.type === "dragleave") {
      setIsDragOver(false);
    }
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  };

  return (
    <div
      className={`${styles.fileUpload} ${dropContainerStyle} ${ctrCls}`}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={handleDrag}
      onDragExit={handleDrag}
      onDragLeave={handleDrag}
      onDragEnter={handleDrag}
      disabled={true}
    >
      <FilePicker
        handleSelectedFile={handleSelectedFile}
        uploadErrorMessage={errorMessage}
        maxFileSize={maxFileSize}
        filePickerRef={filePickerRef}
        supportedFormats={supportedFormats}
      />
    </div>
  );
};

DropZone.propTypes = {
  /**
   * Specify ctrCls for the Fileupload
   */
  ctrCls: PropTypes.string,
  /**
   * Specify Supported Formats for Fileupload
   */
  supportedFormats: PropTypes.array,
  /**
   * Determines the Single/Multiple file upload
   */
  isMultiple: PropTypes.bool,
  /**
   * Specify maximum size of file
   */
  maxFileSize: PropTypes.number,
  /**
   * Specify maximum number of files
   */
  maxNoOfFiles: PropTypes.number,
  /**
   * Specify Uploaded number of files
   */
  uploadedNoOfFiles: PropTypes.number,
  /**
   * Callback function when a file is selected
   */
  onSelect: PropTypes.func,
  /**
   * Callback function when return error
   */
  onError: PropTypes.func,
};

DropZone.defaultProps = {
  ctrCls: "",
  onError: () => undefined,
};

export default DropZone;
