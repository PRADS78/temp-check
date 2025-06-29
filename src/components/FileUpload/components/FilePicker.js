import styles from "../FileUpload.module.scss";
import { BrowseFile } from "../../../Icons";
import PropTypes from "prop-types";
import { useLocalizerWithNameSpace } from "../../../DisprzLocalizer";

const FilePicker = ({
  handleSelectedFile,
  supportedFormats,
  uploadErrorMessage,
  maxFileSize,
  filePickerRef,
}) => {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const supportedFilesString = supportedFormats.toString().toUpperCase();

  const onChange = (event) => {
    if (event.target.files[0]) {
      handleSelectedFile(event.target.files[0]);
    }
    event.target.value = null;
  };

  const renderInput = () => {
    return (
      <input
        type="file"
        aria-label={t("filePicker.addFiles")}
        className={styles.input}
        ref={filePickerRef}
        onChange={onChange}
        accept={supportedFormats.join(",")}
        role="file"
        name="input_file"
      />
    );
  };

  const renderErrorMessage = () => {
    return (
      !!uploadErrorMessage && (
        <div className={styles.errorMessage}> {uploadErrorMessage}</div>
      )
    );
  };
  return (
    <>
      <BrowseFile />
      <div className={styles.primaryText}>
        {t("filePicker.dropFilesHere")}
        <span className={styles.browse}> {t("common.browse")} </span>
      </div>
      <div className={styles.secondaryText}>
        {`${t("filePicker.supportedFiles")} ${supportedFilesString}`}
      </div>
      <div className={styles.secondaryText}>{`${t(
        "filePicker.maxFileSize"
      )} ${maxFileSize} Mb`}</div>
      {renderErrorMessage()}
      {renderInput()}
    </>
  );
};

export default FilePicker;

FilePicker.propTypes = {
  handleSelectedFile: PropTypes.func,
  supportedFormats: PropTypes.array,
  uploadErrorMessage: PropTypes.string,
  maxFileSize: PropTypes.number,
  filePickerRef: PropTypes.any,
};
