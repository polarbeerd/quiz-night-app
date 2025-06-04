// src/pages/Home.jsx
import Header from "../components/Header";
import SetupForm from "../components/SetupForm";

export default function Home() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <Header />
      <SetupForm />
    </div>
  );
}
