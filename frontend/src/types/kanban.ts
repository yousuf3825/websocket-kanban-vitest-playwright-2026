export type Priority = "low" | "medium" | "high";
export type Category = "bug" | "feature" | "enhancement";
export type ColumnId = "todo" | "in-progress" | "done";

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  columnId: ColumnId;
  attachments: Attachment[];
  createdAt: number;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];
