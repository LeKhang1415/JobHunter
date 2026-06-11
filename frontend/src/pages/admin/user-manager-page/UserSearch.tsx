import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

interface UserSearchProps {
    searchName: string;
    setSearchName: (value: string) => void;
    searchEmail: string;
    setSearchEmail: (value: string) => void;
    selectedGender: string;
    setSelectedGender: (value: string) => void;
    onReset: () => void;
}

function UserSearch({
    searchName,
    setSearchName,
    searchEmail,
    setSearchEmail,
    selectedGender,
    setSelectedGender,
    onReset,
}: UserSearchProps) {
    return (
        <div className="rounded-lg p-4 bg-card border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                    <Label htmlFor="user-name">Tên người dùng:</Label>
                    <Input
                        id="user-name"
                        placeholder="Nhập tên người dùng..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="user-email">Email:</Label>
                    <Input
                        id="user-email"
                        placeholder="Nhập email..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính:</Label>
                    <Select
                        value={selectedGender}
                        onValueChange={setSelectedGender}
                    >
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Làm lại
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default UserSearch;
