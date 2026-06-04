import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { teamMembersRef, TeamMemberData } from "@/lib/db";
import { query, orderBy, onSnapshot } from "firebase/firestore";

export const Route = createFileRoute("/_authenticated/org/teams")({
  component: TeamsPage,
});

const columns: ColumnDef<TeamMemberData>[] = [
  { accessorKey: "name", header: "Member", cell: (info) => <span className="font-medium">{info.getValue() as string}</span> },
  { accessorKey: "role", header: "Role", cell: (info) => <span className="text-muted-foreground">{info.getValue() as string}</span> },
  { accessorKey: "accessLevel", header: "Access Level", cell: (info) => <span className="font-mono">{info.getValue() as string}</span> },
  { accessorKey: "mfa", header: "MFA", cell: (info) => <span className={`font-mono ${info.getValue() ? 'text-[color:var(--color-ok)]' : 'text-[color:var(--color-crit)]'}`}>{info.getValue() ? 'Enabled' : 'Disabled'}</span> },
  { accessorKey: "lastActive", header: "Last Active", cell: (info) => <span className="font-mono text-muted-foreground">{info.getValue() as string}</span> },
];

function TeamsPage() {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);

  useEffect(() => {
    const q = query(teamMembersRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTeamMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TeamMemberData[]);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-background">
        <div>
          <h1 className="text-lg font-medium">Policy Analysis Team</h1>
          <p className="text-muted-foreground mt-1">Manage members and shared workload.</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/10 flex flex-col gap-6">
        <DataTable columns={columns} data={teamMembers} />
      </div>
    </div>
  );
}
