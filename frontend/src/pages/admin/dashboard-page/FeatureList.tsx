interface Props {
    features: string[];
}

export default function FeatureList({ features }: Props) {
    return (
        <div className="space-y-2">
            {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <span className="text-sm text-gray-700">{feature}</span>
                </div>
            ))}
        </div>
    );
}
