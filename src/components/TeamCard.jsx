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
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Sync selected point from `rounds` on round change or team change
  useEffect(() => {
    const roundKey = `round_${currentRound}`;
    const entries = rounds?.[roundKey] || [];

    // Get latest action for each point value
    const latestActionMap = new Map();
    entries
      .filter((entry) => entry.teamIndex === index)
      .forEach((entry) => {
        latestActionMap.set(entry.points, entry.type);
      });

    const selected = [...latestActionMap.entries()]
      .filter(([, type]) => type === "add")
      .map(([points]) => points);

    // Select the last added point, or null
    setSelectedPoint(
      selected.length > 0 ? selected[selected.length - 1] : null
    );
  }, [rounds, currentRound, index]);

  const togglePoint = async (pts) => {
    const isSelected = selectedPoint === pts;

    if (isSelected) {
      setSelectedPoint(null); // UI update
      await onRemove(index, pts);
    } else {
      if (selectedPoint !== null) {
        await onRemove(index, selectedPoint);
      }
      setSelectedPoint(pts); // UI update
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
            {team.score} puan
          </span>
        </div>
      </div>

      {!disabled && (
        <div className="overflow-x-auto">
          <div className="flex gap-2 mb-2 w-max">
            {pointOptions.map((pts) => {
              const isActive = selectedPoint === pts;
              const isBlurred = selectedPoint !== null && !isActive;

              return (
                <button
                  key={pts}
                  onClick={() => togglePoint(pts)}
                  className={`px-4 py-2 rounded font-semibold text-base whitespace-nowrap transition border
                    ${
                      isActive
                        ? "bg-[#71C168] text-white border-green-600"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                    }
                    ${
                      isBlurred
                        ? "opacity-40 blur-[1px] pointer-events-none"
                        : ""
                    }
                  `}
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
