import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface PdfViewerProps {
    url: string;
    className?: string;
}

export default function PdfViewer({ url, className = "w-full h-[500px]" }: PdfViewerProps) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        
        const fetchPdf = async () => {
            try {
                setLoading(true);
                setError(false);
                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch PDF");
                
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                
                if (isMounted) {
                    setBlobUrl(objectUrl);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error loading PDF:", err);
                if (isMounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        if (url) {
            // Check if it's already a blob or local URL
            if (url.startsWith("blob:") || url.startsWith("data:")) {
                setBlobUrl(url);
                setLoading(false);
            } else {
                fetchPdf();
            }
        }

        return () => {
            isMounted = false;
            if (blobUrl && blobUrl.startsWith("blob:")) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [url]);

    if (loading) {
        return (
            <div className={`flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
                <Loader2 className="w-8 h-8 text-green-500 animate-spin mb-2" />
                <p className="text-sm text-gray-500">Đang tải PDF...</p>
            </div>
        );
    }

    if (error || !blobUrl) {
        return (
            <div className={`flex flex-col items-center justify-center bg-gray-50 border border-red-100 rounded-lg ${className}`}>
                <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Không thể tải file PDF</p>
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:underline font-medium"
                >
                    Nhấn vào đây để tải về
                </a>
            </div>
        );
    }

    return (
        <div className={`border border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${className}`}>
            <iframe
                src={blobUrl}
                title="PDF Preview"
                className="w-full h-full"
            />
        </div>
    );
}
