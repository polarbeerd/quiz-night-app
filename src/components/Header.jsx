import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { LogOut } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDemo = localStorage.getItem("demo") === "true";
  const showLogout = location.pathname !== "/login";

  const handleLogout = () => {
    localStorage.removeItem("demo");
    navigate("/login");
  };

  return (
    <div className="relative flex justify-center items-center border-b border-gray-400 shadow-sm h-16 px-4">
      {/* DEMO MODE LABEL */}
      {isDemo && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded shadow-sm border border-red-200">
          DEMO
        </div>
      )}

      {/* LOGO CENTERED */}
      <img
        src={logo}
        alt="Go to menu"
        onClick={() => navigate("/")}
        className="h-16 w-auto cursor-pointer object-contain"
      />

      {/* LOGOUT BUTTON RIGHT */}
      {showLogout && (
        <button
          onClick={handleLogout}
          className="absolute right-4 text-gray-600 hover:text-gray-800 flex items-center"
        >
          <LogOut size={18} />
        </button>
      )}
    </div>
  );
}
