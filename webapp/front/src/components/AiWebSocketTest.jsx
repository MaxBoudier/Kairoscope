import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const AiWebSocketTest = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('disconnected');
    const bottomRef = useRef(null);

    const connect = () => {
        if (socket) return;

        const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/predict`);

        ws.onopen = () => {
            console.log('Connected to AI WebSocket');
            setStatus('connected');
            setMessages(prev => [...prev, { type: 'info', content: 'Connection established' }]);
        };

        ws.onmessage = (event) => {
            console.log('Message from AI:', event.data);
            try {
                const data = JSON.parse(event.data);
                setMessages(prev => [...prev, { type: 'data', content: data }]);
            } catch (e) {
                setMessages(prev => [...prev, { type: 'text', content: event.data }]);
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from AI WebSocket');
            setStatus('disconnected');
            setSocket(null);
            setMessages(prev => [...prev, { type: 'info', content: 'Connection closed' }]);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setStatus('error');
            setMessages(prev => [...prev, { type: 'error', content: 'WebSocket error occurred' }]);
        };

        setSocket(ws);
    };

    const disconnect = () => {
        if (socket) {
            socket.close();
            setSocket(null);
            setStatus('disconnected');
        }
    };

    useEffect(() => {
        // Scroll to bottom on new message
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const getStatusBadge = () => {
        switch (status) {
            case 'connected':
                return <Badge className="bg-green-500">Connected</Badge>;
            case 'disconnected':
                return <Badge variant="secondary">Disconnected</Badge>;
            case 'error':
                return <Badge variant="destructive">Error</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto my-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>AI WebSocket Live Data</CardTitle>
                <div className="flex items-center gap-4">
                    {getStatusBadge()}
                    <div className="space-x-2">
                        <Button
                            onClick={connect}
                            disabled={status === 'connected'}
                            variant={status === 'connected' ? "secondary" : "default"}
                        >
                            Connect
                        </Button>
                        <Button
                            onClick={disconnect}
                            disabled={status !== 'connected'}
                            variant="destructive"
                        >
                            Disconnect
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="bg-slate-950 rounded-md p-4 h-[400px] flex flex-col">
                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-2">
                            {messages.map((msg, idx) => (
                                <div key={idx} className="text-sm font-mono">
                                    {msg.type === 'info' && (
                                        <span className="text-blue-400">[{new Date().toLocaleTimeString()}] ℹ️ {msg.content}</span>
                                    )}
                                    {msg.type === 'error' && (
                                        <span className="text-red-400">[{new Date().toLocaleTimeString()}] ❌ {msg.content}</span>
                                    )}
                                    {msg.type === 'data' && (
                                        <pre className="text-green-400 whitespace-pre-wrap">
                                            {JSON.stringify(msg.content, null, 2)}
                                        </pre>
                                    )}
                                    {msg.type === 'text' && (
                                        <span className="text-gray-400">{msg.content}</span>
                                    )}
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                    </ScrollArea>
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-auto mb-auto">
                            No data received yet. Click Connect to start.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AiWebSocketTest;
