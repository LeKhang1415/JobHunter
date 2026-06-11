import { useEffect, useState } from "react";

import { getAllUsers, deleteUser } from "@/services/userApi";

import type { UserResponseDto } from "@/types/user.type";

import Pagination from "@/components/custom/Pagination";
import { getErrorMessage } from "@/features/slices/auth/authThunk";

import { UserTable } from "./UserTable";
import UserSearch from "./UserSearch";

const UserManagerPage = () => {
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [searchName, setSearchName] = useState<string>("");
    const [searchEmail, setSearchEmail] = useState<string>("");
    const [selectedGender, setSelectedGender] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);

    // Fetch users
    const fetchUsers = async (
        page: number,
        limit: number,
        name?: string,
        email?: string,
        gender?: string,
    ) => {
        setIsLoading(true);
        try {
            const params = {
                page: Number(page) > 0 ? Number(page) : 1,
                limit: Number(limit) > 0 ? Number(limit) : 5,
                searchName: name?.trim() || undefined,
                searchEmail: email?.trim() || undefined,
                gender: gender || undefined,
            };

            const res = (await getAllUsers(params)).data.result;

            setUsers(res.data);
            setTotalElements(res.meta.totalItems);
            setTotalPages(res.meta.totalPages);
        } catch (err) {
            console.log(
                getErrorMessage(err, "Không thể lấy danh sách người dùng."),
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsers(
                currentPage,
                itemsPerPage,
                searchName,
                searchEmail,
                selectedGender,
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [currentPage, itemsPerPage, searchName, searchEmail, selectedGender]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, searchEmail, selectedGender]);

    const handleReset = () => {
        setSearchName("");
        setSearchEmail("");
        setSelectedGender("");
        setCurrentPage(1);
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await deleteUser(id);
            console.log("Xóa người dùng thành công.");
            handleReset();
            fetchUsers(
                currentPage,
                itemsPerPage,
                searchName,
                searchEmail,
                selectedGender,
            );
        } catch (err) {
            console.log(getErrorMessage(err, "Xóa người dùng thất bại."));
        }
    };

    return (
        <div className="space-y-6">
            <UserSearch
                searchName={searchName}
                setSearchName={setSearchName}
                searchEmail={searchEmail}
                setSearchEmail={setSearchEmail}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                onReset={handleReset}
            />

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Danh sách Người dùng</h2>
            </div>

            <UserTable
                users={users}
                isLoading={isLoading}
                onDelete={handleDeleteUser}
                theme="blue"
            />

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                showItemsPerPageSelect={true}
                theme="blue"
            />
        </div>
    );
};

export default UserManagerPage;
