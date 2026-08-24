import { useNotifications } from '@/shared/components/notification/context/NotificationContext';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

function NotificationsPage() {
    const { notifications } = useNotifications();

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Semua Notifikasi</h1>
                <Button asChild variant="outline">
                    <Link to="/">Kembali ke Home</Link>
                </Button>
            </div>

            <div className="bg-card border rounded shadow-sm">
                <ScrollArea className="h-[75vh]">
                    <div className="p-4 md:p-6">
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <div key={notif.id}>
                                    <div className="flex flex-col space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(notif.timestamp).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' })}
                                        </p>
                                        <h3 className="font-semibold">{`Event '${notif.type}' di room '${notif.room_id}'`}</h3>
                                        <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-slate-900 p-4 text-white font-mono text-sm">
                                            {JSON.stringify(notif.payload, null, 2)}
                                        </pre>
                                    </div>
                                    {index < notifications.length - 1 && <Separator className="my-4" />}
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-16">
                                <h2 className="text-xl font-semibold">Tidak ada notifikasi</h2>
                                <p className="text-muted-foreground mt-2">Belum ada aktivitas yang tercatat.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

export default NotificationsPage;