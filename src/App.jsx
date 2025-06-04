import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Event from "./pages/Event";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/event/:id" element={<Event />} />
    </Routes>
  );
}
