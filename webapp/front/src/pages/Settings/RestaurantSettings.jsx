import React, { useState, useEffect } from 'react';
import RestaurantDescForm from "@/components/Form/RestaurantDescForm";
import RestaurantInfoForm from "@/components/Form/RestaurantInfoForm";
import ImportCSV from "@/components/Import/importCSV";
import { fetchWithAuth } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const RestaurantSettings = () => {
    const [restaurantData, setRestaurantData] = useState(null);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/settings`);
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

            <Tabs defaultValue="parameters" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="parameters">Paramètres Restaurant</TabsTrigger>
                    <TabsTrigger value="import">Import Data</TabsTrigger>
                </TabsList>
                <TabsContent value="parameters">
                    <div className="grid gap-8 mt-4">
                        <RestaurantDescForm initialData={restaurantData} />
                        <RestaurantInfoForm initialData={restaurantData} />
                    </div>
                </TabsContent>
                <TabsContent value="import">
                    <div className="mt-4">
                        <ImportCSV />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RestaurantSettings;
