import PropTypes from "prop-types";
import styles from "./Table.module.scss";
import { useEffect, useState } from "react";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const LoadingBody = ({ colSpan, tableInnerRef }) => {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const [innerTableWidth, setInnerTableWidth] = useState(0);

  // Remove setting innerTableWidth during shimmering effect implementation
  useEffect(() => {
    setInnerTableWidth(tableInnerRef.current.getBoundingClientRect().width);
  }, [tableInnerRef]);

  return (
    <tbody>
      <tr>
        <td
          colSpan={colSpan}
          className={`${styles.nonLoadedContainer} ${styles.emptyContainer}`}
        >
          <div
            className={styles.emptyInnerContainer}
            style={{ width: innerTableWidth }}
          >
            <span>{t("common.loading")}</span>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

LoadingBody.propTypes = {
  colSpan: PropTypes.number,
  tableInnerRef: PropTypes.object,
};

export default LoadingBody;
