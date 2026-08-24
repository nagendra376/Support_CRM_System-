import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import TicketDetailsPage from "@/pages/TicketDetailsPage";
import "@/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/tickets/:ticket_id" element={<TicketDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
