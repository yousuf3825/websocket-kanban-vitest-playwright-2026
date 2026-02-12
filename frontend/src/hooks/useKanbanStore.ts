import { useState, useCallback } from "react";
import type { Task, ColumnId, Priority, Category } from "@/types/kanban";

const generateId = () => Math.random().toString(36).substring(2, 10);

const SAMPLE_TASKS: Task[] = [
  {
    id: generateId(),
    title: "Set up project structure",
    description: "Initialize the repository and configure build tools",
    priority: "high",
    category: "feature",
    columnId: "done",
    attachments: [],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: generateId(),
    title: "Design system tokens",
    description: "Define colors, spacing, and typography tokens",
    priority: "medium",
    category: "feature",
    columnId: "done",
    attachments: [],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: generateId(),
    title: "Implement drag and drop",
    description: "Add @hello-pangea/dnd for moving tasks between columns",
    priority: "high",
    category: "feature",
    columnId: "in-progress",
    attachments: [],
    createdAt: Date.now() - 86400000,
  },
  {
    id: generateId(),
    title: "Fix card overflow on mobile",
    description: "Long titles break layout on small screens",
    priority: "medium",
    category: "bug",
    columnId: "in-progress",
    attachments: [],
    createdAt: Date.now() - 43200000,
  },
  {
    id: generateId(),
    title: "Add progress chart",
    description: "Visualize task distribution across columns using Recharts",
    priority: "low",
    category: "enhancement",
    columnId: "todo",
    attachments: [],
    createdAt: Date.now(),
  },
  {
    id: generateId(),
    title: "Write unit tests",
    description: "Cover core task CRUD operations with Vitest",
    priority: "medium",
    category: "feature",
    columnId: "todo",
    attachments: [],
    createdAt: Date.now(),
  },
];

export function useKanbanStore() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);

  const addTask = useCallback(
    (data: { title: string; description: string; priority: Priority; category: Category }) => {
      const task: Task = {
        id: generateId(),
        ...data,
        columnId: "todo",
        attachments: [],
        createdAt: Date.now(),
      };
      setTasks((prev) => [...prev, task]);
      return task;
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, "id">>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const moveTask = useCallback((taskId: string, toColumn: ColumnId, index: number) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;
      const without = prev.filter((t) => t.id !== taskId);
      const updated = { ...task, columnId: toColumn };
      const inColumn = without.filter((t) => t.columnId === toColumn);
      const others = without.filter((t) => t.columnId !== toColumn);
      inColumn.splice(index, 0, updated);
      return [...others, ...inColumn];
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addAttachment = useCallback((taskId: string, file: File) => {
    const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      return { error: "Unsupported file type. Use PNG, JPG, GIF, WebP, or PDF." };
    }
    const attachment = {
      id: generateId(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, attachments: [...t.attachments, attachment] } : t))
    );
    return { error: null };
  }, []);

  const getTasksByColumn = useCallback(
    (columnId: ColumnId) => tasks.filter((t) => t.columnId === columnId),
    [tasks]
  );

  const stats = {
    todo: tasks.filter((t) => t.columnId === "todo").length,
    inProgress: tasks.filter((t) => t.columnId === "in-progress").length,
    done: tasks.filter((t) => t.columnId === "done").length,
    total: tasks.length,
    completionPercent: tasks.length ? Math.round((tasks.filter((t) => t.columnId === "done").length / tasks.length) * 100) : 0,
  };

  return { tasks, addTask, updateTask, moveTask, deleteTask, addAttachment, getTasksByColumn, stats };
}
