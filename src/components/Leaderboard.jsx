// src/components/Leaderboard.jsx
import { Trophy } from "lucide-react";

export default function Leaderboard({ teams }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="mt-8 text-center">
      <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
      </h3>
      <ul className="space-y-2">
        {sorted.map((team, i) => (
          <li
            key={i}
            className="bg-gray-50 border rounded px-4 py-2 text-left shadow-sm"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium truncate max-w-[60%]">
                {i + 1}. {team.name}
              </span>
              <span className="font-bold text-blue-700">{team.score} pts</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
