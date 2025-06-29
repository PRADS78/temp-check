import { useRef, useState, useEffect } from "react";
import Cropper from "react-cropper";
import PropTypes from "prop-types";
import "cropperjs/dist/cropper.css";
import { CropReturnType } from "../../../Enums";
import styles from "./CropperZone.module.scss";
import LoadingAnimation from "../LoadingAnimation.gif";
import {
  Minus as MinusIcon,
  Plus as PlusIcon,
  CancelIcon,
  ResetIcon,
} from "../../../Icons";

const LoadingState = {
  loading: 1,
  loaded: 2,
  error: 3,
};

const CropperZone = ({ sourceUrl, onDelete, onCrop, cropReturnType }) => {
  const cropperRef = useRef(null);

  const [loadingState, setLoadingState] = useState(LoadingState.loading);

  const _onCropEnd = () => {
    const cropperInstance = cropperRef.current?.cropper;
    if (cropReturnType === CropReturnType.BLOB) {
      cropperInstance.getCroppedCanvas().toBlob(function (blob) {
        onCrop(blob);
      });
    } else {
      const base64 = cropperInstance.getCroppedCanvas().toDataURL();
      onCrop(base64);
    }
  };

  const onHandleZoom = (value) => {
    cropperRef.current?.cropper.zoom(value);
    _onCropEnd();
  };

  const onHandleReset = () => {
    cropperRef.current?.cropper.reset();
    _onCropEnd();
  };

  useEffect(() => {
    setLoadingState(LoadingState.loading);
  }, [sourceUrl]); //whenever sourceUrl changes loadingState will set as loading

  const onHandleDelete = () => {
    cropperRef.current?.cropper.destroy();
    onDelete();
  };

  return (
    <div className={styles.cropperZoneContainer} role="region">
      {loadingState === LoadingState.loading && (
        <div className={styles.loadingAnimation}>
          <img src={LoadingAnimation} alt="Loading animation" />
        </div>
      )}

      <Cropper
        src={sourceUrl}
        ref={cropperRef}
        aspectRatio={4 / 3}
        autoCrop={true}
        autoCropArea={1}
        ready={() => {
          _onCropEnd();
          setLoadingState(LoadingState.loaded);
        }}
        cropend={_onCropEnd}
        background={true}
        checkOrientation={false}
        className={styles.cropper}
        cropBoxMovable={true}
        cropBoxResizable={true}
        guides={true}
        highlight={true}
        maxHeight={100}
        maxWidth={Math.ceil(100 * (4 / 3))}
        minCropBoxHeight={30}
        minCropBoxWidth={Math.ceil(30 * (4 / 3))}
        modal={false}
        movable={true}
        responsive={true}
        restore={true}
        toggleDragModeOnDblclick={true}
        viewMode={2}
        zoomable={true}
        zoomOnWheel={false}
      ></Cropper>
      {loadingState === LoadingState.loaded && (
        <div className={styles.buttonsContainer}>
          <CancelIcon
            onClick={onHandleDelete}
            uniqueId={1679549158524}
            className={`${styles.withIcon} no-hover`}
            data-role="delete-button"
          />
          <div>
            <ResetIcon
              onClick={onHandleReset}
              uniqueId={1679549205615}
              className={`${styles.withIcon} no-hover`}
              data-role="reset-button"
            />
            <PlusIcon
              onClick={() => onHandleZoom(0.1)}
              uniqueId={1679549216761}
              className={`${styles.withIcon} no-hover`}
              data-role="plus-button"
            />
            <MinusIcon
              onClick={() => onHandleZoom(-0.1)}
              uniqueId={1679549219730}
              className={`${styles.withIcon} no-hover`}
              data-role="minus-button"
            />
          </div>
        </div>
      )}
    </div>
  );
};

CropperZone.propTypes = {
  sourceUrl: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onCrop: PropTypes.func,
  cropReturnType: PropTypes.oneOf([CropReturnType.BASE64, CropReturnType.BLOB]),
};

/* istanbul ignore next */
CropperZone.defaultProps = {
  sourceUrl: "",
  onDelete: () => undefined,
  onCrop: () => undefined,
  cropReturnType: CropReturnType.BASE64,
};

export default CropperZone;
