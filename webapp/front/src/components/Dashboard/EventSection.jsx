import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EventSection = ({ events = [] }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Filter to show only future events
    const now = new Date();
    const futureEvents = events.filter(event => {
        // Construct event date object
        // Event has 'date' (from prediction payload) or 'date_event' (from API)
        const dateStr = event.date || event.date_event;
        if (!dateStr) return false;

        const eventDate = new Date(dateStr);

        // If there's a time, add it
        if (event.horaire_debut) {
            const [hours, minutes] = event.horaire_debut.split(':');
            eventDate.setHours(parseInt(hours), parseInt(minutes));
        } else {
            // If no time, assume end of day or just check date? 
            // Let's assume valid if date is today or future.
            // Check if date is strictly before today (ignoring time)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (new Date(dateStr) < today) return false;
            return true;
        }

        return eventDate > now;
    });

    const displayedEvents = futureEvents.slice(0, 10); // Show more since it's scrollable

    return (
        <Card className="w-full border-border bg-card shadow-md dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-indigo-500/20">
            <CardHeader className="py-3 px-4 border-b border-border dark:border-indigo-500/20 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium text-card-foreground dark:text-slate-100 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" /> Événements à venir
                    </CardTitle>
                    <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {futureEvents.length}
                    </span>
                </div>
                {futureEvents.length > 0 && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => navigate('/events')}>
                        Voir tout <ArrowRight className="h-3 w-3" />
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-4">
                {displayedEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-24 text-center">
                        <p className="text-xs text-muted-foreground dark:text-slate-500 italic">
                            Aucun événement prévu.
                        </p>
                    </div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/50">
                        {displayedEvents.map((event, index) => (
                            <div key={index} className="flex-shrink-0 w-[280px] p-3 rounded-lg border border-border/50 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-primary dark:text-indigo-400 bg-primary/10 px-2 py-0.5 rounded">
                                        {event.horaire_debut || "--:--"}
                                    </span>
                                    {event.categorie && (
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 rounded">
                                            {event.categorie}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-sm font-semibold leading-tight text-foreground dark:text-slate-200 mb-1 truncate" title={event.nom}>
                                    {event.nom}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground dark:text-slate-400">
                                    <span>{formatDate(event.date || event.date_event)}</span>
                                    {event.affluence_estimee_personnes && <span>• ~{event.affluence_estimee_personnes} pers.</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EventSection;
