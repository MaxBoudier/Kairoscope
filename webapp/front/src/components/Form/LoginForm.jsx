import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const LoginForm = () => {

    const navigate = useNavigate(); // Initialise le hook
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);
        }
    }, [location]);

    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    useEffect(() => {
        const checkUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/public/user-check`);
                if (response.ok) {
                    const data = await response.json();
                    if (!data.hasUsers) {
                        navigate('/register');
                        return;
                    }
                }
            } catch (error) {
                console.error("Erreur vérification users:", error);
            } finally {
                setIsChecking(false);
            }
        };
        checkUsers();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    email: data.email,
                    roles: data.roles,
                    firstname: data.firstname || 'Utilisateur',
                    lastname: data.lastname || ''
                }));
                navigate('/');
            } else {
                alert("Identifiants incorrects");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/80 dark:bg-slate-950/60 backdrop-blur-xl border border-white/20 dark:border-indigo-500/30 transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Bienvenue</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">Connectez-vous à votre espace</p>
                </div>

                {successMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm flex items-center gap-3">
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {successMessage}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-200 ml-1">Email</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-500/20 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-violet-500/40 focus:border-primary dark:focus:border-violet-500 transition-all duration-200 outline-none"
                            type="email"
                            name="email"
                            placeholder="exemple@email.com"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-200 ml-1">Mot de passe</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-indigo-500/20 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-violet-500/40 focus:border-primary dark:focus:border-violet-500 transition-all duration-200 outline-none"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed opacity-70'
                                    : 'bg-gradient-to-r from-primary to-primary-dark dark:from-violet-600 dark:to-indigo-600 hover:shadow-primary/30 dark:hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-[0.98]'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </span>
                            ) : 'Se connecter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;