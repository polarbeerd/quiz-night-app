import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ScoreTable({ teams, rounds }) {
  const [open, setOpen] = useState(false);

  const roundKeys = Object.keys(rounds || {}).sort(
    (a, b) => Number(a.split("_")[1]) - Number(b.split("_")[1])
  );

  const getTotalScore = (teamIndex) => {
    return roundKeys.reduce((total, roundKey) => {
      const roundEntries = rounds[roundKey] || [];
      return (
        total +
        roundEntries
          .filter((e) => e.teamIndex === teamIndex)
          .reduce(
            (sum, e) => sum + (e.type === "add" ? e.points : -e.points),
            0
          )
      );
    }, 0);
  };

  const sortedTeams = [...teams]
    .map((team, index) => ({
      name: team.name,
      score: getTotalScore(index),
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="mt-6">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 cursor-pointer select-none mb-2"
      >
        <h2 className="text-xl font-bold text-gray-800">Çetele</h2>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {open && (
        <ul className="space-y-1 text-gray-800 text-base bg-white p-3 rounded shadow-sm border">
          {sortedTeams.map((team, i) => (
            <li key={i} className="flex justify-between border-b py-1">
              <span>
                {i + 1}. {team.name}
              </span>
              <span className="text-blue-600 font-medium">
                {team.score} puan
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
