// src/components/TeamCard.jsx
import { useState } from "react";

const pointOptions = [5, 10, 15, 20, 30, 40, 45, 50];

export default function TeamCard({
  team,
  index,
  recentChange,
  onAdd,
  onRemove,
  disabled,
}) {
  const [showSubtract, setShowSubtract] = useState(false);

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
                recentChange.type === "add" ? "text-green-500" : "text-red-500"
              }`}
            >
              {recentChange.type === "add" ? "+" : "-"}
              {recentChange.value}
            </span>
          )}
          <span className="text-xl font-bold text-blue-600 min-w-[70px]">
            {team.score} pts
          </span>
        </div>
      </div>

      {!disabled && (
        <>
          {/* Add Buttons */}
          <div className="overflow-x-auto">
            <div className="flex gap-2 mb-2 w-max">
              {pointOptions.map((pts) => (
                <button
                  key={`add-${pts}`}
                  onClick={() => onAdd(index, pts)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-base whitespace-nowrap"
                >
                  +{pts}
                </button>
              ))}
            </div>
          </div>

          {/* Subtract Toggle (Mobile) */}
          <div className="block sm:hidden mt-2">
            <button
              onClick={() => setShowSubtract((prev) => !prev)}
              className="text-sm text-red-500 underline"
            >
              {showSubtract ? "Hide" : "Show"} Subtract Buttons
            </button>
          </div>

          {showSubtract && (
            <div className="overflow-x-auto mt-2 block sm:hidden">
              <div className="flex gap-2 w-max">
                {pointOptions.map((pts) => (
                  <button
                    key={`sub-mobile-${pts}`}
                    onClick={() => onRemove(index, pts)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-base whitespace-nowrap"
                  >
                    -{pts}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subtract Buttons (Desktop) */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto mt-2">
              <div className="flex gap-2 w-max">
                {pointOptions.map((pts) => (
                  <button
                    key={`sub-${pts}`}
                    onClick={() => onRemove(index, pts)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-base whitespace-nowrap"
                  >
                    -{pts}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
