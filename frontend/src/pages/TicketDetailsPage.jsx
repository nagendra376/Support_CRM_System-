import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "@/services/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TicketDetailsPage() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const route = useNavigate();
  const [note, setNote] = useState("");

  const fetchTicket = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/tickets/${ticket_id}`);

      setTicket(response.data.data.ticket);
      setNotes(response.data.data.notes);

      // Set current ticket status in the dropdown
      setStatus(response.data.data.ticket.status);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticket_id]);

  const handleUpdate = async () => {
    try {
      const response = await api.put(`/tickets/${ticket_id}`, {
        status,
        note,
      });

      setTicket(response.data.data.ticket);
      setNotes(response.data.data.notes);

      // Clear the note textarea after saving
      setNote("");

      alert("Ticket updated successfully");
      route("/"); // Navigate back to the ticket list after update
    } catch (error) {
      console.error("Error updating ticket:", error);

      alert(error.response?.data?.message || "Failed to update ticket");
    }
  };

  if (loading) {
    return <p className="p-6">Loading ticket...</p>;
  }

  if (!ticket) {
    return <p className="p-6">Ticket not found</p>;
  }

  return (
    <main className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate("/")}>
          ← Back to Tickets
        </Button>

        {/* Ticket Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Support Ticket</p>

            <h1 className="text-3xl font-bold">{ticket.ticket_id}</h1>

            <p className="mt-1 text-muted-foreground">{ticket.subject}</p>
          </div>

          <Badge>{ticket.status}</Badge>
        </div>

        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>

            <CardDescription>
              Information about the customer who created this ticket.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>

              <p className="font-medium">{ticket.customer_name}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Email</p>

              <p className="font-medium">{ticket.customer_email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Issue Details */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>

              <p className="font-medium">{ticket.subject}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Description</p>

              <p className="mt-1 whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Update Ticket */}
        <Card>
          <CardHeader>
            <CardTitle>Update Ticket</CardTitle>

            <CardDescription>
              Change the ticket status or add a note.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Status</Label>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>

                  <SelectItem value="In Progress">In Progress</SelectItem>

                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Add Note</Label>

              <Textarea
                id="note"
                placeholder="Write a note about this ticket..."
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleUpdate} className="w-full">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>

            <CardDescription>
              History and updates for this ticket.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {notes.length === 0 ? (
              <p className="text-muted-foreground">No notes yet.</p>
            ) : (
              <div className="space-y-4">
                {notes.map((item) => (
                  <div key={item._id} className="rounded-lg border p-4">
                    <p>{item.note}</p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default TicketDetailsPage;
