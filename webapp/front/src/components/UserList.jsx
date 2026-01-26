import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";


function UserList() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/admin/utilisateur`);
            if (!res.ok) throw new Error("Erreur réseau");

            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Erreur lors de la récupération :", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="max-w-xl mx-auto my-5 p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-card-dark/90 backdrop-blur-xl border border-white/20 dark:border-border-dark font-sans transform transition-all hover:scale-[1.005]">
            <h2 className="text-xl font-bold mb-4 pb-3 border-b border-gray-200 dark:border-border-dark bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">Liste des utilisateurs</h2>
            <ul className="list-none p-0 space-y-2">
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id} className="p-3 rounded-xl bg-gray-50/50 dark:bg-background-dark/30 border border-transparent hover:border-primary/20 text-text-primary-light dark:text-text-primary-dark hover:bg-white dark:hover:bg-card-dark transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold">
                                {user.Nom?.[0]}{user.Prenom?.[0]}
                            </div>
                            <span className="font-medium">{user.Nom} {user.Prenom}</span>
                        </li>
                    ))
                ) : (
                    <li className="p-8 text-center text-text-secondary-light dark:text-text-secondary-dark italic text-sm border-2 border-dashed border-gray-100 dark:border-border-dark rounded-xl">
                        Aucun utilisateur trouvé ou chargement...
                    </li>
                )}
            </ul>
        </div>
    );
}

export default UserList;