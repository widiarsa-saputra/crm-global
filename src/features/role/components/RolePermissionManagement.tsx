import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BaseTable } from "@/shared/components/table/BaseTable";
import { Controller, useForm } from "react-hook-form";
import { CreateRolePermission, CreateRolePermissionSchema } from "@/services/role-permission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIndexPermission } from "@/services/permission";
import { useCreateRolePermission } from "@/services/role-permission";
import { useFormSubmit } from "@/shared/hooks/useFormSubmit";
import { useNavigate, useParams } from "react-router";
import { ROUTES } from "@/router/routeConfig";
import { useIndexRole } from "@/services/role";
import SectionLoader from "@/shared/components/loader/SectionLoader";
import { SinglePermissionResponse } from "@/services/permission";
import { CheckboxAllToggle } from "@/shared/components/form/CheckboxAllToggle";
import { CheckboxItemList } from "@/shared/components/form/CheckboxItemList";
import { useCheckboxSelectCrossRow } from "@/shared/hooks/useCheckboxSelectCrossRow";

const GroupedPermissions = () => {
    const { data: permissions, isFetching, isSuccess } = useIndexPermission({
        params: {
            sort_by: "created_at",
            sort_order: "desc"
        }
    });

    const groupedPermissions = permissions?.data.reduce((acc: Record<string, { id: string; group: string; permissions: { key: string; display_name: string }[] }>, permission) => {
        const group = permission.group || "Ungrouped";
        if (!acc[group]) {
            acc[group] = { id: group, group, permissions: [] };
        }
        acc[group].permissions.push({
            key: permission.name,
            display_name: permission.display_name,
        });
        return acc;
    }, {});

    return { groupedPermissions, isFetching, isSuccess };
}

const RolePermissionManagement: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams<{ roleId: string }>();

    const { data: role, isSuccess: isRoleSuccess, isError, error } = useIndexRole({
        params: {
            'filter[id]': params.roleId || undefined,
            include: "permissions",
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
            <RolePermissionManagementTable roleName={roleData.name} roleDisplayName={roleData.display_name} initialPermissions={roleData.permissions ?? undefined} />
        );
    }

    return <SectionLoader className="p-6 min-h-[100dvh]" />;
}

type Props = {
    roleName?: string;
    roleDisplayName?: string;
    initialPermissions?: SinglePermissionResponse[];
}

const RolePermissionManagementTable: React.FC<Props> = ({ roleName, roleDisplayName, initialPermissions }) => {
    const navigate = useNavigate();
    const { groupedPermissions, isFetching } = GroupedPermissions();

    const { control, handleSubmit, setError, reset } = useForm<CreateRolePermission>({
        resolver: zodResolver(CreateRolePermissionSchema),
        defaultValues: {
            permissions: [],
            role: roleName
        }
    })

    useEffect(() => {
        if (roleName && roleDisplayName && Array.isArray(initialPermissions)) {
            // Set default permissions if provided
            const initialPermissionKeys = initialPermissions.map(permission => permission.name);
            reset({
                permissions: initialPermissionKeys,
                role: roleName
            });
        }
        // Reset form when roleName or roleDisplayName changes
    }, [roleName, roleDisplayName, initialPermissions]);

    const { mutateAsync, isPending } = useCreateRolePermission();

    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "Role permissions created successfully.",
        errorMessage: "Failed to create role permissions.",
        queryKeyToRefetch: ["role-list"],
        onSuccess: () => {
            navigate(ROUTES.ROLES.path);
        },
    })

    return (
        <div className="p-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <BaseTable<{ id: string; group: string; permissions: { key: string; display_name: string }[] }>
                    data={groupedPermissions ? Object.values(groupedPermissions) : []}
                    columns={[
                        { title: "No", key: "index", render: (_, index) => index + 1, className: "w-12" },
                        { title: "Group", key: "group" },
                        {
                            title: "Select All", key: "selectAll", render: (item) => (
                                <Controller
                                    control={control}
                                    name="permissions"
                                    render={({ field }) => {
                                        const allKeys = item.permissions.map((d: { key: string; display_name: string }) => d.key);
                                        const { allSelected, toggleAll } = useCheckboxSelectCrossRow(field.value || [], allKeys);

                                        return (
                                            <CheckboxAllToggle
                                                allSelected={allSelected}
                                                toggleAll={() => field.onChange(toggleAll())}
                                                label={'Select All'}
                                            />
                                        );
                                    }}
                                />
                            )
                        },
                        {
                            title: "Permissions",
                            key: "permissions",
                            render: (item) => (
                                <div className="flex flex-wrap gap-2">
                                    <Controller
                                        control={control}
                                        name="permissions"
                                        render={({ field }) => {
                                            const toggleItem = (key: string) => {
                                                const newValue = field.value?.includes(key)
                                                    ? field.value.filter((k: string) => k !== key)
                                                    : [...(field.value ?? []), key];
                                                field.onChange(newValue);
                                            };
                                            return (
                                                <CheckboxItemList
                                                    data={item.permissions}
                                                    selectedKeys={field.value ?? []}
                                                    toggleItem={toggleItem}
                                                    keySelector={(item: { key: string; display_name: string }) => item.key}
                                                    labelSelector={(item: { key: string; display_name: string }) => item.display_name}
                                                    className="flex flex-row gap-2"
                                                />
                                            )
                                        }}
                                    />
                                </div>
                            )
                        }
                    ]}
                    isLoading={isFetching}
                    renderHeader={() => (
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Role Permissions</h2>
                            </div>
                            <div className="flex justify-between items-center">
                                <Input placeholder="Role Name" className="w-full mr-2" disabled value={roleDisplayName} />
                                <div className="flex justify-end gap-2">
                                    <Button type="button" onClick={() => navigate(ROUTES.ROLES.path)} variant="outline">Cancel</Button>
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700" type="submit">Save</Button>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </form>
        </div>
    );
}

export default RolePermissionManagement
