import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Event from "./pages/Event";

export default function App() {
  return (
    <div
      id="app-scroll-container" //
      className="bg-gray-50 min-h-screen max-w-3xl mx-auto px-4 pb-6 pt-3"
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<Event />} />
      </Routes>
    </div>
  );
}
