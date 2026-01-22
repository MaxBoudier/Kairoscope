import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from 'lucide-react';

const RestaurantDescForm = ({ initialData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: "",
        ville: "",
        adresse: "",
        codePostal: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nom: initialData.nom || "",
                ville: initialData.ville || "",
                adresse: initialData.adresse || "",
                codePostal: initialData.codePostal || "",
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
            const response = await fetch('http://localhost:8081/settings/update', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Could verify with a toast here
                console.log("Description saved");
            } else {
                console.error("Error saving description");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-indigo-500/20">
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
                            <Input
                                id="nom"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-indigo-500/20 dark:focus-visible:ring-violet-500/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ville" className="text-foreground dark:text-slate-200">Ville</Label>
                            <Input
                                id="ville"
                                name="ville"
                                value={formData.ville}
                                onChange={handleChange}
                                className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-indigo-500/20 dark:focus-visible:ring-violet-500/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adresse" className="text-foreground dark:text-slate-200">Adresse</Label>
                            <Input
                                id="adresse"
                                name="adresse"
                                value={formData.adresse}
                                onChange={handleChange}
                                className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-indigo-500/20 dark:focus-visible:ring-violet-500/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="codePostal" className="text-foreground dark:text-slate-200">Code Postal</Label>
                            <Input
                                id="codePostal"
                                name="codePostal"
                                value={formData.codePostal}
                                onChange={handleChange}
                                className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-indigo-500/20 dark:focus-visible:ring-violet-500/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg shadow-md transition-all hover:scale-105 dark:bg-gradient-to-r dark:from-violet-600 dark:to-indigo-600 dark:hover:from-violet-500 dark:hover:to-indigo-500 dark:text-white dark:shadow-violet-500/20"
                        >
                            {isLoading ? "Enregistrement..." : (
                                <span className="flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Enregistrer
                                </span>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default RestaurantDescForm;
