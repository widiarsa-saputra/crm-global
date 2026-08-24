import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useParams } from "react-router";
import { BaseTable } from "@/shared/components/table/BaseTable";
import useIndexUser from "@/services/user";
import { Controller, useForm } from "react-hook-form";
import { ROUTES } from "@/router/AppRouter";
import PaginationWithShow from "@/shared/components/pagination/PaginationWithShow";
import useIndexRole from "@/services/role";
import SectionLoader from "@/shared/components/loader/SectionLoader";
import useCreateUserRole from "@/services/user-role";
import { useFormSubmit } from "@/shared/hooks/useFormSubmit";
import { CreateUserRole } from "@/services/user-role";

const RoleUserManagement: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams<{ roleId: string }>();

    const { data: role, isSuccess: isRoleSuccess, isError, error } = useIndexRole({
        params: {
            'filter[id]': params.roleId || undefined,
            include: "users",
        }
    });

    if (isError && (error as any)?.response?.status === 404) {
        return (
            <div className="p-6">
                <h2 className="text-lg font-semibold">Role not found</h2>
                <p className="text-gray-500">The role you are looking for does not exist.</p>
                <Button onClick={() => navigate(ROUTES.ROLES.path)} className="mt-4 bg-blue-500">
                    Go back to Roles
                </Button>
            </div>
        );
    }

    if (isRoleSuccess && role) {
        const roleData = Array.isArray(role.data)
            ? role.data.find(r => String(r.id) === String(params.roleId))
            : role.data;

        if (!roleData) {
            // Jika data kosong, bisa return fallback atau null
            return <div>Role data not found</div>;
        }

        return (
            <RoleUserManagementTable roleId={roleData.id} roleName={roleData.name} roleDisplayName={roleData.display_name} initialUserIds={roleData.users?.map((u: any) => u.id) || []} />
        );
    }

    return <SectionLoader className="p-6 min-h-[100dvh]" />;
}

export default RoleUserManagement

type RoleUserManagementTableProps = {
    roleId: number;
    roleName: string;
    roleDisplayName: string;
    initialUserIds: string[];
}

const RoleUserManagementTable: React.FC<RoleUserManagementTableProps> = ({ roleName, roleDisplayName, initialUserIds }) => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: users, isSuccess } = useIndexUser({
        params: {
            search: search,
            paginate: entriesPerPage,
            page: currentPage,
            include: "roles",
        }
    })

    const { handleSubmit, reset, control, setError } = useForm<CreateUserRole>({
        defaultValues: {
            user_ids: initialUserIds,
            role: roleName
        }
    });

    // Initialize/Reset form when initial data changes (e.g. on mount or role change)
    useEffect(() => {
        if (roleName && initialUserIds) {
            reset({
                user_ids: initialUserIds,
                role: roleName
            });
        }
    }, [roleName, initialUserIds]);

    const { mutateAsync, isPending } = useCreateUserRole()

    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "Users assigned to role successfully.",
        errorMessage: "Failed to assign users to role.",
        queryKeyToRefetch: ["role-list"],
        onSuccess: () => {
            navigate(ROUTES.ROLES.path);
        },
    })

    return (
        <main className="p-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <BaseTable
                    data={users?.data || []}
                    columns={[
                        { title: "No", key: "index", render: (_, index) => index + 1, className: "w-12" },
                        {
                            title: "Select",
                            key: "select",
                            render: (item) => (
                                <Controller
                                    control={control}
                                    name="user_ids"
                                    render={({ field }) => {
                                        const isChecked = field.value?.includes(item.id);
                                        return (
                                            <Checkbox
                                                id={`checkbox-${item.id}`}
                                                aria-label={`Select ${item.name}`}
                                                checked={isChecked}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        field.onChange([...field.value, item.id]);
                                                    } else {
                                                        field.onChange(field.value.filter((id: string | number) => id !== item.id));
                                                    }
                                                }}
                                            />
                                        );
                                    }}
                                />
                            ),
                            className: "w-16 text-center",
                        },
                        { title: "Users", key: "name", render: (item) => item.name },
                    ]}
                    renderHeader={() => (
                        <div className="flex flex-col gap-4 w-full">
                            {/* Search Input */}
                            <Input
                                placeholder="Search name..."
                                className="w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                                {/* Disabled Role Name Input */}
                                <span className="w-full block px-3 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed">
                                    {roleDisplayName}
                                </span>

                                {/* Buttons */}
                                <div className="flex justify-end gap-2 w-full sm:w-auto">
                                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate(ROUTES.ROLES.path)}>Cancel</Button>
                                    <Button
                                        className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </form>
            {isSuccess && users.pagination && (
                (
                    <PaginationWithShow
                        totalItems={users.pagination.total}
                        itemsPerPage={entriesPerPage}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onItemsPerPageChange={(items) => setEntriesPerPage(items)}
                    />
                )
            )}
        </main>
    );
}