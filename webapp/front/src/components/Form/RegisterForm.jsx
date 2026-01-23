import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const RegisterForm = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        pseudo: '',
        nom_gerant: '',
        prenom_gerant: '',
        code_settings: '',
        registration_code: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Pour le code_settings, on limite à 4 chiffres
        if (name === 'code_settings') {
            const numericValue = value.replace(/\D/g, '').slice(0, 4);
            setCredentials({ ...credentials, [name]: numericValue });
        } else {
            setCredentials({ ...credentials, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/public/register-first`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                alert("Premier administrateur créé ! Vous pouvez maintenant vous connecter.");
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.error || "Erreur lors de la création.");
            }
        } catch (error) {
            setError("Impossible de contacter le serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background transition-colors duration-200">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-card backdrop-blur-xl border border-border transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">Initialisation</h2>
                    <p className="text-muted-foreground mt-2 text-sm">Créez le premier administrateur pour commencer</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-3">
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Pseudo</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 outline-none"
                            type="text"
                            name="pseudo"
                            placeholder="Admin"
                            value={credentials.pseudo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Nom du gérant</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 outline-none"
                            type="text"
                            name="nom_gerant"
                            placeholder="Dupont"
                            value={credentials.nom_gerant}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Prénom du gérant</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 outline-none"
                            type="text"
                            name="prenom_gerant"
                            placeholder="Jean"
                            value={credentials.prenom_gerant}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Email administrateur</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 outline-none"
                            type="email"
                            name="email"
                            placeholder="admin@kairoscope.com"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Définir un mot de passe</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 outline-none"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Code PIN (4 chiffres)</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 outline-none text-center tracking-widest text-xl"
                            type="text"
                            inputMode="numeric"
                            name="code_settings"
                            placeholder="••••"
                            value={credentials.code_settings}
                            onChange={handleChange}
                            maxLength={4}
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 px-4 rounded-xl font-bold text-primary-foreground shadow-lg transition-all duration-300 transform
                                ${isLoading
                                    ? 'bg-muted cursor-not-allowed opacity-70'
                                    : 'bg-primary hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.98]'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Création en cours...
                                </span>
                            ) : 'Créer le premier administrateur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
