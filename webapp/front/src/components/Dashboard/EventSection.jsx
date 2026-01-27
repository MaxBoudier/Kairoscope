import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from '@/lib/api';

const EventSection = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/events/upcoming`);
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const navigate = useNavigate();

    return (
        <Card className="w-full border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-indigo-500/20 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-card-foreground dark:text-slate-100 flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" /> Événements à venir
                    </CardTitle>
                    <CardDescription className="text-muted-foreground dark:text-slate-400">
                        {events.length} événement(s) à venir
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                        </div>
                    ) : events.length === 0 ? (
                        <p className="text-sm text-muted-foreground dark:text-slate-500 italic">
                            Aucun événement prévu.
                        </p>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="group flex items-start justify-between gap-4 p-3 rounded-lg border border-border/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
                                        <CalendarDays className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold leading-none text-foreground dark:text-slate-200">
                                            {event.nom}
                                        </h4>
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <span className="capitalize">{formatDate(event.date_event)}</span>
                                                {event.horaire_debut && <span>à {event.horaire_debut}</span>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {event.categorie && <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{event.categorie}</span>}
                                                {event.distance_metres && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {event.distance_metres}m
                                                    </span>
                                                )}
                                                {event.affluence_estimee && <span>(~{event.affluence_estimee} pers.)</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <Button variant="ghost" className="w-full text-xs h-8 hover:bg-transparent hover:text-primary transition-colors" onClick={() => navigate('/events')}>
                        Voir tous les événements →
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default EventSection;
