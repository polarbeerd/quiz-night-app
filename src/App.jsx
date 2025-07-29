import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Event from "./pages/Event";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute"; // we'll add this next

export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen max-w-3xl mx-auto px-4 pb-6 pt-3">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/event/:id"
          element={
            <PrivateRoute>
              <Event />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}
