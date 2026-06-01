import { type LucideIcon } from "lucide-react";

interface SubItem {
    name: string;
    icon: LucideIcon;
    description: string;
}

interface Props {
    subItems: SubItem[];
}

export default function SubItemList({ subItems }: Props) {
    return (
        <div className="space-y-2 border-t border-gray-200 pt-2">
            <h4 className="text-sm font-medium text-gray-800">
                Chức năng con:
            </h4>

            <div className="grid grid-cols-1 gap-2">
                {subItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 rounded-md bg-white p-2"
                    >
                        <item.icon className="h-4 w-4 text-gray-600" />
                        <div>
                            <div className="text-sm font-medium text-gray-800">
                                {item.name}
                            </div>
                            <div className="text-xs text-gray-600">
                                {item.description}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
