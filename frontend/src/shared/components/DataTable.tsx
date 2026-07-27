import type { ReactNode } from 'react';

interface DataTableProps {
  columns: { label: string; align?: 'left' | 'right' }[];
  rows: ReactNode[][];
}

// Tabla simple usada en historiales (equivalente a table/th/td del mockup)
export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.label}
              className={`border-b border-line px-3.5 py-2.5 text-xs font-bold text-muted ${
                col.align === 'right' ? 'text-right' : 'text-left'
              }`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className={`border-b border-line px-3.5 py-[13px] text-[#e5e5ea] ${
                  columns[cellIndex]?.align === 'right' ? 'text-right' : ''
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
