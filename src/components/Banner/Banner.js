import PropTypes from "prop-types";
import { BannerEndToEndTypes, BannerTypes } from "../../Enums";
import { SearchCloseIcon, WarningIcon } from "../../Icons";
import styles from "./Banner.module.scss";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { useEffect } from "react";

const Banner = ({
  ctrCls,
  type,
  title,
  content,
  canShowClose,
  onClose,
  EndToEndType,
  uniqueId,
}) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Banner");
    invariantUniqueId(uniqueId, "Banner");
  }, [automationIdPrefix, uniqueId]);

  const renderCloseButton = () => {
    return (
      <SearchCloseIcon
        className={styles.closeIconContainer}
        data-role="close"
        onClick={onClose}
        uniqueId={1672725852199}
      />
    );
  };

  const renderBodyText = () => {
    return (
      <div
        className={`${styles.bodyText} ${
          title && type === BannerTypes.INFO ? styles.withTitle : ""
        }`}
      >
        {content}
      </div>
    );
  };

  const renderType = () => {
    switch (type) {
      case BannerTypes.INFO:
        return (
          <div className={`${styles.infoContainer}`}>
            <WarningIcon canRenderOnlyIcon className={styles.warningIcon} />
            <div
              className={`${styles.contentContainer} ${
                title ? styles.withTitle : ""
              } ${
                canShowClose && type === BannerTypes.INFO
                  ? styles.withClose
                  : ""
              }`}
            >
              {title && <span className={styles.titleText}>{title}</span>}
              {renderBodyText()}
            </div>
            {canShowClose && renderCloseButton()}
          </div>
        );
      case BannerTypes.END_TO_END:
        return (
          <div
            className={`${styles.endToEndBanner} ${
              EndToEndType === BannerEndToEndTypes.DEFAULT
                ? styles.default
                : styles.warning
            }`}
          >
            {renderBodyText()}
            {canShowClose && renderCloseButton()}
          </div>
        );
    }
  };

  return (
    <div
      className={`${styles.banner} ${ctrCls} ${
        type === BannerTypes.INFO ? styles.infoBanner : ""
      }`}
      role="region"
      data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-banner`}
    >
      {renderType()}
    </div>
  );
};

Banner.propTypes = {
  /**
   * Specify ctrCls for the Banner
   */
  ctrCls: PropTypes.string,
  /**
   * Specify type of the Banner
   */
  type: PropTypes.oneOf([BannerTypes.INFO, BannerTypes.END_TO_END]),
  /**
   * Specify title text for the Banner
   */
  title: PropTypes.string,
  /**
   * Specify body text for the Banner
   */
  content: PropTypes.string,
  /**
   * Specify banner close icon
   */
  canShowClose: PropTypes.bool,
  /**
   * Add onClose event listener to close icon
   */
  onClose: PropTypes.func,
  /**
   * Specify alert type of the banner
   */
  EndToEndType: PropTypes.oneOf([
    BannerEndToEndTypes.DEFAULT,
    BannerEndToEndTypes.ALERT,
  ]),
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

/* istanbul ignore next */
Banner.defaultProps = {
  ctrCls: "",
  type: BannerTypes.INFO,
  content: "This is the default message.",
  canShowClose: false,
  onClose: () => undefined,
};

export default Banner;
