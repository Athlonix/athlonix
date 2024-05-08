import { TableCell, TableRow } from '@repo/ui/components/ui/table';
import React from 'react';

type Report = {
  id: number;
  created_at: string;
  id_reason: number;
  content: string;
};

function ReportRow({ report, reason }: { report: Report; reason: string }) {
  return (
    <TableRow key={report.id}>
      <TableCell className="font-medium">{`${new Date(report.created_at).getDate()} ${new Date(
        report.created_at,
      ).toLocaleString('default', {
        month: 'long',
      })} de ${new Date(report.created_at).getHours().toString().padStart(2, '0')}:${new Date(report.created_at)
        .getMinutes()
        .toString()
        .padStart(2, '0')}`}</TableCell>
      <TableCell>{reason}</TableCell>
      <TableCell>{report.content}</TableCell>
      <TableCell>TODO</TableCell>
    </TableRow>
  );
}

export default ReportRow;
