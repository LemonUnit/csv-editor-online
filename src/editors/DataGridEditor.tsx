import React, { Component } from "react";
// @ts-ignore
import Spreadsheet from "react-spreadsheet";
import { debounce } from "throttle-debounce";

import { EditorProps, CellItem } from "./types";

interface Props extends EditorProps { }

interface GridCellItem {
  value: string | number | null;
}

interface State {
  grid: GridCellItem[][],
  activeRow: number;
  activeCol: number;
}

interface OnActivateOptons {
  column: number;
  row: number;
}

const DEFAULT_CELL_ACTIVE_INDEX = -1;
const MIN_GRID_ROWS = 50;
const MIN_GRID_COLUMNS = 26;

function getEmptyRow(columnsCount: number): GridCellItem[] {
  const row = [];

  for (let i = 0; i < columnsCount; i++) {
    row[i] = { value: '' }
  }

  return row;
}

function getMultipleEmptyRows(rowsCount: number, columnsCount: number): GridCellItem[][] {
  const emptyRow = getEmptyRow(columnsCount);

  const rows = [];

  for (let i = 0; i < rowsCount; i++) {
    rows[i] = emptyRow
  }

  return rows;
}

const defaultState: State = {
  activeRow: DEFAULT_CELL_ACTIVE_INDEX,
  activeCol: DEFAULT_CELL_ACTIVE_INDEX,
  grid: []
}

export class DataGridEditor extends Component<Props, State> {
  state = defaultState;

  componentDidMount() {
    this.parseSourceItemsToGrid();
  }

  componentWillUnmount() {
    this.addNewRowIfLastIsActive();
    this.setState(defaultState);
  }

  parseSourceItemsToGrid = () => {
    const { source } = this.props;

    const sourceRowsLength = source.length;

    const grid: GridCellItem[][] = [];

    for (let rowIndex = 0; rowIndex < sourceRowsLength; rowIndex++) {
      const row = source[rowIndex];

      if (!row) {
        continue;
      }

      const rowColumnsLength = row.length;

      if (!grid[rowIndex]) {
        grid[rowIndex] = [];
      }

      for (let rowCellIndex = 0; rowCellIndex < rowColumnsLength; rowCellIndex++) {
        const _cell = row[rowCellIndex];

        grid[rowIndex][rowCellIndex] = {
          value: _cell
        };
      }

      const columnsToAdd = MIN_GRID_COLUMNS - rowColumnsLength;

      for (let addColumnIndex = 0; addColumnIndex < columnsToAdd; addColumnIndex++) {
        grid[rowIndex][rowColumnsLength + addColumnIndex] = {
          value: ""
        };
      }
    }

    const rowsToAdd = MIN_GRID_ROWS - sourceRowsLength;
    const emptyRow = getEmptyRow(grid[0] ? grid[0].length : MIN_GRID_COLUMNS);

    for (let addRowIndex = 0; addRowIndex < rowsToAdd; addRowIndex++) {
      grid[sourceRowsLength + addRowIndex] = emptyRow;
    }

    return this.setState({
      grid
    });
  }

  updateSourceItemsByDataGrid = () => {
    const { grid } = this.state;

    const sourceItems: CellItem[][] = [];

    const reverseGridRows = [...grid].reverse();
    const notEmptyGridRowIndex = reverseGridRows.findIndex(rowCells => rowCells.some(cell => Boolean(cell.value)));
    const gridRows = reverseGridRows.slice(notEmptyGridRowIndex).reverse();

    for (let gridRowIndex = 0, gridRowsLength = gridRows.length; gridRowIndex < gridRowsLength; gridRowIndex++) {
      if (!sourceItems[gridRowIndex]) {
        sourceItems[gridRowIndex] = []
      }

      const reverseGridRows = [...gridRows[gridRowIndex]].reverse();

      const notEmptyCellIndex = reverseGridRows.findIndex(item => Boolean(item.value));
      const nonEmptyCells = reverseGridRows.slice(notEmptyCellIndex).reverse();

      if (notEmptyCellIndex < 0) {
        continue;
      }

      for (let nonEmptyCellIndex = 0; nonEmptyCellIndex < nonEmptyCells.length; nonEmptyCellIndex++) {
        const _cell = nonEmptyCells[nonEmptyCellIndex];

        sourceItems[gridRowIndex][nonEmptyCellIndex] = _cell.value;
      }
    }

    this.props.onSourceChange(sourceItems);
  }

  addNewRowIfLastIsActive = () => {
    const { activeRow, grid } = this.state;

    if (activeRow === (grid.length - 1)) {
      this.setState({
        grid: [
          ...grid,
          ...getMultipleEmptyRows(10, grid[0] ? grid[0].length : MIN_GRID_COLUMNS)
        ]
      });
    }
  }

  onActivate = ({ column, row }: OnActivateOptons) => this.setState({
    activeCol: column,
    activeRow: row
  });

  onChange = debounce(100, (grid: GridCellItem[][]) => this.setState({
    grid
  }, () => this.updateSourceItemsByDataGrid()));

  render() {
    return (
      <Spreadsheet
        onChange={this.onChange}
        onActivate={this.onActivate}
        data={this.state.grid}
      />
    )
  }
}