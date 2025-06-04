// src/pages/Event.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import TeamCard from "../components/TeamCard";
import FinishDialog from "../components/FinishDialog";
import Header from "../components/Header";
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Event() {
  const { id: eventId } = useParams();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentChanges, setRecentChanges] = useState({});
  const [showFinishPrompt, setShowFinishPrompt] = useState(false);
  const [finishInput, setFinishInput] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const roundRefs = useRef({});
  const selectorRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEventData({ ...docSnap.data(), id: docSnap.id });
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  const flashChange = (teamIndex, value, type) => {
    setRecentChanges((prev) => ({ ...prev, [teamIndex]: { value, type } }));
    setTimeout(() => {
      setRecentChanges((prev) => {
        const updated = { ...prev };
        delete updated[teamIndex];
        return updated;
      });
    }, 2500);
  };

  const addPoints = async (teamIndex, points) => {
    const updatedTeams = [...eventData.teams];
    updatedTeams[teamIndex].score += points;

    const updatedRounds = eventData.rounds || {};
    const roundKey = `round_${currentRound}`;
    if (!updatedRounds[roundKey]) {
      updatedRounds[roundKey] = [];
    }
    updatedRounds[roundKey].push({ teamIndex, points, type: "add" });

    await updateDoc(doc(db, "events", eventId), {
      teams: updatedTeams,
      rounds: updatedRounds,
    });

    setEventData({ ...eventData, teams: updatedTeams, rounds: updatedRounds });
    flashChange(teamIndex, points, "add");
  };

  const removePoints = async (teamIndex, points) => {
    const updatedTeams = [...eventData.teams];
    updatedTeams[teamIndex].score -= points;

    const updatedRounds = eventData.rounds || {};
    const roundKey = `round_${currentRound}`;
    if (!updatedRounds[roundKey]) {
      updatedRounds[roundKey] = [];
    }
    updatedRounds[roundKey].push({ teamIndex, points, type: "subtract" });

    await updateDoc(doc(db, "events", eventId), {
      teams: updatedTeams,
      rounds: updatedRounds,
    });

    setEventData({ ...eventData, teams: updatedTeams, rounds: updatedRounds });
    flashChange(teamIndex, points, "subtract");
  };

  const goToPreviousRound = () => {
    if (currentRound > 1) setCurrentRound((prev) => prev - 1);
  };

  const goToNextRound = () => {
    setCurrentRound((prev) => prev + 1);
  };

  const getRoundScore = (teamIndex) => {
    const roundKey = `round_${currentRound}`;
    const roundEntries = eventData.rounds?.[roundKey] || [];
    return roundEntries
      .filter((entry) => entry.teamIndex === teamIndex)
      .reduce((acc, entry) => {
        return entry.type === "add" ? acc + entry.points : acc - entry.points;
      }, 0);
  };

  if (loading) return <div className="p-6 text-center">Loading event...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <Header />

      {/* Round Title */}
      <div className="text-center text-2xl font-bold mb-3 text-zinc-800">
        Round {currentRound}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-3 mb-4">
        <button
          onClick={goToPreviousRound}
          className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium text-base hover:bg-blue-700 shadow transition"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <button
          onClick={goToNextRound}
          className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium text-base hover:bg-blue-700 shadow transition"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Round Selector */}
      <div
        ref={selectorRef}
        className="flex overflow-x-auto scrollbar-hide space-x-2 pb-4 mb-6 px-1"
      >
        {[...Array(45)].map((_, i) => {
          const roundNum = i + 1;
          const hasData = eventData.rounds?.[`round_${roundNum}`]?.length > 0;
          return (
            <button
              key={roundNum}
              ref={(el) => (roundRefs.current[roundNum] = el)}
              onClick={() => setCurrentRound(roundNum)}
              className={`px-3 py-2 min-w-[44px] text-sm rounded-md font-semibold border transition text-center ${
                currentRound === roundNum
                  ? "bg-yellow-500 text-white border-yellow-600"
                  : hasData
                  ? "bg-gray-300 text-black border-gray-400"
                  : "bg-gray-200 text-gray-600 border-gray-300"
              }`}
            >
              {roundNum}
            </button>
          );
        })}
      </div>

      {/* Team Cards */}
      <div className="space-y-4">
        {eventData.teams.map((team, index) => (
          <TeamCard
            key={index}
            index={index}
            team={{ ...team, score: getRoundScore(index) }}
            recentChange={recentChanges[index]}
            onAdd={addPoints}
            onRemove={removePoints}
            disabled={eventData.finished}
          />
        ))}
      </div>

      {/* Leaderboard */}
      <div className="mt-10 text-center">
        <h3 className="text-xl font-semibold mb-2 text-zinc-800">
          Leaderboard
        </h3>
        <ul className="space-y-1 text-sm sm:text-base text-zinc-700">
          {[...eventData.teams]
            .sort((a, b) => b.score - a.score)
            .map((team, i) => (
              <li key={i}>
                {i + 1}. {team.name} – {team.score} pts
              </li>
            ))}
        </ul>
      </div>

      {/* Finish Event */}
      {!eventData.finished && (
        <button
          onClick={() => setShowFinishPrompt(true)}
          className="mt-10 w-full bg-red-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-red-700 shadow-lg flex items-center justify-center gap-2"
        >
          <Flag size={20} />
          Finish Event
        </button>
      )}

      <FinishDialog
        show={showFinishPrompt}
        onClose={() => setShowFinishPrompt(false)}
        onConfirm={async () => {
          await updateDoc(doc(db, "events", eventId), { finished: true });
          setEventData((prev) => ({ ...prev, finished: true }));
          setShowFinishPrompt(false);
        }}
        value={finishInput}
        onChange={setFinishInput}
      />
    </div>
  );
}
