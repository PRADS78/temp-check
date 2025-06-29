import { useState, useCallback, useEffect } from "react";
import { FileFormats } from "../../Enums";
import { DropZone } from "../FileUpload";
import PropTypes from "prop-types";
import { RecommendedImagesView } from "./RecommendedImagesView";
import CropperZone from "./CropperZone/CropperZone";
import styles from "./ImageSelector.module.scss";
import { CropReturnType } from "../../Enums";
import { ImageProviderName } from "../../Enums";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const ImageSelector = ({
  ctrCls,
  defaultSearchText,
  accessToken,
  defaultSource,
  title,
  onCrop,
  cropReturnType,
  onDelete,
  uniqueId,
  onError,
  imageServiceUrl,
}) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "ImageSelector");
    invariantUniqueId(uniqueId, "ImageSelector");
  }, [automationIdPrefix, uniqueId]);

  const [sourceUrl, setSourceUrl] = useState(defaultSource);
  const [providerName, setProviderName] = useState("");

  const _onImageUpload = (file) => {
    setSourceUrl(URL.createObjectURL(file));
  };
  const _onImageSelect = (file) => {
    setSourceUrl(file.largeImageUrl);
  };

  const _onDelete = () => {
    URL.revokeObjectURL(sourceUrl);
    setSourceUrl(null);
    onDelete();
  };

  const _onError = (errorMessage) => {
    onError(errorMessage);
  };

  const _onLoad = useCallback((value) => {
    setProviderName(value);
  }, []);

  const renderDropZone = () => {
    return (
      <DropZone
        ctrCls={styles.dropZone}
        supportedFormats={[FileFormats.PNG, FileFormats.JPEG, FileFormats.JPG]}
        maxNoOfFiles={1}
        maxFileSize={5}
        uploadedNoOfFiles={0}
        onSelect={_onImageUpload}
        onError={_onError}
      ></DropZone>
    );
  };

  return (
    <section
      className={`${styles.imageSelectorContainer} ${ctrCls}`}
      role="region"
      data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-ImageSelector`}
    >
      <div className={styles.titleText}>{title}</div>
      <div className={styles.imageContainer}>
        {sourceUrl ? (
          <CropperZone
            sourceUrl={sourceUrl}
            onDelete={_onDelete}
            onCrop={onCrop}
            cropReturnType={cropReturnType}
          ></CropperZone>
        ) : (
          renderDropZone()
        )}
        <RecommendedImagesView
          defaultSearchText={defaultSearchText}
          onImageSelect={_onImageSelect}
          accessToken={accessToken}
          description={""} //TODO: to be decided
          onLoad={_onLoad}
          imageServiceUrl={imageServiceUrl}
        ></RecommendedImagesView>
      </div>
      {providerName === ImageProviderName.UNSPLASH && (
        <div className={styles.licenseAgreement}>
          {t("imageSelector.unsplashDisclaimer")}{" "}
          <a
            href="https://unsplash.com/license"
            target="_blank"
            rel="noreferrer"
          >
            {t("imageSelector.licence")}
          </a>{" "}
          {t("common.and")}{" "}
          <a href="https://unsplash.com/terms" target="_blank" rel="noreferrer">
            {t("imageSelector.terms")}
          </a>
          .
        </div>
      )}
    </section>
  );
};

ImageSelector.propTypes = {
  ctrCls: PropTypes.string,
  title: PropTypes.string,
  accessToken: PropTypes.string.isRequired,
  // description: PropTypes.string, //TODO: to be decided
  defaultSource: PropTypes.string,
  defaultSearchText: PropTypes.string,
  onCrop: PropTypes.func,
  cropReturnType: PropTypes.oneOf([CropReturnType.BASE64, CropReturnType.BLOB]),
  onDelete: PropTypes.func,
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  onError: PropTypes.func,
  imageServiceUrl: PropTypes.string,
};

ImageSelector.defaultProps = {
  ctrCls: "",
  title: "Select Image",
  accessToken: "",
  // description: "", //TODO: to be decided
  defaultSource: null,
  defaultSearchText: "",
  onCrop: () => undefined,
  cropReturnType: CropReturnType.BLOB,
  onDelete: () => undefined,
  onError: () => undefined,
  imageServiceUrl: "https://imagesearch-msvc.disprz.com/images",
};

export default ImageSelector;
