import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  /* Redirect logic removed to allow access to Home page */
  useEffect(() => {
    // const user = localStorage.getItem('user');
    // if (user) {
    //   navigate('/dashboard');
    // }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-70px)] bg-gray-50 dark:bg-neutral-900 text-slate-900 dark:text-slate-100 p-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Bienvenue sur Kairoscope
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-center text-slate-600 dark:text-slate-400 max-w-2xl">
        L'outil de prédiction d'affluence nouvelle génération pour les
        restaurateurs.
      </p>

      <div className="flex gap-4">
        <Button
          onClick={() => navigate("/login")}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          Se connecter
        </Button>
        <Button
          onClick={() => navigate("/register")}
          variant="outline"
          size="lg"
        >
          Créer un compte
        </Button>
      </div>
    </div>
  );
};

export default Home;
