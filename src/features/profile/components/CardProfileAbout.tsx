import { useAuth } from '@/auth/context/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateToLong } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'
import React from 'react'

const CardProfileAbout: React.FC = () => {
    const { user } = useAuth()

    return (
        <Card className="mt-6">
            <CardContent>
                <h3 className="mb-2 text-sm font-medium">Permissions</h3>
                <div className="flex flex-wrap gap-2">
                    {user?.permissions.map((permission) => (
                        <Badge key={permission.id} variant="secondary">
                            {permission.display_name}
                        </Badge>
                    ))}
                </div>

                <div className="mt-4 flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined {formatDateToLong(user?.created_at ?? '')}</span>
                </div>
            </CardContent>
        </Card>
    )
}

export default CardProfileAbout