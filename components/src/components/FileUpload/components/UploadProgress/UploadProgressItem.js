import styles from "./UploadProgress.module.scss";
import PropTypes from "prop-types";
import FileHelpers from "../../utils/FileHelpers";
import { CancelIcon } from "../../../../Icons";
import { useLocalizerWithNameSpace } from "../../../../DisprzLocalizer";

const UploadProgressItem = ({
  selectedFiles,
  cancelUpload,
  removeSelectedFile,
  errorMessage,
}) => {
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  const { name } = selectedFiles;
  const uploadProgress =
    selectedFiles?.uploadProgress >= 0 ? selectedFiles.uploadProgress : 0;

  const onClickDelete = () => {
    removeSelectedFile(selectedFiles);
    cancelUpload(selectedFiles);
  };

  const onClickContainer = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <>
      <div
        className={styles.container}
        onClick={onClickContainer}
        data-testid="progressContainer"
      >
        <div
          className={styles.progressContainer}
          style={{ width: `${uploadProgress}%` }}
        />
        {!!errorMessage && (
          <div
            className={`${styles.progressContainer} ${styles.errorProgress}`}
          />
        )}
        <div className={styles.innerContainer}>
          <div className={styles.fileIconContainer}>
            {FileHelpers.getFileIcon(
              FileHelpers.fileExtensionFromFileName(name)
            )}
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.fileName}> {name} </div>
            <div className={styles.progress}>
              {`${uploadProgress}% ${t("common.completed")}`}
            </div>
          </div>
          <div className={styles.closeIconContainer}>
            <CancelIcon onClick={onClickDelete} uniqueId={1673516740476} />
          </div>
        </div>
      </div>
      {!!errorMessage && (
        <div className={styles.errorText}>{t("common.error.500")}</div>
      )}
    </>
  );
};

UploadProgressItem.propTypes = {
  selectedFiles: PropTypes.object,
  cancelUpload: PropTypes.func,
  removeSelectedFile: PropTypes.func,
  errorMessage: PropTypes.string,
};

UploadProgressItem.defaultProps = {
  selectedFile: "",
};

export default UploadProgressItem;
