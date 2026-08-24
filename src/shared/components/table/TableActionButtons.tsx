import { useAuth } from "@/auth/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, Ban, CheckCircle, StarOff, XCircle } from "lucide-react";

export interface TableActionButtonsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onInactive?: () => void;
    onReactive?: () => void;
    onCancel?: () => void;
    showCancelCondition?: boolean;
    onRemoveFullyFunded?: () => void;
    editPermission?: string | string[];
    editRole?: string | string[];
    deletePermission?: string | string[];
    deleteRole?: string | string[];
    inactivePermission?: string | string[];
    inactiveRole?: string | string[];
    reactivePermission?: string | string[];
    reactiveRole?: string | string[];
    removeFullyFundedPermission?: string | string[];
    removeFullyFundedRole?: string | string[];
    cancelPermission?: string | string[];
    cancelRole?: string | string[];
    className?: string
}

export const TableActionButtons = ({
    onEdit,
    onDelete,
    onInactive,
    onReactive,
    onCancel,
    showCancelCondition = true,
    onRemoveFullyFunded,
    className = 'justify-end',
    editPermission,
    editRole,
    deletePermission,
    deleteRole,
    inactivePermission,
    inactiveRole,
    reactivePermission,
    reactiveRole,
    removeFullyFundedPermission,
    removeFullyFundedRole,
    cancelPermission,
    cancelRole,
}: TableActionButtonsProps) => {
    const { hasPermission, hasRole } = useAuth()

    const hasEditPermission = Array.isArray(editPermission)
        ? editPermission.some(permission => hasPermission(permission))
        : editPermission ? hasPermission(editPermission) : true

    const hasEditRole = Array.isArray(editRole)
        ? editRole.some(role => hasRole(role))
        : editRole ? hasRole(editRole) : true

    const hasEditAccess = hasEditPermission && hasEditRole;

    const hasDeletePermission = Array.isArray(deletePermission)
        ? deletePermission.some(permission => hasPermission(permission))
        : deletePermission ? hasPermission(deletePermission) : true

    const hasDeleteRole = Array.isArray(deleteRole)
        ? deleteRole.some(role => hasRole(role))
        : deleteRole ? hasRole(deleteRole) : true

    const hasDeleteAccess = hasDeletePermission && hasDeleteRole

    const hasInactivePermission = Array.isArray(inactivePermission)
        ? inactivePermission.some(permission => hasPermission(permission))
        : inactivePermission ? hasPermission(inactivePermission) : true

    const hasInactiveRole = Array.isArray(inactiveRole)
        ? inactiveRole.some(role => hasRole(role))
        : inactiveRole ? hasRole(inactiveRole) : true

    const hasInactiveAccess = hasInactivePermission && hasInactiveRole

    const hasReactivePermission = Array.isArray(reactivePermission)
        ? reactivePermission.some(permission => hasPermission(permission))
        : reactivePermission ? hasPermission(reactivePermission) : true

    const hasReactiveRole = Array.isArray(reactiveRole)
        ? reactiveRole.some(role => hasRole(role))
        : reactiveRole ? hasRole(reactiveRole) : true

    const hasReactiveAccess = hasReactivePermission && hasReactiveRole

    const hasRemoveFullyFundedPermission = Array.isArray(removeFullyFundedPermission)
        ? removeFullyFundedPermission.some(permission => hasPermission(permission))
        : removeFullyFundedPermission ? hasPermission(removeFullyFundedPermission) : true

    const hasRemoveFullyFundedRole = Array.isArray(removeFullyFundedRole)
        ? removeFullyFundedRole.some(role => hasRole(role))
        : removeFullyFundedRole ? hasRole(removeFullyFundedRole) : true

    const hasRemoveFullyFundedAccess = hasRemoveFullyFundedPermission && hasRemoveFullyFundedRole

    const hasCancelPermission = Array.isArray(cancelPermission)
        ? cancelPermission.some(permission => hasPermission(permission))
        : cancelPermission ? hasPermission(cancelPermission) : true;

    const hasCancelRole = Array.isArray(cancelRole)
        ? cancelRole.some(role => hasRole(role))
        : cancelRole ? hasRole(cancelRole) : true;

    const hasCancelAccess = hasCancelPermission && hasCancelRole;

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {onCancel && showCancelCondition && hasCancelAccess && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 focus:ring-rose-600"
                    onClick={onCancel}
                    title="Batalkan"
                >
                    <XCircle className="h-4 w-4" />
                </Button>
            )}

            {onEdit && hasEditAccess && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onEdit}
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:ring-blue-600"
                    title="Edit"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            )}
            {onInactive && hasInactiveAccess && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50 focus:ring-orange-600"
                    onClick={onInactive}
                    title="Nonaktifkan"
                >
                    <Ban className="h-4 w-4" />
                </Button>
            )}

            {onReactive && hasReactiveAccess && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-600"
                    onClick={onReactive}
                    title="Aktifkan"
                >
                    <CheckCircle className="h-4 w-4" />
                </Button>
            )}

            {onRemoveFullyFunded && hasRemoveFullyFundedAccess && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 focus:ring-amber-500"
                    onClick={onRemoveFullyFunded}
                    title="Batalkan Fully Funded"
                >
                    <StarOff className="h-4 w-4" />
                </Button>
            )}

            {onDelete && hasDeleteAccess && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-600"
                    onClick={onDelete}
                    title="Hapus"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};
