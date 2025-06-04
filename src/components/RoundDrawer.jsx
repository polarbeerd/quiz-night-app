export default function RoundDrawer({ show, onClose, rounds }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-end z-50">
      <div className="bg-white w-full max-h-[80vh] rounded-t-lg overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Review Rounds</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>
        {rounds?.length > 0 ? (
          rounds.map((round, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-semibold">Round {round.round}</h3>
              <ul className="ml-4 list-disc">
                {round.actions.map((a, i) => (
                  <li
                    key={i}
                    className={a.points > 0 ? "text-green-600" : "text-red-600"}
                  >
                    {a.team}: {a.points > 0 ? "+" : ""}
                    {a.points} pts
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No round data yet.</p>
        )}
      </div>
    </div>
  );
}
