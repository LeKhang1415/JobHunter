import DOMPurify from "dompurify";

interface Props {
    content: string;
    title?: string;
}

const RichTextPreview = ({ title, content }: Props) => {
    let cleanContent = DOMPurify.sanitize(content || "").replace(/&nbsp;/g, " ");

    // If the content is plain text (doesn't contain <p> tags from the RichTextEditor),
    // we manually convert newlines into <p> tags so that Tailwind's `prose` can apply proper paragraph spacing.
    if (!cleanContent.includes("<p>")) {
        cleanContent = cleanContent
            .split(/\n+/)
            .filter((line) => line.trim() !== "")
            .map((line) => `<p>${line}</p>`)
            .join("");
    }

    return (
        <div className="w-full min-w-0">
            {title && <h1 className="text-2xl font-semibold mb-4">{title}</h1>}

            <div
                className="prose max-w-full break-words bg-white rounded leading-relaxed md:leading-loose text-gray-700 [&_p]:mb-8 [&_ul]:mb-8 [&_ol]:mb-8 [&_br]:block [&_br]:mb-8 [&_br]:content-['']"
                dangerouslySetInnerHTML={{
                    __html: cleanContent,
                }}
            />
        </div>
    );
};

export default RichTextPreview;
