import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/workspace/tasks")({
  component: TasksPage,
});

import { collection, query, orderBy, onSnapshot, setDoc, doc } from "firebase/firestore";
import { tasksRef, TaskData, db } from "@/lib/db";

type Task = TaskData & { id: string };

const columns: ColumnDef<Task>[] = [
  { accessorKey: "id", header: "ID", cell: (info) => <span className="font-mono text-muted-foreground text-[10px]">{info.getValue() as string}</span> },
  { accessorKey: "title", header: "Task" },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: (info) => (
      <span className={`px-1.5 py-0.5 border rounded-sm text-[9px] uppercase tracking-widest ${
        info.getValue() === 'Completed' ? 'border-[color:var(--color-ok)] text-[color:var(--color-ok)]' : 
        info.getValue() === 'Blocked' ? 'border-[color:var(--color-crit)] text-[color:var(--color-crit)]' : 
        info.getValue() === 'In Progress' ? 'border-accent text-accent' :
        'border-border text-muted-foreground'
      }`}>
        {info.getValue() as string}
      </span>
    )
  },
  { 
    accessorKey: "priority", 
    header: "Priority",
    cell: (info) => (
      <span className={`text-[10px] uppercase tracking-widest ${
        info.getValue() === 'Critical' ? 'text-[color:var(--color-crit)] font-bold' : 
        info.getValue() === 'High' ? 'text-[color:var(--color-warn)]' : 'text-muted-foreground'
      }`}>{info.getValue() as string}</span>
    )
  },
  { accessorKey: "assignee", header: "Assignee", cell: (info) => <span className="font-mono">{info.getValue() as string}</span> },
  { accessorKey: "target", header: "Related Entity", cell: (info) => <span className="font-mono border-b border-dashed border-muted-foreground cursor-pointer hover:text-accent transition-colors">{info.getValue() as string}</span> },
  { accessorKey: "dueDate", header: "Due Date", cell: (info) => <span className={`font-mono ${info.getValue() === 'Overdue' ? 'text-[color:var(--color-crit)]' : ''}`}>{info.getValue() as string}</span> },
];

function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const q = query(tasksRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
      setTasks(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <PageLoader />;

  const handleCreateTask = async () => {
    const title = window.prompt("Enter new task title:");
    if (!title) return;
    
    setLoading(true);
    try {
      const newId = `TSK-${Math.floor(100 + Math.random() * 900)}`;
      await setDoc(doc(tasksRef, newId), {
        title,
        status: "Open" as const,
        assignee: "Unassigned",
        target: "TBD",
        priority: "Medium" as const,
        dueDate: "Pending",
        createdAt: Date.now(),
      });
    } catch (e) {
      console.error(e);
      window.alert("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background">
        <div>
          <h1 className="text-lg font-medium">Task Management</h1>
          <p className="text-muted-foreground mt-1">Cross-team assignments and tracking.</p>
        </div>
        <button 
          onClick={handleCreateTask}
          className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium"
        >
          Create Task
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 flex flex-col gap-6">
        <DataTable columns={columns} data={tasks} />
      </div>
    </div>
  );
}
