import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader2, Server } from "lucide-react";

/**
 * Composant de debug pour vérifier la connexion avec le backend
 */
const BackendStatus = () => {
    const [status, setStatus] = useState('checking'); // checking, connected, error
    const [responseTime, setResponseTime] = useState(null);
    const [message, setMessage] = useState('');
    const [envInfo, setEnvInfo] = useState({
        apiUrl: import.meta.env.VITE_API_URL,
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
        wsUrl: import.meta.env.VITE_WS_URL
    });

    const checkConnection = async () => {
        setStatus('checking');
        const start = performance.now();

        try {
            // On essaie de joindre la racine de l'API qui est publique
            // Utilise VITE_API_BASE_URL car la route '/' est à la racine, pas sous /api
            const url = `${import.meta.env.VITE_API_BASE_URL}/`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // timeout de 5 secondes pour ne pas attendre indéfiniment
                signal: AbortSignal.timeout(5000)
            });

            const end = performance.now();
            setResponseTime(Math.round(end - start));

            if (response.ok) {
                const data = await response.json();
                setStatus('connected');
                setMessage(data.message || 'OK');
            } else {
                setStatus('error');
                setMessage(`Erreur HTTP: ${response.status}`);
            }
        } catch (error) {
            const end = performance.now();
            setResponseTime(Math.round(end - start));
            setStatus('error');
            setMessage(error.message || 'Erreur de connexion');
        }
    };

    useEffect(() => {
        checkConnection();
    }, []);

    return (
        <div className="my-8 p-6 mx-auto max-w-4xl bg-card border border-border rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <Server className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Diagnostic Connexion Backend</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section État */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">État du service</span>
                        {status === 'checking' && (
                            <Badge variant="outline" className="gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-200">
                                <Loader2 className="w-3 h-3 animate-spin" /> Vérification...
                            </Badge>
                        )}
                        {status === 'connected' && (
                            <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-600 border-green-200">
                                <CheckCircle className="w-3 h-3" /> Connecté
                            </Badge>
                        )}
                        {status === 'error' && (
                            <Badge variant="destructive" className="gap-1">
                                <AlertCircle className="w-3 h-3" /> Erreur
                            </Badge>
                        )}
                    </div>

                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Temps de réponse:</span>
                            <span className="font-mono">{responseTime ? `${responseTime}ms` : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Message API:</span>
                            <span className="font-mono truncate max-w-[200px]" title={message}>{message || '-'}</span>
                        </div>
                    </div>

                    <button
                        onClick={checkConnection}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                        <Loader2 className={`w-3 h-3 ${status === 'checking' ? 'animate-spin' : ''}`} />
                        Réessayer maintenant
                    </button>
                </div>

                {/* Section Configuration */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h4 className="text-sm font-medium mb-2">Configuration actuelle (.env)</h4>
                    <div className="space-y-2">
                        <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                            <span className="text-muted-foreground font-mono">API_Base:</span>
                            <code className="bg-background px-1 py-0.5 rounded border truncate" title={envInfo.apiBaseUrl}>
                                {envInfo.apiBaseUrl}
                            </code>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                            <span className="text-muted-foreground font-mono">API_URL:</span>
                            <code className="bg-background px-1 py-0.5 rounded border truncate" title={envInfo.apiUrl}>
                                {envInfo.apiUrl}
                            </code>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                            <span className="text-muted-foreground font-mono">WS_URL:</span>
                            <code className="bg-background px-1 py-0.5 rounded border truncate" title={envInfo.wsUrl}>
                                {envInfo.wsUrl}
                            </code>
                        </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground italic mt-2">
                        Note: Ces URLs doivent être accessibles depuis le navigateur de vos utilisateurs.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BackendStatus;
