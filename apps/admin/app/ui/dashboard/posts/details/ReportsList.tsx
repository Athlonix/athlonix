import ReportRow from '@/app/ui/dashboard/posts/details/ReportRow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/ui/table';

type Report = {
  id: number;
  created_at: string;
  id_reason: number;
  content: string;
};

type Reason = {
  id: number;
  reason: string;
};

interface Props {
  reports: Report[];
  reasons: Reason[];
}

function ReportsList({ reports, reasons }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-black">
          <TableHead>Date</TableHead>
          <TableHead>Raison</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Aucun signalement actuellement.
            </TableCell>
          </TableRow>
        )}
        {reports.map((report) => {
          const reason = reasons.find((reason) => reason.id === report.id_reason)?.reason || '';
          return <ReportRow key={report.id} report={report} reason={reason} />;
        })}
      </TableBody>
    </Table>
  );
}

export default ReportsList;
