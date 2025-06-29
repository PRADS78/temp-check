import { TableColumns } from "../../../Enums";
import Column from "./Column";

class ExpansionColumn extends Column {
  constructor(column) {
    column.id = TableColumns.EXPANSION;
    super(column);
  }
}

export default ExpansionColumn;
