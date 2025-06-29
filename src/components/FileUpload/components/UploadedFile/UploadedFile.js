import { TrashIcon, DownloadIcon } from "../../../../Icons";
import styles from "./UploadedFile.module.scss";
import PropTypes from "prop-types";
import FileHelpers from "../../utils/FileHelpers";

const UploadedFile = ({
  ctrCls,
  fileItemCtrCls,
  showDownload,
  showDelete,
  files,
  onClickDownload,
  onClickDelete,
}) => {
  const renderFileItem = (file, index) => {
    const extension = file.fileExtension;
    const fileName = file.fileName;
    return (
      <div
        className={`${styles.fileItemContainer} ${fileItemCtrCls}`}
        key={index}
      >
        <div className={styles.fileIconContainer}>
          {FileHelpers.getFileIcon(extension)}
        </div>
        <div className={styles.contentContainer}>{fileName}</div>
        <div className={styles.actionContainer}>
          {showDownload && (
            <DownloadIcon
              className={`squared ${styles.downloadIcon}`}
              onClick={() => onClickDownload(file)}
              uniqueId={1673516740479}
            />
          )}
          {showDelete && (
            <TrashIcon
              className={`squared ${styles.trashIcon}`}
              onClick={() => onClickDelete(file)}
              uniqueId={1673516795045}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.uploadedFileContainer} ${ctrCls}`}>
      {files.map((file, index) => renderFileItem(file, index))}
    </div>
  );
};

export default UploadedFile;

UploadedFile.propTypes = {
  ctrCls: PropTypes.string,
  fileItemCtrCls: PropTypes.string,
  showDownload: PropTypes.bool,
  showDelete: PropTypes.bool,
  files: PropTypes.array,
  onClickDownload: PropTypes.func,
  onClickDelete: PropTypes.func,
};

UploadedFile.defaultProps = {
  ctrCls: "",
  fileItemCtrCls: "",
  showDownload: true,
  showDelete: true,
  onClickDownload: () => undefined,
  onClickDelete: () => undefined,
};
