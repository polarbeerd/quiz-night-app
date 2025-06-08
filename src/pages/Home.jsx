// src/pages/Home.jsx
import Header from "../components/Header";
import SetupForm from "../components/SetupForm";

export default function Home() {
  return (
    <div className="px-6 pb-6 pt-0 max-w-xl mx-auto">
      <Header />
      <SetupForm />
    </div>
  );
}
