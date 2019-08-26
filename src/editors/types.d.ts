export type CellItem = string | number | null;

export type CellItemRow = CellItem[];

export type SourceItems = CellItemRow[];

export interface EditorProps {
  onSourceChange: (source: SourceItems) => void;
  source: SourceItems;
}