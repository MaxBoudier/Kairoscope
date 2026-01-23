import React, { useState, useEffect } from 'react';
import RestaurantDescForm from "@/components/Form/RestaurantDescForm";
import RestaurantInfoForm from "@/components/Form/RestaurantInfoForm";
import { fetchWithAuth } from '@/lib/api';

const RestaurantSettings = () => {
    const [restaurantData, setRestaurantData] = useState(null);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/settings`);
                if (response.ok) {
                    const data = await response.json();
                    setRestaurantData(data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération :", error);
            }
        };

        fetchRestaurantData();
    }, []);

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-4xl font-bold text-primary dark:bg-gradient-to-r dark:from-violet-400 dark:to-indigo-400 dark:bg-clip-text dark:text-transparent mb-8">
                Paramètres du Restaurant
            </h1>
            <div className="grid gap-8">
                <RestaurantDescForm initialData={restaurantData} />
                <RestaurantInfoForm initialData={restaurantData} />
            </div>
        </div>
    );
};

export default RestaurantSettings;
