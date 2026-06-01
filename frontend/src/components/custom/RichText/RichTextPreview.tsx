import DOMPurify from "dompurify";

interface Props {
    content: string;
    title?: string;
}

const RichTextPreview = ({ title, content }: Props) => {
    const cleanContent = DOMPurify.sanitize(content).replace(/&nbsp;/g, " ");

    return (
        <div className="w-full min-w-0">
            {title && <h1 className="text-2xl font-semibold mb-4">{title}</h1>}

            <div
                className="prose max-w-full break-words bg-white rounded"
                dangerouslySetInnerHTML={{
                    __html: cleanContent,
                }}
            />
        </div>
    );
};

export default RichTextPreview;
