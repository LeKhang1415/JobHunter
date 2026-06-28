import { AlertTriangle, Loader2 } from "lucide-react";

interface WithdrawConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function WithdrawConfirmModal({ isOpen, onClose, onConfirm, isLoading }: WithdrawConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Xác nhận rút hồ sơ</h2>
                    <p className="text-sm text-gray-500 text-center">
                        Bạn có chắc chắn muốn rút hồ sơ ứng tuyển này không? Hành động này không thể hoàn tác và nhà tuyển dụng sẽ không thể xem hồ sơ của bạn nữa.
                    </p>
                </div>
                
                <div className="flex items-center justify-center gap-3 p-6 pt-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rút hồ sơ"}
                    </button>
                </div>
            </div>
        </div>
    );
}
