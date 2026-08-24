import { useCallback, useEffect, useState } from "react";

import api from "@/services/api";
import TicketList from "@/components/TicketList";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function HomePage() {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (status !== "all") {
        params.status = status;
      }

      const response = await api.get("/tickets", {
        params,
      });

      setTickets(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/tickets", formData);

      alert(`Ticket created successfully: ${response.data.data.ticket_id}`);

      await fetchTickets();

      setFormData({
        customer_name: "",
        customer_email: "",
        subject: "",
        description: "",
      });
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to create ticket");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTickets();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchTickets]);

  return (
    <main className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>

            <CardDescription>
              Enter the customer details and describe the issue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name</Label>

                <Input
                  id="customer_name"
                  name="customer_name"
                  placeholder="Enter customer name"
                  value={formData.customer_name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_email">Customer Email</Label>

                <Input
                  id="customer_email"
                  type="email"
                  name="customer_email"
                  placeholder="Enter customer email"
                  value={formData.customer_email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>

                <Input
                  id="subject"
                  name="subject"
                  placeholder="Enter ticket subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the issue..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full">
                Create Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
        <TicketList
          tickets={tickets}
          loading={loading}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />
      </div>
    </main>
  );
}

export default HomePage;
