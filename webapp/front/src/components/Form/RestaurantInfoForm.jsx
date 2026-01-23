import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from 'lucide-react';

const RestaurantInfoForm = ({ initialData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        maxNbCouvert: 0,
        isTerrasse: false
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (initialData) {
            setFormData({
                maxNbCouvert: initialData.maxNbCouvert || 0,
                isTerrasse: initialData.isTerrasse || false,
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

    const handleSwitchChange = (checked) => {
        setFormData(prev => ({
            ...prev,
            isTerrasse: checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetchWithAuth('http://localhost:8081/settings/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus({ type: 'success', message: 'Informations enregistrées avec succès !' });
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
            <Card className="border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-indigo-500/20">
                <CardHeader>
                    <CardTitle className="text-2xl text-card-foreground dark:text-slate-100">Capacité et Options</CardTitle>
                    <CardDescription className="text-muted-foreground dark:text-slate-400">
                        Configurez la capacité d'accueil et les espaces disponibles.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2 max-w-xs">
                        <Label htmlFor="maxNbCouvert" className="text-foreground dark:text-slate-200">Nombre maximum de couverts</Label>
                        <Input
                            id="maxNbCouvert"
                            name="maxNbCouvert"
                            type="number"
                            value={formData.maxNbCouvert}
                            onChange={handleChange}
                            className="bg-background border-input focus-visible:ring-ring text-foreground placeholder:text-muted-foreground dark:bg-slate-900/50 dark:border-indigo-500/20 dark:focus-visible:ring-violet-500/50 dark:text-slate-100 dark:placeholder:text-slate-600"
                        />
                    </div>

                    <Separator className="bg-border dark:bg-indigo-500/20" />

                    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 dark:border-indigo-500/20 dark:bg-slate-900/30">
                        <div className="space-y-0.5">
                            <Label className="text-base text-foreground dark:text-slate-200">Terrasse</Label>
                            <p className="text-sm text-muted-foreground dark:text-slate-400">
                                Activez si votre établissement dispose d'une terrasse.
                            </p>
                        </div>
                        <Switch
                            checked={formData.isTerrasse}
                            onCheckedChange={handleSwitchChange}
                            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=checked]:bg-violet-600 dark:data-[state=unchecked]:bg-slate-700"
                        />
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
                {status.message && (
                    <div className={`p-4 rounded-b-lg border-t text-sm font-medium ${status.type === 'success'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900'
                        }`}>
                        {status.message}
                    </div>
                )}
            </Card>
        </form>
    );
};

export default RestaurantInfoForm;
