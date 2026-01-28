import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantDescForm from "@/components/Form/RestaurantDescForm";
import RestaurantInfoForm from "@/components/Form/RestaurantInfoForm";
import ImportCSV from "@/components/Import/importCSV";
import ModifUserForm from "@/components/Form/ModifUserForm"; // Import the new component
import { fetchWithAuth } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import PinProtection from './PinProtection';

const RestaurantSettings = () => {
    const [restaurantData, setRestaurantData] = useState(null);
    const [userData, setUserData] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    // Redirect if not authenticated (should be handled by protected route but good secondary check)
    // Also ensures we don't show cached unlocked state if local storage user is gone but session remains
    if (!user) {
        sessionStorage.removeItem('settingsUnlocked'); // Ensure clean state
        // We can't use navigate here directly in render easily without causing side effects or flicker, 
        // but since we are inside a component, we should use useEffect for navigation.
    }

    const [isUnlocked, setIsUnlocked] = useState(() => {
        return sessionStorage.getItem('settingsUnlocked') === 'true';
    });

    const navigate = useNavigate(); // Needs import from react-router-dom

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            sessionStorage.removeItem('settingsUnlocked');
            navigate('/login');
            return;
        }

        // Only fetch data if unlocked
        if (!isUnlocked) return;

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
    }, [isUnlocked]);

    const handleUnlock = () => {
        setIsUnlocked(true);
        sessionStorage.setItem('settingsUnlocked', 'true');
    };

    if (!isUnlocked) {
        return <PinProtection onSuccess={handleUnlock} />;
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-lime-400 dark:from-[#7fffd4] dark:to-[#e8ff6a] mb-8">
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
