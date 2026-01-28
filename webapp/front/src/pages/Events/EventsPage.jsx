import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/events/all`);
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

        fetchAllEvents();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/dashboard')}
                        className="mb-2 pl-0 hover:bg-transparent hover:text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour au tableau de bord
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                        Calendrier des Événements
                    </h1>
                    <p className="text-muted-foreground dark:text-slate-400 mt-1">
                        Historique et prévisions de tous les événements impactant votre activité.
                    </p>
                </div>
            </div>

            <Card className="border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-emerald-500/20">
                <CardHeader>
                    <CardTitle>Liste des événements</CardTitle>
                    <CardDescription>
                        {events.length} événement(s) répertorié(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            Aucun événement trouvé.
                        </div>
                    ) : (
                        <div className="relative overflow-x-auto rounded-lg border border-border">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-900 dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Nom</th>
                                        <th scope="col" className="px-6 py-3">Catégorie</th>
                                        <th scope="col" className="px-6 py-3">Type de Lieu</th>
                                        <th scope="col" className="px-6 py-3 text-center">Affluence Est.</th>
                                        <th scope="col" className="px-6 py-3 text-center">Distance</th>
                                        <th scope="col" className="px-6 py-3 text-center">Horaire</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event.id} className="bg-white dark:bg-slate-950 border-b dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap capitalize">
                                                {formatDate(event.date_event)}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-primary dark:text-emerald-400">
                                                {event.nom}
                                            </td>
                                            <td className="px-6 py-4">
                                                {event.categorie ? (
                                                    <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-emerald-900/30 dark:text-emerald-300">
                                                        {event.categorie}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {event.type_lieu || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {event.affluence_estimee ? (
                                                    <div className="flex items-center justify-center gap-1 text-slate-700 dark:text-slate-300">
                                                        <Users className="h-3 w-3" />
                                                        {event.affluence_estimee}
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {event.distance_metres ? (
                                                    <div className="flex items-center justify-center gap-1 text-slate-700 dark:text-slate-300">
                                                        <MapPin className="h-3 w-3" />
                                                        {event.distance_metres}m
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {event.horaire_debut || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default EventsPage;
