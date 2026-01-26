import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LockKeyhole, ArrowLeft } from "lucide-react";
import { fetchWithAuth } from '@/lib/api';

const PinProtection = () => {
    const [singlePin, setSinglePin] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePinChange = (e) => {
        setSinglePin(e.target.value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/settings/verify-pin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pin: singlePin })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    navigate('/settings');
                } else {
                    setError("Code PIN incorrect");
                }
            } else {
                if (response.status === 403) {
                    setError("Code PIN incorrect");
                } else {
                    setError("Erreur de vérification. Veuillez réessayer.");
                }
            }
        } catch (err) {
            console.error("PIN verification error", err);
            setError("Erreur de vérification. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background">
            <Card className="w-full max-w-md shadow-lg border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-primary/10">
                            <LockKeyhole className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Accès restreint</CardTitle>
                    <CardDescription>
                        Veuillez entrer votre code PIN pour accéder aux paramètres du restaurant.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pin" className="sr-only">Code PIN</Label>
                            <Input
                                id="pin"
                                type="password"
                                inputMode="numeric"
                                placeholder="Code PIN"
                                value={singlePin}
                                onChange={handlePinChange}
                                className="text-center text-lg tracking-widest"
                                autoFocus
                            />
                            {error && (
                                <p className="text-sm font-medium text-destructive text-center animate-in fade-in slide-in-from-top-1">
                                    {error}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={!singlePin || isLoading}
                        >
                            {isLoading ? "Vérification..." : "Valider"}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => navigate('/dashboard')}
                            type="button"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour au tableau de bord
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default PinProtection;
