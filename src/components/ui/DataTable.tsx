import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full border border-border bg-card glass overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] leading-tight">
          <thead className="bg-secondary/80 backdrop-blur-sm uppercase tracking-widest text-muted-foreground sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header, i) => (
                  <th
                    key={header.id}
                    className={`whitespace-nowrap px-3 py-2 font-medium ${i === 0 ? "sticky left-0 bg-secondary/80 backdrop-blur-sm" : ""}`}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : "auto" }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-foreground flex items-center gap-1"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIdx) => (
                <tr
                  key={row.id}
                  className={`row-hover ${rowIdx % 2 === 1 ? "bg-secondary/20" : ""}`}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <td key={cell.id} className={`px-3 py-1.5 whitespace-nowrap ${i === 0 ? "sticky left-0 bg-inherit" : ""}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
