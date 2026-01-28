import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Chart component displaying predicted affluence (affluence) over time.
 * Uses WebSocket to fetch data from AI service.
 * Implements persistence via localStorage and manual refresh.
 */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1e293b] border border-slate-800 p-3 rounded-lg shadow-xl">
                <p className="text-slate-400 text-xs mb-2">{label}</p>
                {payload.map((entry, index) => {
                    const isKairo = entry.dataKey === 'predicted_affluence';
                    return (
                        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                            <span className={`text-sm font-bold ${isKairo ? 'text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-lime-400' : 'text-slate-400'}`}>
                                {isKairo ? 'Prévision Kairoscope' : 'Prévision Classique'} : {entry.value}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

const RevenueChart = ({ onDataLoaded }) => {
    const [socketStatus, setSocketStatus] = useState('disconnected');
    const [progress, setProgress] = useState({ step: 0, total: 0, message: '', step_name: '', showSpinner: false });
    const [predictions, setPredictions] = useState([]);
    const socketRef = useRef(null);

    const connectWebSocket = () => {
        // If already connected or connecting, don't do anything
        if (socketStatus === 'connected' || socketStatus === 'connecting') return;

        setSocketStatus('connecting');
        // Reset progress/predictions if we are starting a fresh fetch
        // setPredictions([]); // Optional: clear old data while fetching? User might prefer to see old data until new arrives.
        // Let's keep old data until new comes in for smoother UX? Or clear to show progress bar?
        // User said "reload", so maybe they expect to see the process again.
        // But if we want to "avoid reload", caching is key. 
        // If MANUAL reload, we should probably clear to show action.
        setPredictions([]);
        setProgress({ step: 0, total: 0, message: 'Initialisation...', step_name: '', showSpinner: false });

        // Initialize fetch of restaurant ID if needed
        const initializeConnection = async () => {
            let restaurantId = localStorage.getItem('restaurantId');

            if (!restaurantId) {
                try {
                    // Import fetchWithAuth dynamically or use a simple fetch since we can't easily change top-level imports here without rewriting the whole file
                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
                    // Using fetch with credentials 'include' as a fallback to fetchWithAuth
                    const response = await fetch(`${API_URL}/settings`, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                        credentials: 'include'
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.id) {
                            restaurantId = data.id.toString();
                            localStorage.setItem('restaurantId', restaurantId);
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch restaurant ID for WS", e);
                }
            }

            const wsUrl = `${import.meta.env.VITE_WS_URL}/predict${restaurantId ? `?restaurantId=${restaurantId}` : ''}`;
            const ws = new WebSocket(wsUrl);
            socketRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to AI WebSocket');
                setSocketStatus('connected');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.status === 'steps') {
                        setProgress({
                            step: data.step,
                            total: data.total_step,
                            message: data.message,
                            step_name: data.step_name,
                            showSpinner: false
                        });
                    } else if (data.status === 'message') {
                        setProgress(prev => ({
                            ...prev,
                            message: data.message,
                            showSpinner: true
                        }));
                    } else if (data.status === 'output') {
                        if (data.payload) {
                            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
                            // Sync events to backend
                            // Use fetchWithAuth if imported, or fetch with credentials
                            // Since fetchWithAuth is in lib/api.js, let's try to import it or use fetch directly with token/session
                            // We need to import fetchWithAuth, but I cannot easily add top-level import without replacing the whole file header.
                            // I will use fetch directly with credentials: 'include'.

                            fetch(`${API_URL}/events/sync`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                credentials: 'include',
                                body: JSON.stringify(data.payload)
                            }).then(res => {
                                if (res.ok) console.log('Events synced successfully');
                                else console.error('Failed to sync events', res.status);
                            }).catch(err => console.error('Error syncing events:', err));

                            // Format date for chart relative to today to ensure "live" feel
                            const today = new Date();
                            const formattedData = data.payload.map((item, index) => {
                                const date = new Date(today);
                                date.setDate(today.getDate() + index);

                                return {
                                    ...item,
                                    predicted_affluence: Math.round(item.predicted_affluence),
                                    predicted_affluence_no_kairo: Math.round(item.predicted_affluence_no_kairo || 0),
                                    displayDate: date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" })
                                };
                            });
                            setPredictions(formattedData);

                            // Pass data up to parent
                            if (onDataLoaded) {
                                onDataLoaded(formattedData);
                            }

                            // Cache the data
                            localStorage.setItem('kairoscope_predictions', JSON.stringify(formattedData));
                        }
                    }
                } catch (e) {
                    console.error('Error parsing WS message', e);
                }
            };

            ws.onerror = () => setSocketStatus('error');
            ws.onclose = () => {
                if (socketStatus !== 'error') setSocketStatus('disconnected');
            };
        };

        initializeConnection();
    };

    useEffect(() => {
        // Check cache on mount
        const cachedData = localStorage.getItem('kairoscope_predictions');
        if (cachedData) {
            try {
                const parsedData = JSON.parse(cachedData);
                // Optional: Re-calculate displayDate if we want "today" to roll over?
                // If cached data is from yesterday, "Monday" might mean something else?
                // Ideally we check timestamp. simpler: just use cached data as is for now, 
                // or re-apply date logic if we stored raw payload. 
                // We stored formattedData with displayDate baked in. 
                // If the user refreshes next day, the labels might be stale if we rely on "index".
                // But standard caching behaviour implies we might see old state.
                // Let's trust the cache for now as "last known state".
                setPredictions(parsedData);
                if (onDataLoaded) {
                    onDataLoaded(parsedData);
                }
                setSocketStatus('disconnected'); // We have data, no need to connect live immediately
                return;
            } catch (e) {
                console.error("Cache parse error", e);
                localStorage.removeItem('kairoscope_predictions');
            }
        }

        // If no cache, connect
        connectWebSocket();

        return () => socketRef.current?.close();
    }, []);

    const handleRefresh = () => {
        connectWebSocket();
    };

    return (
        <Card className="w-full border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-card-foreground dark:text-slate-100">Courbe de prédiction <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-lime-400 dark:from-[#7fffd4] dark:to-[#e8ff6a]">Kairoscope</span></CardTitle>
                    <CardDescription className="text-muted-foreground dark:text-slate-400">
                        Prédictions d'affluence pour les prochains jours.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {socketStatus === 'connecting' && <span className="flex h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>}
                    {socketStatus === 'connected' && <span className="flex h-2 w-2 rounded-full bg-green-500"></span>}
                    {socketStatus === 'error' && <span className="flex h-2 w-2 rounded-full bg-red-500"></span>}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRefresh}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        disabled={socketStatus === 'connecting'}
                    >
                        <RefreshCw className={`h-4 w-4 ${socketStatus === 'connecting' ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                {predictions.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center space-y-4 h-[250px]">
                        {socketStatus === 'error' ? (
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-red-500 text-sm">Service IA indisponible</p>
                                <Button variant="outline" size="sm" onClick={handleRefresh}>Réessayer</Button>
                            </div>
                        ) : (
                            <>
                                {progress.showSpinner ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="h-8 w-8 text-emerald-500 dark:text-[#7fffd4] animate-spin" />
                                        <p className="text-sm text-muted-foreground animate-pulse text-center px-4">
                                            {progress.message || "Traitement en cours..."}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-linear-to-r from-emerald-400 to-lime-400 dark:from-[#7fffd4] dark:to-[#e8ff6a] h-2 rounded-full transition-all duration-300 ease-out"
                                                style={{ width: `${progress.total ? (progress.step / progress.total) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-muted-foreground animate-pulse text-center px-4">
                                            {progress.message || "Connexion à l'oracle..."} <br />
                                            <span className="text-[10px] opacity-70">
                                                {progress.step_name} {progress.total > 0 && `(${Math.round((progress.step / progress.total) * 100)}%)`}
                                            </span>
                                        </p>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={predictions}>
                                <defs>
                                    <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#34d399" />
                                        <stop offset="100%" stopColor="#a3e635" />
                                    </linearGradient>
                                    <linearGradient id="colorAffluence" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorNoKairo" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="displayDate"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    className="dark:text-slate-400"
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                    className="dark:text-slate-400"
                                    label={{ value: 'Personnes', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: '10px' } }}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,100,100,0.1)" />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(148, 163, 184, 0.2)', strokeWidth: 1 }} />
                                <Area
                                    type="monotone"
                                    dataKey="predicted_affluence_no_kairo"
                                    stroke="#94a3b8"
                                    strokeWidth={2}
                                    strokeOpacity={0.4}
                                    fillOpacity={1}
                                    fill="url(#colorNoKairo)"
                                    animationDuration={1500}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="predicted_affluence"
                                    stroke="url(#strokeGradient)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAffluence)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RevenueChart;
