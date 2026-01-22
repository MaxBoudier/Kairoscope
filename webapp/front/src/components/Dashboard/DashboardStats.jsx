import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";

/**
 * Stats component for the dashboard.
 * Displays key metrics like Revenue, Customers, etc.
 */
const DashboardStats = () => {
    // Mock data - in a real app, this would come from props or a query
    const stats = [
        {
            title: "",
            value: "",
            change: "",
            icon: DollarSign,
        },
        {
            title: "",
            value: "",
            change: "",
            icon: Users,
        },
        {
            title: "",
            value: "",
            change: "",
            icon: Activity,
        },
        {
            title: "",
            value: "",
            change: "",
            icon: TrendingUp,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-indigo-500/20 hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground dark:text-slate-400">
                                {stat.title}
                            </CardTitle>
                            <Icon className="h-4 w-4 text-primary dark:text-indigo-400" />
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
