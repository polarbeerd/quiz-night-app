export default function FinishDialog({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // Dismiss when clicking the backdrop
    >
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent dismiss when clicking inside dialog
      >
        <p className="text-lg font-semibold mb-4 text-center">
          Bitirmek istediğine emin misin?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#EE564C] text-white rounded hover:bg-[#DC3226]"
          >
            Hayır
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#0EAD69] text-white rounded hover:bg-green-700"
          >
            Evet
          </button>
        </div>
      </div>
    </div>
  );
}
