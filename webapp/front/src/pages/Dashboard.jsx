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
  const [predictions, setPredictions] = useState([]);

  const handleDataLoaded = (data) => {
    if (data && data.length > 0) {
      setPredictions(data);
    }
  };

  // Extract events from predictions for the side list
  // We only want future events, and predictions start from "today"
  const upcomingEvents = predictions.flatMap(p =>
    p.events ? p.events.map(e => ({ ...e, date: p.date })) : []
  );

  return (
    <div className="flex-1 p-8 pt-10 mt-20 h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between space-y-2 mb-8 shrink-0">
        <h2 className="text-3xl font-bold tracking-tight text-primary dark:bg-gradient-to-br dark:from-[#22d3ee] dark:to-[#60a5fa] dark:bg-clip-text dark:text-transparent">
          Tableau de Bord
        </h2>
      </div>

      <div className="flex flex-col gap-8 flex-1 min-h-0 pb-4">
        {/* Top Row: Key Metrics */}
        <div className="shrink-0">
          <DashboardStats data={predictions} />
        </div>

        {/* Middle Row: Events List (Horizontal) */}
        <div className="shrink-0">
          <EventSection events={upcomingEvents} />
        </div>

        {/* Bottom Row: Chart (Full Width, fills remaining space) */}
        <div className="flex-1 min-h-0 hover:shadow-lg transition-shadow duration-300">
          <RevenueChart onDataLoaded={handleDataLoaded} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
