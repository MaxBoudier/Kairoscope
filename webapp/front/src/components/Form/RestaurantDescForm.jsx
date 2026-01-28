import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Save } from 'lucide-react';

const RestaurantDescForm = ({ initialData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: "",
        ville: "",
        adresse: "",
        codePostal: "",
        typeRestaurant: "",
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nom: initialData.nom || "",
                ville: initialData.ville || "",
                adresse: initialData.adresse || "",
                codePostal: initialData.codePostal || "",
                typeRestaurant: initialData.typeRestaurant || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/settings/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({ type: 'success', message: 'Description enregistrée avec succès !' });
            } else {
                const errorData = await response.json().catch(() => ({}));
                setStatus({ type: 'error', message: errorData.message || 'Erreur lors de l\'enregistrement (' + response.status + ')' });
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Erreur de connexion.' });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl text-card-foreground dark:text-slate-100">Informations Générales</CardTitle>
                    <CardDescription className="text-muted-foreground dark:text-slate-400">
                        Modifiez les informations principales de votre établissement.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nom" className="text-foreground dark:text-slate-200">Nom du Restaurant</Label>
                            {!initialData ? (
                                <Skeleton className="w-full h-10 rounded-md" />
                            ) : (
                                <Input
                                    id="nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ville" className="text-foreground dark:text-slate-200">Ville</Label>
                            {!initialData ? (
                                <Skeleton className="w-full h-10 rounded-md" />
                            ) : (
                                <Input
                                    id="ville"
                                    name="ville"
                                    value={formData.ville}
                                    onChange={handleChange}
                                    className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adresse" className="text-foreground dark:text-slate-200">Adresse</Label>
                            {!initialData ? (
                                <Skeleton className="w-full h-10 rounded-md" />
                            ) : (
                                <Input
                                    id="adresse"
                                    name="adresse"
                                    value={formData.adresse}
                                    onChange={handleChange}
                                    className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="codePostal" className="text-foreground dark:text-slate-200">Code Postal</Label>
                            {!initialData ? (
                                <Skeleton className="w-full h-10 rounded-md" />
                            ) : (
                                <Input
                                    id="codePostal"
                                    name="codePostal"
                                    value={formData.codePostal}
                                    onChange={handleChange}
                                    className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="typeRestaurant" className="text-foreground dark:text-slate-200">Type de Cuisine</Label>
                            {!initialData ? (
                                <Skeleton className="w-full h-10 rounded-md" />
                            ) : (
                                <Input
                                    id="typeRestaurant"
                                    name="typeRestaurant"
                                    value={formData.typeRestaurant}
                                    onChange={handleChange}
                                    placeholder="ex: Italien, Fast Food, Gastronomique..."
                                    className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-primary/20 dark:focus-visible:ring-primary/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || !initialData}
                            className="bg-linear-to-r from-emerald-400 to-lime-400 hover:brightness-110 text-white dark:text-slate-900 font-bold py-2 px-6 rounded-lg shadow-md transition-all hover:scale-105 dark:from-[#7fffd4] dark:to-[#e8ff6a] dark:shadow-emerald-400/20"
                        >
                            {isLoading ? "Enregistrement..." : (
                                <span className="flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Enregistrer
                                </span>
                            )}
                        </Button>
                    </div>
                    {status.message && (
                        <div className={`mt-4 p-4 rounded-md text-sm font-medium ${status.type === 'success'
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-900'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900'
                            }`}>
                            {status.message}
                        </div>
                    )}
                </CardContent>
            </Card>
        </form>
    );
};

export default RestaurantDescForm;
