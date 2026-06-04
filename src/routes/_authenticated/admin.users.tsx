import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRole } from "@/lib/rbac";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

import { collection, query, orderBy, onSnapshot, setDoc, doc } from "firebase/firestore";
import { usersRef, UserData, db } from "@/lib/db";

type User = UserData & { id: string };

const columns: ColumnDef<User>[] = [
  { accessorKey: "email", header: "Identity", cell: (info) => <span className="font-medium">{info.getValue() as string}</span> },
  { accessorKey: "role", header: "Role", cell: (info) => <span className="uppercase tracking-widest text-[9px] px-1 border border-border rounded-sm">{info.getValue() as string}</span> },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: (info) => (
      <span className={`flex items-center gap-1 text-[10px] uppercase tracking-widest ${info.getValue() === 'active' ? 'text-[color:var(--color-ok)]' : 'text-[color:var(--color-crit)]'}`}>
        <span className="size-1.5 rounded-full bg-current" />
        {info.getValue() as string}
      </span>
    )
  },
  { accessorKey: "lastLogin", header: "Last Login" },
];

function UsersPage() {
  const { hasRole } = useRole();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[]);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleProvisionUser = async () => {
    const email = window.prompt("Enter email address to provision:");
    if (!email) return;
    
    setLoading(true);
    try {
      const newId = `USR-${Math.floor(100 + Math.random() * 900)}`;
      await setDoc(doc(usersRef, newId), {
        email,
        role: "analyst",
        status: "active",
        lastLogin: "Never",
        createdAt: Date.now(),
      });
    } catch (e) {
      console.error(e);
      window.alert("Failed to provision user.");
    } finally {
      setLoading(false);
    }
  };

  if (!hasRole(["admin"])) {
    return <EmptyState title="Access Denied" description="You must be an administrator to manage users." />;
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background">
        <div>
          <h1 className="text-lg font-medium">User Management</h1>
          <p className="text-muted-foreground mt-1">Configure roles and permissions.</p>
        </div>
        <button 
          onClick={handleProvisionUser}
          className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium"
        >
          Provision User
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
