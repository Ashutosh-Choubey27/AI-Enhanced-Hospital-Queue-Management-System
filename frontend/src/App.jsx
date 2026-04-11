import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import QueuePage from "./pages/QueuePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import StatementPage from "./pages/StatementPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/statement" element={<StatementPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
