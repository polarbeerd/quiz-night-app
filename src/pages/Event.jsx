// src/pages/Event.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import TeamCard from "../components/TeamCard";
import FinishDialog from "../components/FinishDialog";
import Header from "../components/Header";
import { Flag, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import ScoreTable from "../components/ScoreTable";

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

  useEffect(() => {
    if (eventData?.finished) {
      confetti({
        particleCount: 1000,
        spread: 100,
        startVelocity: 50,
        gravity: 1, // higher gravity to push down
        ticks: 1000, // longer animation
        origin: { y: 0.1 },
        scalar: 1.2,
      });
    }
  }, [eventData?.finished]);
  useEffect(() => {
    const activeRef = roundRefs.current[currentRound];
    const container = selectorRef.current;
    if (activeRef && container) {
      activeRef.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentRound]);

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
      .reduce(
        (acc, entry) =>
          entry.type === "add" ? acc + entry.points : acc - entry.points,
        0
      );
  };

  if (loading) return <div className="p-6 text-center">Loading event...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto min-h-screen">
      <Header />

      {!eventData.finished && (
        <>
          <div className="text-center text-2xl font-bold mb-3 text-[#1F2937]">
            Round {currentRound}
          </div>

          <div className="flex justify-between items-center gap-3 mb-4">
            <button
              onClick={goToPreviousRound}
              className="flex-1 flex justify-center items-center gap-2 bg-[#0EAD69] text-white py-3 rounded-lg font-medium text-base hover:bg-opacity-90 shadow transition"
            >
              <ChevronLeft size={20} /> Previous
            </button>
            <button
              onClick={goToNextRound}
              className="flex-1 flex justify-center items-center gap-2 bg-[#0EAD69] text-white py-3 rounded-lg font-medium text-base hover:bg-opacity-90 shadow transition"
            >
              Next <ChevronRight size={20} />
            </button>
          </div>

          <div
            ref={selectorRef}
            className="flex overflow-x-auto scrollbar-hide space-x-2 pb-4 mb-6"
          >
            {[...Array(45)].map((_, i) => {
              const roundNum = i + 1;
              return (
                <button
                  key={roundNum}
                  ref={(el) => (roundRefs.current[roundNum] = el)}
                  onClick={() => setCurrentRound(roundNum)}
                  className={`px-3 py-2 min-w-[44px] text-sm rounded-md border text-center font-medium transition-all ${
                    currentRound === roundNum
                      ? "bg-yellow-500 text-white border-yellow-500"
                      : "bg-gray-200 text-gray-600 border-gray-300"
                  }`}
                >
                  {roundNum}
                </button>
              );
            })}
          </div>

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
                currentRound={currentRound}
                rounds={eventData.rounds}
              />
            ))}
          </div>
          <ScoreTable teams={eventData.teams} rounds={eventData.rounds} />

          {!eventData.finished && (
            <button
              onClick={() => setShowFinishPrompt(true)}
              className="mt-10 w-full bg-[#EE564C] text-white py-3 rounded-xl text-lg font-semibold hover:bg-opacity-90 shadow-lg flex items-center justify-center gap-2"
            >
              <Flag size={20} /> Finish Event
            </button>
          )}
        </>
      )}

      {eventData.finished && (
        <div className="mt-12 text-center">
          <h3 className="text-3xl font-extrabold mb-6 flex items-center justify-center gap-2 text-[#1F2937]">
            <Trophy size={32} className="text-yellow-500" /> Final Leaderboard
          </h3>
          <ul className="space-y-2 text-sm sm:text-lg text-zinc-700">
            {[...eventData.teams]
              .sort((a, b) => b.score - a.score)
              .map((team, i) => {
                let bgColor = "";
                let textSize = "text-base";

                if (i === 0) {
                  bgColor = "bg-yellow-300";
                  textSize = "text-2xl font-extrabold";
                } else if (i === 1) {
                  bgColor = "bg-yellow-200";
                  textSize = "text-xl font-bold";
                } else if (i === 2) {
                  bgColor = "bg-yellow-100";
                  textSize = "text-xl font-bold";
                }

                return (
                  <li
                    key={i}
                    className={`rounded-lg px-4 py-2 shadow-sm ${bgColor} ${textSize}`}
                  >
                    {i + 1}. {team.name} – {team.score} pts
                  </li>
                );
              })}
          </ul>
        </div>
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
