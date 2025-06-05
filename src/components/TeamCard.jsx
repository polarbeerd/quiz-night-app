import { useEffect, useState } from "react";

const pointOptions = [5, 10, 15, 20, 30, 40, 45, 50];

export default function TeamCard({
  team,
  index,
  recentChange,
  onAdd,
  onRemove,
  disabled,
  currentRound,
  rounds,
}) {
  const [localSelected, setLocalSelected] = useState([]);

  // Sync selected points from `rounds` on round change or team change
  useEffect(() => {
    const roundKey = `round_${currentRound}`;
    const entries = rounds?.[roundKey] || [];

    const selected = entries
      .filter((entry) => entry.teamIndex === index && entry.type === "add")
      .map((entry) => entry.points);

    setLocalSelected(selected);
  }, [rounds, currentRound, index]);

  const togglePoint = async (pts) => {
    const isSelected = localSelected.includes(pts);
    let updated;

    if (isSelected) {
      updated = localSelected.filter((p) => p !== pts);
      setLocalSelected(updated); // UI update
      await onRemove(index, pts);
    } else {
      updated = [...localSelected, pts];
      setLocalSelected(updated); // UI update
      await onAdd(index, pts);
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-white relative overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold truncate max-w-[60%]">
          {team.name}
        </h2>
        <div className="flex items-center gap-1">
          {recentChange && (
            <span
              className={`text-lg font-bold w-12 text-right animate-fade-delayed ${
                recentChange.type === "add" ? "text-[#4CAF50]" : "text-red-500"
              }`}
            >
              {recentChange.type === "add" ? "+" : "-"}
              {recentChange.value}
            </span>
          )}
          <span className="text-xl font-bold text-[#2563EB] min-w-[70px]">
            {team.score} pts
          </span>
        </div>
      </div>

      {!disabled && (
        <div className="overflow-x-auto">
          <div className="flex gap-2 mb-2 w-max">
            {pointOptions.map((pts) => {
              const isActive = localSelected.includes(pts);
              return (
                <button
                  key={pts}
                  onClick={() => togglePoint(pts)}
                  className={`px-4 py-2 rounded font-semibold text-base whitespace-nowrap transition border
                    ${
                      isActive
                        ? "bg-[#71C168] text-white border-green-600"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                    }`}
                >
                  +{pts}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
