import { Navigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const ProtectedRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const hasChecked = useRef(false);

    useEffect(() => {
        // Éviter les vérifications multiples
        if (hasChecked.current) return;
        hasChecked.current = true;

        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/me', {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    // Stocker les données utilisateur
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('user', JSON.stringify(userData));
                    setIsAuthenticated(true);
                } else {
                    // Pas authentifié
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Erreur vérification auth:', error);
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, []);

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Vérification...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/startup" replace />;
    }

    return children;
};

export default ProtectedRoute;