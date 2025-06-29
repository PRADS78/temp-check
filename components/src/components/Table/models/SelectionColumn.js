import { TableColumns } from "../../../Enums";
import Column from "./Column";

class SelectionColumn extends Column {
  constructor(column) {
    column.id = TableColumns.SELECTION;
    super(column);
  }
}

export default SelectionColumn;
