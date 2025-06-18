// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center my-0 border-b border-gray-400 shadow-sm ">
      <img
        src={logo}
        alt="Go to menu"
        onClick={() => navigate("/")}
        className="h-16 cursor-pointer object-contain "
      />
    </div>
  );
}
