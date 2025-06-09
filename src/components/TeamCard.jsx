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

  useEffect(() => {
    const roundKey = `round_${currentRound}`;
    const entries = rounds?.[roundKey] || [];

    const latestActionMap = new Map();
    entries
      .filter((entry) => entry.teamIndex === index)
      .forEach((entry) => {
        latestActionMap.set(entry.points, entry.type);
      });

    const selected = [...latestActionMap.entries()]
      .filter(([, type]) => type === "add")
      .map(([points]) => points);

    setSelectedPoint(
      selected.length > 0 ? selected[selected.length - 1] : null
    );
  }, [rounds, currentRound, index]);

  const togglePoint = async (pts) => {
    const isSelected = selectedPoint === pts;

    if (isSelected) {
      setSelectedPoint(null);
      await onRemove(index, pts);
    } else {
      if (selectedPoint !== null) {
        await onRemove(index, selectedPoint);
      }
      setSelectedPoint(pts);
      await onAdd(index, pts);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow bg-white relative overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold truncate max-w-[60%]">
          {team.name}
        </h2>
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-[#2563EB] min-w-[70px]">
            {team.score} puan
          </span>
        </div>
      </div>

      {!disabled && (
        <div className="w-full">
          <div className="flex flex-wrap md:flex-nowrap gap-2 mb-2">
            {pointOptions.map((pts) => {
              const isActive = selectedPoint === pts;

              return (
                <button
                  key={pts}
                  onClick={() => togglePoint(pts)}
                  className={`px-4 py-3 rounded font-semibold text-base border text-center whitespace-nowrap
                    ${
                      isActive
                        ? "bg-[#71C168] text-white border-green-600"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
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
