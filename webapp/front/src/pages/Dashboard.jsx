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
    <div className="flex-1 p-8 pt-10 mt-0 min-h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-lime-400 dark:from-[#7fffd4] dark:to-[#e8ff6a]">
          Tableau de Bord
        </h2>
      </div>

      <div className="flex flex-col gap-8 pb-8">
        {/* Top Row: Key Metrics */}
        <div>
          <DashboardStats data={predictions} />
        </div>

        {/* Middle Row: Events List (Horizontal) */}
        <div>
          <EventSection events={upcomingEvents} />
        </div>

        {/* Bottom Row: Chart */}
        <div className="hover:shadow-lg transition-shadow duration-300">
          <RevenueChart onDataLoaded={handleDataLoaded} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
