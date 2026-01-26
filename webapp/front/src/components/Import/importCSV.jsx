import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { fetchWithAuth } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

const ImportCSV = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleImport = async () => {
        if (!file) {
            setMessage({ type: 'error', text: 'Veuillez sélectionner un fichier.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/import/historical-affluence`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setMessage({ type: 'success', text: data.message || 'Import réussi avec succès !' });
                setFile(null);
                // Reset file input
                document.getElementById('csv_file').value = '';
            } else {
                const errorData = await response.json();
                setMessage({ type: 'error', text: errorData.message || "Erreur lors de l'import." });
            }
        } catch (error) {
            console.error("Import error:", error);
            setMessage({ type: 'error', text: "Erreur de connexion au serveur." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Importer des données</CardTitle>
                <CardDescription>
                    Sélectionnez un fichier CSV pour importer l'historique d'affluence.
                    Assurez-vous que les colonnes correspondent aux données attendues (date_historique, affluence, etc.).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="csv_file">Fichier CSV</Label>
                    <Input id="csv_file" type="file" accept=".csv" onChange={handleFileChange} />
                </div>

                {message && (
                    <Alert variant={message.type === 'error' ? "destructive" : "default"} className={message.type === 'success' ? "border-green-500 text-green-500" : ""}>
                        {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertTitle>{message.type === 'success' ? "Succès" : "Erreur"}</AlertTitle>
                        <AlertDescription>
                            {message.text}
                        </AlertDescription>
                    </Alert>
                )}

                <Button onClick={handleImport} disabled={isLoading || !file}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Importer
                </Button>
            </CardContent>
        </Card>
    );
};

export default ImportCSV;
