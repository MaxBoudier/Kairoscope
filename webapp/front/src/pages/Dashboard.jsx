import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardStats from '@/components/Dashboard/DashboardStats';
import RevenueChart from '@/components/Dashboard/PredictionChart';
import EventSection from '@/components/Dashboard/EventSection';
import { fetchWithAuth } from '@/lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  // notificationsData removed as we removed the sidebar

  const [todayAffluence, setTodayAffluence] = useState(null);



  const handleDataLoaded = (data) => {
    if (data && data.length > 0) {
      setTodayAffluence(data[0].predicted_affluence);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 mt-14">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary dark:bg-gradient-to-br dark:from-[#22d3ee] dark:to-[#60a5fa] dark:bg-clip-text dark:text-transparent">
          Tableau de Bord
        </h2>
      </div>

      <div className="flex flex-col gap-4 h-full">
        {/* Top Row: Events & Affluence Card */}
        <div className="grid gap-4 md:grid-cols-2 h-1/2">
          <EventSection />

          <Card className="w-full border-border bg-card shadow-sm dark:bg-slate-950/50 dark:backdrop-blur-sm dark:border-indigo-500/20 flex flex-col justify-center items-center text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl font-semibold text-foreground dark:text-slate-100">
                Affluence prévue aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-primary dark:text-[#22d3ee]">
                {todayAffluence !== null ? todayAffluence : '-'}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Personnes attendues
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row: Chart (Full Width) */}
        <div className="h-1/2">
          <RevenueChart onDataLoaded={handleDataLoaded} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
