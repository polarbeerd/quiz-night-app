export default function FinishDialog({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg  text-center mb-2">
          Bitirmek istediğine emin misin?
        </h2>
        <div className="flex justify-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-[#0EAD69] text-white rounded"
          >
            Onayla
          </button>
        </div>
      </div>
    </div>
  );
}
