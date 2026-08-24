import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

function TicketList({
  tickets,
  loading,
  search,
  setSearch,
  status,
  setStatus,
}) {
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">All Tickets</h2>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Search by customer or subject..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>

            <SelectItem value="Open">Open</SelectItem>

            <SelectItem value="In Progress">In Progress</SelectItem>

            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tickets.length === 0 && loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow
                  key={ticket._id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                >
                  <TableCell>{ticket.ticket_id}</TableCell>

                  <TableCell>{ticket.customer_name}</TableCell>

                  <TableCell>{ticket.customer_email}</TableCell>

                  <TableCell>{ticket.subject}</TableCell>

                  <TableCell>
                    <Badge>{ticket.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default TicketList;
