import { flexRender } from "@tanstack/react-table";
import PropTypes from "prop-types";
import styles from "../Table.module.scss";
import ColumnLevelFilter from "../ColumnLevelFilter";
import ColumnLevelSort from "../ColumnLevelSort";
import { useAutomationIdPrefix } from "../../../AutomationIdPrefix";

const Header = (props) => {
  const _onSortChange = (args) => {
    props.table.setPageIndex(0);
    props.sortOptions.onChange(args);
  };

  return (
    <thead
      className={`${!props.hasReachedTopOfThePage ? styles.headerShadow : ""} `}
    >
      {props.table.getHeaderGroups().map((headerGroup) => {
        return (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <HeadingItem
                  key={header.id}
                  id={header.id}
                  header={header}
                  columnFilters={props.columnFilters}
                  sortOptions={props.sortOptions}
                  _onSortChange={_onSortChange}
                  tableRef={props.tableRef}
                />
              );
            })}
          </tr>
        );
      })}
    </thead>
  );
};

Header.propTypes = {
  table: PropTypes.object.isRequired,
  sortOptions: PropTypes.object.isRequired,
  hasReachedTopOfThePage: PropTypes.bool.isRequired,
  columnFilters: PropTypes.object,
  tableRef: PropTypes.object.isRequired,
  isGlobalFilteredEnabled: PropTypes.bool.isRequired,
};

Header.defaultProps = {
  columnFilters: {},
};

const HeadingItem = ({
  id,
  header,
  columnFilters,
  sortOptions,
  _onSortChange,
  tableRef,
}) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const isHeadingActionsAvailable =
    header.column.columnDef.isSortable || header.column.getCanFilter();
  return (
    <th
      colSpan={header.colSpan}
      className={header.column.columnDef.ctrCls}
      data-dz-unique-id={`${automationIdPrefix}-${id}-col`}
    >
      {/* header.isPlaceholder ? null :  */}
      <div
        className={`${
          isHeadingActionsAvailable ? styles.tableHeadingActions : ""
        }`}
        role="rowheader"
        title={header.column.columnDef.header}
      >
        <span>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {header.column.columnDef.isSortable && (
          <ColumnLevelSort
            sortBy={sortOptions.by}
            sortOrder={sortOptions.order}
            onSortChange={_onSortChange}
            columnId={header.column.id}
            headerId={header.id}
          />
        )}
        {header.column.getCanFilter() && (
          <ColumnLevelFilter
            header={header}
            items={columnFilters}
            tableRef={tableRef}
          />
        )}
      </div>
    </th>
  );
};

HeadingItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  header: PropTypes.object.isRequired,
  columnFilters: PropTypes.object.isRequired,
  sortOptions: PropTypes.object.isRequired,
  _onSortChange: PropTypes.func.isRequired,
  tableRef: PropTypes.object.isRequired,
};

export default Header;
