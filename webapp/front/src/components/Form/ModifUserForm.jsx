import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from 'lucide-react';

const ModifUserForm = ({ initialData }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        pseudo: '',
        nom_gerant: '',
        prenom_gerant: '',
        code_settings: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [requestError, setRequestError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (initialData) {
            setCredentials(prev => ({
                ...prev,
                email: initialData.email || '',
                pseudo: initialData.pseudo || '',
                nom_gerant: initialData.lastname || '',
                prenom_gerant: initialData.firstname || '',
                code_settings: initialData.code_settings || '',
            }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'code_settings') {
            const numericValue = value.replace(/\D/g, '').slice(0, 4);
            setCredentials({ ...credentials, [name]: numericValue });
        } else {
            setCredentials({ ...credentials, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setRequestError(null);
        setSuccessMessage(null);

        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/user/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                setSuccessMessage("Profil mis à jour avec succès !");
                setCredentials(prev => ({ ...prev, password: '' }));
            } else {
                const data = await response.json();
                setRequestError(data.error || "Erreur lors de la mise à jour.");
            }
        } catch (error) {
            setRequestError("Impossible de contacter le serveur.");
        } finally {
            setIsLoading(false);
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl text-card-foreground dark:text-slate-100">Modifier mon profil</CardTitle>
                    <CardDescription className="text-muted-foreground dark:text-slate-400">
                        Mettez à jour vos informations personnelles
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pseudo" className="text-foreground dark:text-slate-200">Pseudo</Label>
                            {!initialData ? (
                                <Skeleton className="w-full h-10 rounded-md" />
                            ) : (
                                <Input
                                    id="pseudo"
                                    name="pseudo"
                                    value={credentials.pseudo}
                                    onChange={handleChange}
                                    className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code_settings" className="text-foreground dark:text-slate-200">Code PIN (Settings)</Label>
                            {!initialData ? (
                                <Skeleton className="w-full h-10 rounded-md" />
                            ) : (
                                <Input
                                    id="code_settings"
                                    name="code_settings"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="••••"
                                    value={credentials.code_settings}
                                    onChange={handleChange}
                                    className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nom_gerant" className="text-foreground dark:text-slate-200">Nom du gérant</Label>
                            {!initialData ? (
                                <Skeleton className="w-full h-10 rounded-md" />
                            ) : (
                                <Input
                                    id="nom_gerant"
                                    name="nom_gerant"
                                    value={credentials.nom_gerant}
                                    onChange={handleChange}
                                    required
                                    className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prenom_gerant" className="text-foreground dark:text-slate-200">Prénom du gérant</Label>
                            {!initialData ? (
                                <Skeleton className="w-full h-10 rounded-md" />
                            ) : (
                                <Input
                                    id="prenom_gerant"
                                    name="prenom_gerant"
                                    value={credentials.prenom_gerant}
                                    onChange={handleChange}
                                    required
                                    className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground dark:text-slate-200">Email administrateur</Label>
                        {!initialData ? (
                            <Skeleton className="w-full h-10 rounded-md" />
                        ) : (
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                                className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                            />
                        )}
                    </div>

                    <div className="space-y-2 border-t pt-4 border-border dark:border-primary/20">
                        <Label htmlFor="password" className="text-foreground dark:text-slate-200">Nouveau mot de passe</Label>
                        {!initialData ? (
                            <Skeleton className="w-full h-10 rounded-md" />
                        ) : (
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Laisser vide pour ne pas changer"
                                value={credentials.password}
                                onChange={handleChange}
                                className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                            />
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !initialData}
                            className="bg-linear-to-r from-emerald-400 to-lime-400 hover:brightness-110 text-white dark:text-slate-900 font-bold py-2 px-6 rounded-lg shadow-md transition-all hover:scale-105 dark:from-[#7fffd4] dark:to-[#e8ff6a] dark:shadow-emerald-400/20"
                        >
                            {isLoading ? "Mise à jour..." : (
                                <span className="flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Sauvegarder
                                </span>
                            )}
                        </Button>
                    </div>
                </CardContent>
                {(successMessage || requestError) && (
                    <div className={`p-4 rounded-b-lg border-t text-sm font-medium ${successMessage
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900'
                        }`}>
                        {successMessage || requestError}
                    </div>
                )}
            </Card>
        </form>
    );
};
export default ModifUserForm;
