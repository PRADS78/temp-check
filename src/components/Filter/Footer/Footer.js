import PropTypes from "prop-types";
import styles from "./Footer.module.scss";
import { OutlinedButton, PrimaryButton } from "../../AppButton";
import { ButtonSize } from "../../../Enums";
import { useLocalizerWithNameSpace } from "../../../DisprzLocalizer";
function Footer({ canShowClearAll, onApply, onCancel, onClearAll, canApply }) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  return (
    <div
      className={styles.bottomContainer}
      role="region"
      data-role="filter-footer"
    >
      {canShowClearAll ? (
        <OutlinedButton
          label={`${t("common.clear")} ${t("common.all")}`}
          uniqueId={1670511549259}
          size={ButtonSize.SMALL}
          onClick={onClearAll}
        />
      ) : (
        <OutlinedButton
          label={t("common.cancel")}
          uniqueId={1670336749406}
          size={ButtonSize.SMALL}
          onClick={onCancel}
        />
      )}
      <PrimaryButton
        size={ButtonSize.SMALL}
        label={t("common.apply")}
        uniqueId={1670337201166}
        onClick={onApply}
        isDisabled={!canApply}
      />
    </div>
  );
}

Footer.propTypes = {
  canShowClearAll: PropTypes.bool,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onClearAll: PropTypes.func,
  canApply: PropTypes.bool,
};

export default Footer;
