import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Sidebar component displaying notifications.
 */
const NotificationSidebar = ({ notificationsData, onDelete }) => {
    // Ensure notifications is an array
    const notifications = Array.isArray(notificationsData) ? notificationsData : [];

    const formatDate = (dateString) => {
        if (!dateString) return "";
        // Handle DateTime object from Symfony serialization if needed, or string
        const date = new Date(dateString.date || dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short'
        }).format(date);
    };

    return (
        <Card className="col-span-3 border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-indigo-500/20 h-full">
            <CardHeader>
                <CardTitle className="text-card-foreground dark:text-slate-100 flex items-center gap-2">
                    <Bell className="h-5 w-5" /> Notifications
                </CardTitle>
                <CardDescription className="text-muted-foreground dark:text-slate-400">
                    {notifications.length > 0
                        ? `${notifications.length} nouvelles notification(s)`
                        : "Aucune notification"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground dark:text-slate-500 italic">
                            Rien à signaler pour le moment.
                        </p>
                    ) : (
                        notifications.map((notif, index) => (
                            <div key={notif.id || index} className="group flex items-start justify-between gap-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-blue-500">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none text-foreground dark:text-slate-200">
                                            Notification
                                        </p>
                                        <p className="text-xs text-muted-foreground dark:text-slate-400">
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/60 dark:text-slate-600">
                                            {formatDate(notif.dateNotification || notif.date_notification)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onDelete && onDelete(notif.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default NotificationSidebar;
