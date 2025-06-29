import { flexRender } from "@tanstack/react-table";
import { Avatar } from "../Avatar";
import PropTypes from "prop-types";
import styles from "./Table.module.scss";
import { ButtonTypes, TableExpansionType } from "../../Enums";
import { HyperlinkButton } from "../AppButton";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";

const Row = ({
  row,
  canSelectByClickingFullRow,
  index,
  isRowClickable,
  onRowClick,
  expandOptions,
}) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const isRowSelectable = row.getCanSelect();
  const isSelected = row.getIsSelected();
  const isRowExpanded = row.getIsExpanded();
  const _isRowClickable =
    (typeof isRowClickable === "function" &&
      isRowClickable({ row: row.original, index })) ||
    isRowClickable;
  return (
    <>
      <tr
        data-role="tbody-row"
        className={`${
          isRowSelectable
            ? canSelectByClickingFullRow
              ? styles.isFullRowSelectable
              : styles.isCheckBoxOnlySelectable
            : ""
        } ${isSelected ? styles.selected : ""} ${
          isRowExpanded ? styles.expanded : ""
        } ${_isRowClickable ? styles.clickableRow : ""}`}
        onClick={(e) => {
          if (isRowSelectable && canSelectByClickingFullRow) {
            e.preventDefault(); // Preventing event of the Label element of Checkbox
            row.toggleSelected();
          } else if (_isRowClickable) {
            onRowClick(e, { row: row.original, index });
          }
        }}
        data-dz-unique-id={`${automationIdPrefix}-${row.id}-row`}
      >
        {row.getVisibleCells().map((cell) => {
          const isClickable =
            typeof cell.column.columnDef.isClickable === "function"
              ? cell.column.columnDef.isClickable({
                  row: row.original,
                  index,
                })
              : cell.column.columnDef.isClickable;
          if (typeof cell.column.columnDef.onRenderer === "function") {
            return (
              <td
                key={cell.id}
                className={cell.column.columnDef.ctrCls}
                data-dz-unique-id={`${automationIdPrefix}-${cell.id}-cell`}
              >
                {cell.column.columnDef.onRenderer({
                  row: row.original,
                  isClickable,
                  key: cell.id,
                })}
              </td>
            );
          }
          const renderCellContents = () => {
            return (
              <>
                {isClickable ? (
                  <HyperlinkButton
                    tooltipText={cell.getValue()}
                    label={cell.getValue()}
                    type={ButtonTypes.HYPERLINK}
                    ctrCls={styles.clickableCell}
                    onClick={(e) => {
                      e.stopPropagation();
                      cell.column.columnDef.onClick(e, {
                        row: row.original,
                        index,
                      });
                    }}
                    uniqueId={1669988985690}
                  />
                ) : (
                  <span>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                )}
              </>
            );
          };
          return (
            <td
              key={cell.id}
              className={`${cell.column.columnDef.ctrCls} `}
              data-dz-unique-id={`${automationIdPrefix}-${cell.id}-cell`}
            >
              {cell.column.columnDef.canShowAvatar ? (
                <div
                  className={`${
                    cell.column.columnDef.canShowAvatar ? styles.withAvatar : ""
                  }`}
                >
                  {cell.column.columnDef.canShowAvatar ? (
                    <Avatar
                      name={`${cell.getValue()}`}
                      imageUrl={
                        cell.column.columnDef.imageUrl?.({
                          row: row.original,
                        }) ?? row.original.imageUrl
                      }
                    />
                  ) : null}
                  {renderCellContents()}
                </div>
              ) : (
                renderCellContents()
              )}
            </td>
          );
        })}
      </tr>
      {row.getIsExpanded() &&
        expandOptions.type === TableExpansionType.NON_COHESIVE && (
          <tr
            className={styles.subrow}
            data-dz-unique-id={`${automationIdPrefix}-${row.id}-subrow`}
          >
            <td
              colSpan={row.getVisibleCells().length}
              data-role="expanded-cell"
            >
              {expandOptions.onRenderer({
                row: row.original,
              })}
            </td>
          </tr>
        )}
    </>
  );
};

Row.propTypes = {
  row: PropTypes.object.isRequired,
  canSelectByClickingFullRow: PropTypes.bool,
  index: PropTypes.number.isRequired,
  isRowClickable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
    .isRequired,
  onRowClick: PropTypes.func.isRequired,
  expandOptions: PropTypes.object,
};

Row.defaultProps = {
  canSelectByClickingFullRow: true,
};

export default Row;
