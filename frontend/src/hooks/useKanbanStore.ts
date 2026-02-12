import React, { useState, useCallback } from "react";
import type { Task, Priority, Category } from "@/types/kanban";

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
    dueDate: Date.now() - 86400000 * 2, // Example due date
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
    dueDate: Date.now() - 86400000 * 1, // Example due date
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
    dueDate: undefined,
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
    dueDate: undefined,
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
    dueDate: undefined,
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
    dueDate: undefined,
  },
];

export function useKanbanStore() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);

  // Fetch tasks from backend on mount and update UI
  // If backend fails, fallback to sample data
  React.useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Transform backend data to match Task interface
          setTasks(
            data.map((t: any) => ({
              id: t.id,
              title: t.title,
              description: t.description,
              priority: t.priority,
              category: t.category,
              columnId: t.columnId || t.column || "todo",
              attachments: Array.isArray(t.attachments) ? t.attachments : [],
              createdAt: typeof t.createdAt === "number" ? t.createdAt : new Date(t.createdAt).getTime(),
              dueDate: t.dueDate ? (typeof t.dueDate === "number" ? t.dueDate : new Date(t.dueDate).getTime()) : undefined,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const addTask = useCallback(
    async (data: { title: string; description: string; priority: Priority; category: Category; dueDate?: number }) => {
      const task: Task = {
        id: generateId(),
        ...data,
        columnId: "todo",
        attachments: [],
        createdAt: Date.now(),
      };
      // Send to backend for persistence
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        });
        const saved = await res.json();
        setTasks((prev) => [...prev, saved]);
        return saved;
      } catch (e) {
        // fallback to local state if backend fails
        setTasks((prev) => [...prev, task]);
        return task;
      }
    },
    []
  );

  const moveTask = useCallback(
    async (taskId: string, toColumn: string, index: number) => {
      setTasks((prev: Task[]) => {
        const task = prev.find((t: Task) => t.id === taskId);
        if (!task) return prev;
        const without = prev.filter((t: Task) => t.id !== taskId);
        const updated = { ...task, columnId: toColumn as any };
        const inColumn = without.filter((t: Task) => t.columnId === toColumn);
        const others = without.filter((t: Task) => t.columnId !== toColumn);
        inColumn.splice(index, 0, updated);
        return [...others, ...inColumn];
      });
      // Persist columnId change to backend
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId: toColumn }),
      });
    },
    []
  );

  // Soft delete: mark as deleted and delete from backend
  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev: Task[]) => prev.map((t: Task) => t.id === id ? { ...t, deleted: true } : t));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (e) {
      // Optionally handle error (e.g., show toast)
    }
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
    setTasks((prev: Task[]) =>
      prev.map((t: Task) => (t.id === taskId ? { ...t, attachments: [...t.attachments, attachment] } : t))
    );
    return { error: null };
  }, []);

  // Exclude deleted tasks from selectors
  const getTasksByColumn = useCallback(
    (columnId: string) => tasks.filter((t: Task) => t.columnId === columnId && !t.deleted),
    [tasks]
  );

  const stats = {
    todo: tasks.filter((t: Task) => t.columnId === "todo" && !t.deleted).length,
    inProgress: tasks.filter((t: Task) => t.columnId === "in-progress" && !t.deleted).length,
    done: tasks.filter((t: Task) => t.columnId === "done" && !t.deleted).length,
    total: tasks.filter((t: Task) => !t.deleted).length,
    completionPercent: tasks.filter((t: Task) => !t.deleted).length
      ? Math.round((tasks.filter((t: Task) => t.columnId === "done" && !t.deleted).length / tasks.filter((t: Task) => !t.deleted).length) * 100)
      : 0,
  };

  return { tasks, addTask, moveTask, deleteTask, addAttachment, getTasksByColumn, stats };
}
