import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import FeatureList from "./FeatureList";
import SubItemList from "./SubItemList";
import { type LucideIcon } from "lucide-react";

interface SubItem {
    name: string;
    icon: LucideIcon;
    description: string;
}

interface Props {
    category: string;
    icon: LucideIcon;
    color: string;
    iconColor: string;
    description: string;
    features: string[];
    subItems?: SubItem[];
}

export default function FeatureCard({
    category,
    icon: Icon,
    color,
    iconColor,
    description,
    features,
    subItems,
}: Props) {
    return (
        <Card className={`${color} transition-all hover:shadow-lg`}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-white p-2 ${iconColor}`}>
                        <Icon className="h-5 w-5" />
                    </div>

                    <div>
                        <CardTitle className="text-lg text-gray-900">
                            {category}
                        </CardTitle>
                        <CardDescription className="mt-1 text-gray-600">
                            {description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <FeatureList features={features} />
                {subItems && <SubItemList subItems={subItems} />}
            </CardContent>
        </Card>
    );
}
