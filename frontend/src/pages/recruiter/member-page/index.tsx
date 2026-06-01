import { useAppSelector } from "@/features/hooks";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import {
    addMemberToCompany,
    findAllRecruitersBySelfCompany,
    removeMemberFromCompany,
} from "@/services/companyApi";
import type { RecruiterInfoResponseDto } from "@/types/user.type";
import { useCallback, useEffect, useState } from "react";
import MemberInviteFrom from "./MemberInviteFrom";
import MemberTable from "./MemberTable";

function MemberManagePage() {
    const { user } = useAppSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [members, setMembers] = useState<RecruiterInfoResponseDto[]>([]);
    const [isOwner, setIsOwner] = useState<boolean>(false);

    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = (await findAllRecruitersBySelfCompany()).data.result;
            setMembers(res);

            const owner = res.find((m) => m.owner);
            setIsOwner(owner?.email === user?.email);
        } catch (err) {
            console.log(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchMembers();
    }, []);

    console.log(members);

    const addMember = async (email: string) => {
        setIsLoading(true);
        try {
            await addMemberToCompany({ email: email });
            await fetchMembers();
            console.log("Thêm thành viên mới thành công");
        } catch (err) {
            console.log(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsLoading(false);
        }
    };
    const removeMember = async (email: string) => {
        setIsLoading(true);
        try {
            await removeMemberFromCompany({ email: email });
            await fetchMembers();
            console.log("Thêm thành viên mới thành công");
        } catch (err) {
            console.log(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                    Đội ngũ tuyển dụng của công ty bạn
                </h2>
            </div>

            <div className="rounded-lg bg-blue-50/50 px-6 py-4 shadow">
                <MemberInviteFrom onSubmit={addMember} />
                <p className="mt-2 text-sm text-gray-500">
                    Mời thêm thành viên mới vào đội ngũ tuyển dụng.
                </p>
            </div>

            <div>
                <MemberTable
                    isLoading={isLoading}
                    users={members}
                    onDelete={removeMember}
                    isOwner={isOwner}
                />
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-3">
                <span className="font-bold text-purple-700">Lưu ý:</span>
                <span>
                    Chỉ chủ sở hữu quản lý tuyển dụng (OWNER) mới có quyền loại
                    bỏ thành viên khỏi đội ngũ tuyển dụng.
                </span>
            </div>
        </div>
    );
}

export default MemberManagePage;
