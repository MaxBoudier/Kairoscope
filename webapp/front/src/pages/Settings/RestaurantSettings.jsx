import React, { useState, useEffect } from 'react';
import RestaurantDescForm from "@/components/Form/RestaurantDescForm";
import RestaurantInfoForm from "@/components/Form/RestaurantInfoForm";
import ImportCSV from "@/components/Import/importCSV";
import ModifUserForm from "@/components/Form/ModifUserForm"; // Import the new component
import { fetchWithAuth } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const RestaurantSettings = () => {
    const [restaurantData, setRestaurantData] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch restaurant settings
                const settingsRes = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/settings`);
                if (settingsRes.ok) {
                    setRestaurantData(await settingsRes.json());
                }

                // Fetch user data
                const userRes = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/me`);
                if (userRes.ok) {
                    setUserData(await userRes.json());
                }
            } catch (error) {
                console.error("Erreur lors de la récupération :", error);
            }
        };

        fetchAllData();
    }, []);

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-4xl font-bold text-primary dark:bg-gradient-to-r dark:from-violet-400 dark:to-indigo-400 dark:bg-clip-text dark:text-transparent mb-8">
                Paramètres
            </h1>

            <Tabs defaultValue="parameters" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="parameters">Restaurant</TabsTrigger>
                    <TabsTrigger value="user">Compte</TabsTrigger>
                    <TabsTrigger value="import">Données</TabsTrigger>
                </TabsList>
                <TabsContent value="parameters">
                    <div className="grid gap-8 mt-4">
                        <RestaurantDescForm initialData={restaurantData} />
                        <RestaurantInfoForm initialData={restaurantData} />
                    </div>
                </TabsContent>
                <TabsContent value="user">
                    <div className="mt-4">
                        <ModifUserForm initialData={userData} />
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
