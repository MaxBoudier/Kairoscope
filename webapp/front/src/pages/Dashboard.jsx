import React, { useState, useEffect } from 'react';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import RevenueChart from '@/components/Dashboard/PredictionChart';
import NotificationSidebar from '@/components/Dashboard/NotificationSidebar';
import { fetchWithAuth } from '@/lib/api';

const Dashboard = () => {
  const [notificationsData, setNotificationsData] = useState(null);

  useEffect(() => {
    const fetchNotificationsData = async () => {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/notifications`);

        if (response.ok) {
          const data = await response.json();
          setNotificationsData(data);
        }
      } catch (error) {
        if (error.message !== "Unauthorized") {
          console.error("Erreur lors de la récupération :", error);
        }
        setNotificationsData([]);
      }
    };

    fetchNotificationsData();
  }, []);

  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotificationsData((prev) => prev.filter((n) => n.id !== id));
      } else {
        console.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary dark:bg-gradient-to-r dark:from-violet-400 dark:to-indigo-400 dark:bg-clip-text dark:text-transparent">
          Tableau de Bord
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-full">
        <RevenueChart />
        <NotificationSidebar notificationsData={notificationsData} onDelete={handleDeleteNotification} />
      </div>
    </div>
  );
};

export default Dashboard;
