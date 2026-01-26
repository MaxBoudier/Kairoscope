import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Play, Square, Pause } from 'lucide-react';

const WebSocketRawDebug = () => {
    const [socket, setSocket] = useState(null);
    const [events, setEvents] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showRaw, setShowRaw] = useState(false);
    const scrollRef = useRef(null);

    const wsUrl = `${import.meta.env.VITE_WS_URL}/predict`;

    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [events, autoScroll]);

    const addEvent = (type, data) => {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, -1); // HH:mm:ss.sss
        setEvents(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, timestamp, type, data }]);
    };

    const handleConnect = () => {
        if (socket) return;

        addEvent('system', `Connecting to ${wsUrl}...`);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            setIsConnected(true);
            addEvent('success', 'Connection Established');
        };

        ws.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                addEvent('message', parsed);
            } catch (e) {
                addEvent('message_raw', event.data);
            }
        };

        ws.onerror = (error) => {
            addEvent('error', 'WebSocket Error occurred');
            console.error(error);
        };

        ws.onclose = (event) => {
            setIsConnected(false);
            setSocket(null);
            addEvent('system', `Connection Closed (Code: ${event.code})`);
        };

        setSocket(ws);
    };

    const handleDisconnect = () => {
        if (socket) {
            socket.close();
            setSocket(null);
            setIsConnected(false);
        }
    };

    const clearLogs = () => setEvents([]);

    const getEventColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-500';
            case 'error': return 'text-red-500 font-bold';
            case 'system': return 'text-gray-400';
            case 'message': return 'text-blue-400';
            case 'message_raw': return 'text-purple-400';
            default: return 'text-slate-200';
        }
    };

    return (
        <div className="p-8 space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">WebSocket Debugger</h1>
                    <p className="text-muted-foreground">Monitor real-time streams from {wsUrl}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={isConnected ? "default" : "destructive"} className="text-sm px-3 py-1">
                        {isConnected ? "CONNECTED" : "DISCONNECTED"}
                    </Badge>
                </div>
            </div>

            <Card className="border-slate-800 bg-slate-950 text-slate-200 shadow-2xl">
                <CardHeader className="border-b border-slate-800 bg-slate-900/50 flex flex-row items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                        {!isConnected ? (
                            <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700 font-semibold">
                                <Play size={16} className="mr-2" /> Connect
                            </Button>
                        ) : (
                            <Button onClick={handleDisconnect} variant="destructive" className="font-semibold">
                                <Square size={16} className="mr-2 fill-current" /> Disconnect
                            </Button>
                        )}
                        <Button variant="outline" onClick={clearLogs} className="border-slate-700 hover:bg-slate-800 text-slate-300">
                            <Trash2 size={16} className="mr-2" /> Clear
                        </Button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Switch id="show-raw" checked={showRaw} onCheckedChange={setShowRaw} />
                            <Label htmlFor="show-raw" className="text-slate-300 cursor-pointer">Show Raw JSON</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch id="auto-scroll" checked={autoScroll} onCheckedChange={setAutoScroll} />
                            <Label htmlFor="auto-scroll" className="text-slate-300 cursor-pointer">Auto-scroll</Label>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div
                        ref={scrollRef}
                        className="h-[600px] overflow-y-auto p-4 font-mono text-sm space-y-1 scroll-smooth"
                    >
                        {events.length === 0 && (
                            <div className="text-center text-slate-500 mt-20 italic">
                                Ready to connect. Click the Connect button to start logging.
                            </div>
                        )}

                        {events.map((evt) => (
                            <div key={evt.id} className="border-b border-slate-800/50 pb-1 mb-1 last:border-0 hover:bg-slate-900/50 p-1 rounded">
                                <span className="text-slate-500 mr-3 select-none">[{evt.timestamp}]</span>
                                <span className={`font-bold uppercase text-xs mr-3 w-16 inline-block ${getEventColor(evt.type)}`}>
                                    {evt.type}
                                </span>
                                <span className="text-slate-300 break-all whitespace-pre-wrap">
                                    {evt.type === 'message' || evt.type === 'message_raw' ? (
                                        showRaw ? (
                                            JSON.stringify(evt.data)
                                        ) : (
                                            typeof evt.data === 'object' ? (
                                                <span className="text-blue-300">{JSON.stringify(evt.data, null, 2)}</span>
                                            ) : (
                                                evt.data
                                            )
                                        )
                                    ) : (
                                        evt.data
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WebSocketRawDebug;
