import styles from "./Table.module.scss";
import PropTypes from "prop-types";
import { NoResultIcon } from "../../Icons";
import { OutlinedButton } from "../AppButton";
import { useEffect, useState } from "react";

const EmptyBody = ({
  emptyOptions,
  colSpan,
  columnFilters,
  globalFilters,
  searchOptions,
  tableInnerRef,
}) => {
  const {
    icon,
    message,
    onRenderer,
    actionText,
    onAction,
    canShowAction = true,
  } = emptyOptions;
  const [innerTableWidth, setInnerTableWidth] = useState(0);

  useEffect(() => {
    /* istanbul ignore else */
    if (tableInnerRef.current) {
      setInnerTableWidth(tableInnerRef.current.getBoundingClientRect().width);
    }
  }, [tableInnerRef]);

  return (
    <tbody>
      <tr>
        <td
          colSpan={colSpan}
          className={`${styles.nonLoadedContainer} ${styles.emptyContainer}`}
        >
          {typeof onRenderer === "function" ? (
            onRenderer({
              filter: {
                columnFilters: columnFilters,
                globalFilters: globalFilters,
              },
              searchOptions: searchOptions,
              tableWidth: innerTableWidth,
            })
          ) : (
            <div
              className={styles.emptyInnerContainer}
              style={{ width: innerTableWidth }}
            >
              <div>{icon ? icon() : <NoResultIcon />}</div>
              <div className={styles.primaryText}>{message}</div>
              {canShowAction && (
                <div className={styles.actionContainer}>
                  <OutlinedButton
                    label={actionText}
                    uniqueId={1681215307545}
                    onClick={onAction}
                  />
                </div>
              )}
            </div>
          )}
        </td>
      </tr>
    </tbody>
  );
};

EmptyBody.propTypes = {
  emptyOptions: PropTypes.shape({
    icon: PropTypes.func,
    message: PropTypes.string,
    onRenderer: PropTypes.func,
    actionText: PropTypes.string,
    onAction: PropTypes.func,
    canShowAction: PropTypes.bool,
  }),
  colSpan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  columnFilters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  globalFilters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  searchOptions: PropTypes.object,
  tableInnerRef: PropTypes.object,
};

/* istanbul ignore next */
EmptyBody.defaultProps = {
  emptyOptions: {
    icon: null,
    message: "Sorry! No result found",
    onRenderer: () => {},
    actionText: "Clear All",
    onAction: () => {},
    canShowAction: true,
  },
};

export default EmptyBody;
