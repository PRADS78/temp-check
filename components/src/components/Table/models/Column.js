import { TableColumns } from "../../../Enums";
import { invariant } from "../../../Utils";

class Column {
  constructor(column) {
    this.setId(column.key, column.id ? String(column.id) : column.id);
    this.setAccessor(column.key, String(column.id));
    this.isGrouped = column.isGrouped || false;
    this.isSortable = column.isSortable || false;
    // this.columns = this.isGrouped
    //   ? column.columns.map((c) => {
    //       return new Column(c);
    //     })
    //   : [];
    this.header = column.title;
    this.ctrCls = column.ctrCls ?? "";
    this.canShowAvatar = column.canShowAvatar || false;
    this.isClickable = column.isClickable || null;
    this.onClick = column.onClick || null;
    this.enableColumnFilter = column.isFilterable || false;
    this.enableGlobalFilter = false; // We're not utilizing global filter on columns
    this.imageUrl = column.imageUrl || undefined;
    this.setRenderer(column.onRenderer, column.cell);
  }

  setId(key, id) {
    if (id === TableColumns.SELECTION || id === TableColumns.EXPANSION) {
      this.id = id;
      return;
    }
    if (typeof key === "function") {
      invariant(id, () => `Required id for a column, if key is a function`);
      this.id = id;
    }
  }

  setAccessor(key, id) {
    if (id === TableColumns.SELECTION || id === TableColumns.EXPANSION) {
      return;
    }
    if (typeof key === "function") {
      this.accessorFn = key;
    } else {
      this.accessorKey = key;
    }
  }

  setRenderer(onRenderer, cell) {
    if (
      this.id === TableColumns.SELECTION ||
      this.id === TableColumns.EXPANSION
    ) {
      this.cell = cell;
      return;
    }
    if (typeof onRenderer === "function") {
      this.onRenderer = onRenderer;
    }
  }
}

export default Column;
