// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center my-0">
      <img
        src={logo}
        alt="Go to menu"
        onClick={() => navigate("/")}
        className="h-20 cursor-pointer object-contain"
      />
    </div>
  );
}
