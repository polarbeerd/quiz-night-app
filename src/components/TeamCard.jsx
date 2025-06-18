import { useEffect, useMemo, useState } from "react";
import { CircleX } from "lucide-react";

const pointOptions = [10, 15, 20, 30, 40, 45, 50];

export default function TeamCard({
  team,
  index,
  onAdd,
  onRemove,
  disabled,
  currentRound,
  rounds,
}) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const { regularPoint, activeBonuses } = useMemo(() => {
    const roundKey = `round_${currentRound}`;
    const roundEntries = rounds?.[roundKey] || [];

    const teamEntries = roundEntries.filter((e) => e.teamIndex === index);

    const regularAdds = teamEntries.filter(
      (e) => e.type === "add" && e.points !== 5
    );
    const regularPoint =
      regularAdds.length > 0
        ? regularAdds[regularAdds.length - 1].points
        : null;

    const bonusAdds = teamEntries.filter(
      (e) => e.type === "add" && e.points === 5
    );
    const bonusSubs = teamEntries.filter(
      (e) => e.type === "subtract" && e.points === 5
    );

    const netBonusCount = bonusAdds.length - bonusSubs.length;
    const activeBonuses = Array.from({ length: netBonusCount }, (_, i) => i);

    return { regularPoint, activeBonuses };
  }, [rounds, currentRound, index]);

  useEffect(() => {
    setSelectedPoint(regularPoint);
  }, [regularPoint]);

  const togglePoint = async (pts) => {
    const previousPoint = selectedPoint;
    const isSelected = previousPoint === pts;

    if (isSelected) {
      setSelectedPoint(null);
      await onRemove(index, pts);
    } else {
      if (previousPoint !== null) {
        await onRemove(index, previousPoint);
      }
      await onAdd(index, pts);
      setSelectedPoint(pts);
    }
  };

  const handleAddBonus = async () => {
    await onAdd(index, 5);
  };

  const handleRemoveBonus = async () => {
    if (activeBonuses.length > 0) {
      await onRemove(index, 5);
    }
  };

  return (
    <div className="w-full max-w-4xl md:w-auto mx-auto p-4 border rounded shadow bg-white relative overflow-hidden">
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
          <div className="flex flex-wrap gap-2 mb-2">
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

            <div className="relative">
              <button
                onClick={handleAddBonus}
                className="px-4 py-3 rounded font-semibold text-base border text-center whitespace-nowrap bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
              >
                +5 Bonus
              </button>

              {activeBonuses.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                  {activeBonuses.length}
                </span>
              )}
            </div>
          </div>

          {activeBonuses.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {activeBonuses.map((_, i) => (
                <button
                  key={i}
                  onClick={handleRemoveBonus}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-base hover:bg-blue-200 transition cursor-pointer border border-blue-300 shadow-sm"
                  title="Bonus puanı geri al"
                >
                  +5
                  <CircleX size={18} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
