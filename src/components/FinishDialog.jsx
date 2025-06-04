export default function FinishDialog({
  show,
  onClose,
  onConfirm,
  value,
  onChange,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-2">Finish Event?</h2>
        <p className="text-sm mb-3">
          Type <b>finish</b> to confirm.
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border px-2 py-1 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 text-gray-600">
            Cancel
          </button>
          <button
            disabled={value !== "finish"}
            onClick={onConfirm}
            className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
