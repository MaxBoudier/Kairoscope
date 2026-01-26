import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
   
   <div>
    <div> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
     <h1  >                          Kairoscope</h1>
      <p>Le projet **Kairoscope** est une initiative visant à développer un modèle *d'intelligence artificielle* innovant pour la prédiction de séries temporelles. 
       Ce projet sera réalisé sur une période intensive de deux semaines dans le cadre du **Défi Chal'Enge**.
       L'objectif principal est de créer un **outil de prédiction** qui soit à la fois plus précis et plus contextuel que les modèles traditionnels.
       Pour ce faire, le modèle n'utilisera pas seulement les données historiques internes, mais y ajoutera des informations pertinentes issues de l'OSINT (Open Source Intelligence), telles que l'actualité, les événements locaux ou l'activité sur les réseaux sociaux.</p>
    </div>


    <a href ="https://youtu.be/dQw4w9WgXcQ?si=Ps3t93QaAAvNxwDX"  target="_blank" > Cliquer par pitié</a>
    

   
    <p> fais parti du <a href="https://lecnam.net/accueil" title="Le Cnam" target="_blank" > cnam</a></p> 

  </div>
  );
};

export default Home;
