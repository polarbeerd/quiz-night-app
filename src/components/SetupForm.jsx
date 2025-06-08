import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { ArrowRight, Pen } from "lucide-react";

export default function SetupForm() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [teamCount, setTeamCount] = useState(3);
  const [teamNames, setTeamNames] = useState(
    Array.from({ length: 3 }, (_, i) => `Masa ${i + 1}`)
  );
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const allEvents = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setEvents(allEvents);
    });
    return () => unsubscribe();
  }, []);

  const createEvent = async () => {
    if (!selectedEvent) return;

    const eventsRef = collection(db, "events");
    const snapshot = await getDocs(eventsRef);
    const events = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.createdAt - a.createdAt);

    if (events.length >= 10) {
      const oldestEvent = events[events.length - 1];
      await deleteDoc(doc(eventsRef, oldestEvent.id));
    }

    const newEvent = {
      name: selectedEvent,
      teams: teamNames.map((name) => ({
        name,
        score: 0,
      })),
      createdAt: Date.now(),
      finished: false,
    };

    const docRef = await addDoc(eventsRef, newEvent);
    navigate(`/event/${docRef.id}`);
  };

  // Update teamNames whenever teamCount changes
  const handleTeamCount = (num) => {
    setTeamCount(num);
    setTeamNames(Array.from({ length: num }, (_, i) => `Masa ${i + 1}`));
  };

  return (
    <div className="max-w-xl mx-auto mt-4 px-4">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
        Etkinlik Paneli
      </h1>
      <label className="block text-gray-700 font-medium mb-2">
        Bugün ne oynuyoruz?
      </label>
      <div className="flex justify-between gap-4 mb-6">
        {["Quiz Night", "Sessiz Sinema"].map((event) => (
          <button
            key={event}
            onClick={() => setSelectedEvent(event)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              selectedEvent === event
                ? "bg-yellow-500 text-white border border-yellow-600"
                : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            {event}
          </button>
        ))}
      </div>

      <label className="block text-gray-700 font-medium mb-2">
        Kaç masa var?
      </label>
      <div className="flex justify-between gap-2 mb-6">
        {Array.from({ length: 7 }, (_, i) => i + 3).map((num) => (
          <button
            key={num}
            onClick={() => handleTeamCount(num)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              teamCount === num
                ? "bg-yellow-500 text-white border border-yellow-600"
                : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Takım İsimlerini Düzenle
        </label>
        <div className="space-y-2">
          {teamNames.map((name, idx) => (
            <div key={idx} className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const updated = [...teamNames];
                  updated[idx] = e.target.value;
                  setTeamNames(updated);
                }}
                className="w-full py-2 pl-4 pr-10 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Pen
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={createEvent}
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        Başla <ArrowRight size={20} />
      </button>

      {/* Tabs for Ongoing and Finished Events */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
          Devam Eden Etkinlikler
        </h2>
        {events
          .filter((e) => !e.finished)
          .map((event) => (
            <div
              key={event.id}
              className="p-4 bg-white rounded shadow mb-3 cursor-pointer border hover:bg-gray-50"
              onClick={() => navigate(`/event/${event.id}`)}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-base">{event.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
          Biten Etkinlikler
        </h2>
        <div className="space-y-2">
          {events
            .filter((e) => e.finished)
            .map((event) => (
              <details key={event.id} className="bg-white rounded border p-4">
                <summary className="cursor-pointer font-semibold">
                  {event.name} —{" "}
                  {new Date(event.createdAt).toLocaleDateString()}
                </summary>
                <div className="mt-2 text-sm text-gray-600">
                  {event.teams.map((t, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{t.name}</span>
                      <span>{t.score} pts</span>
                    </div>
                  ))}
                </div>
              </details>
            ))}
        </div>
      </div>
    </div>
  );
}
