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
import { ArrowRight, Pen, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

export default function SetupForm() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState("Sessiz Sinema");
  const [teamCount, setTeamCount] = useState(3);
  const [teamNames, setTeamNames] = useState(
    Array.from({ length: 3 }, (_, i) => `Masa ${i + 1}`)
  );
  const [events, setEvents] = useState([]);
  const [showFinished, setShowFinished] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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

    if (events.length >= 50) {
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

  const handleTeamCount = (num) => {
    setTeamCount(num);
    setTeamNames(Array.from({ length: num }, (_, i) => `Masa ${i + 1}`));
  };

  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "events", id));
    setConfirmDeleteId(null);
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
        {["Sessiz Sinema", "Quiz Night"].map((event) => (
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

      {/* Devam Eden Etkinlikler */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
          Devam Eden Etkinlikler
        </h2>
        {events
          .filter((e) => !e.finished)
          .map((event) => (
            <div
              key={event.id}
              className="p-4 bg-white rounded shadow mb-3 cursor-pointer border hover:bg-gray-50 flex justify-between items-center"
              onClick={() => navigate(`/event/${event.id}`)}
            >
              <div>
                <div className="font-semibold text-base">{event.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(event.createdAt).toLocaleString()}
                </div>
              </div>
              <Trash2
                size={18}
                className="text-gray-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(event.id);
                }}
              />
            </div>
          ))}

        {/* Biten Etkinlikler */}
        <div className="mt-6 border-b">
          <div
            onClick={() => setShowFinished((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer select-none mb-2"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Biten Etkinlikler
            </h2>
            {showFinished ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {showFinished && (
            <div className="space-y-2">
              {events
                .filter((e) => e.finished)
                .map((event) => (
                  <details
                    key={event.id}
                    className="bg-white rounded border p-4"
                  >
                    <summary className="cursor-pointer font-semibold flex justify-between items-center">
                      <span>
                        {event.name} —{" "}
                        {new Date(event.createdAt).toLocaleDateString()}
                      </span>
                      <Trash2
                        size={16}
                        className="text-gray-500 hover:text-red-600"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setConfirmDeleteId(event.id);
                        }}
                      />
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
          )}
        </div>
      </div>

      {/* Confirmation Popup */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setConfirmDeleteId(null)} // allow closing by clicking outside
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside the dialog
          >
            <p className="text-lg font-semibold mb-4 text-center">
              Etkinliği silmek istediğine emin misin?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-[#EE564C] text-white rounded hover:bg-[#DC3226]"
              >
                Hayır
              </button>
              <button
                onClick={() => deleteEvent(confirmDeleteId)}
                className="px-4 py-2 bg-[#0EAD69] text-white rounded hover:bg-green-700"
              >
                Evet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
