import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity } from "lucide-react";

/**
 * Stats component for the dashboard.
 * Displays key metrics derived from prediction data.
 */
const DashboardStats = ({ data }) => {
    // Default values
    let todayAffluence = 0;
    let tomorrowAffluence = 0;
    let confidence = "N/A";

    // Process data if available
    if (data && data.length > 0) {
        const today = data[0];
        const tomorrow = data.length > 1 ? data[1] : null;

        todayAffluence = Math.round(today.predicted_affluence);
        if (tomorrow) {
            tomorrowAffluence = Math.round(tomorrow.predicted_affluence);
        }

        confidence = today.confidence_score || "Moyenne";
    }

    const stats = [
        {
            title: "Aujourd'hui",
            value: todayAffluence.toString(),
            change: "Affluence prévue",
            icon: Users,
            color: "text-emerald-500"
        },
        {
            title: "Demain",
            value: tomorrowAffluence.toString(),
            change: "Affluence prévue",
            icon: Users,
            color: "text-green-500"
        },
        {
            title: "Confiance IA",
            value: confidence,
            change: "Niveau de certitude",
            icon: Activity,
            color: "text-purple-500"
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="border-border bg-card shadow-md dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-emerald-500/20 hover:shadow-xl transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-slate-400">
                                {stat.title}
                            </CardTitle>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-card-foreground dark:text-slate-100">{stat.value}</div>
                            <p className="text-xs text-muted-foreground dark:text-slate-500">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default DashboardStats;
