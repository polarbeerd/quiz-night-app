import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("elefante");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple check for username and password
    if (username === "elefante" && password === "alper") {
      localStorage.setItem("demo", "false"); // Real DB
      navigate("/");
    } else {
      alert("Kullanıcı adı veya şifre hatalı.");
    }
  };

  const enterAsDemo = () => {
    localStorage.setItem("demo", "true"); // Demo DB
    navigate("/");
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Giriş Yap
        </button>
      </form>

      <div className="text-center my-4 text-gray-500">veya</div>

      <button
        onClick={enterAsDemo}
        className="w-full bg-gray-200 text-gray-800 rounded p-2 hover:bg-gray-300"
      >
        Demo Olarak Devam Et
      </button>
      <p className="mt-6 text-sm text-gray-500 text-center">
        Demo modunda, gerçek veritabanına ve önceki etkinliklere erişemezsiniz.
        Ancak demo modda en fazla 5 etkinlik kaydedilebilir. 6. etkinlik
        oluşturulduğunda en eskisi silinir.
      </p>
    </div>
  );
}
