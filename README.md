# Kairoscope

**Note de Cadrage : Projet “Kairoscope”**
*Porté par Maxime BOUDIER, étudiant CNAM ingénieur BDIA en 2ème année.*

## Introduction

Ce projet représente une opportunité unique de développer une approche innovante en matière de prédiction de séries temporelles en intégrant l'OSINT (Open Source INTelligence).
L’intérêt est de permettre à un restaurateur de pouvoir anticiper ses besoins en fonction de l’influence d’événements externes sur son activité.

## Contexte et Valeur Ajoutée

Les modèles de prédiction de séries temporelles traditionnels se basent principalement sur les données historiques internes. Cependant, de nombreux facteurs externes influencent ces séries. Ce projet propose d'intégrer des données OSINT (actualités, événements locaux, accidents, réseaux sociaux, etc.) pour offrir une prédiction plus factuelle et proche de la réalité.

En fonction des prédictions et des notifications de Kairoscope, un restaurateur pourrait entreprendre les actions suivantes :

* **Gestion des stocks :** Ajuster les commandes de produits frais et secs pour éviter les ruptures ou les gaspillages, en prévision d'une affluence plus ou moins importante.
* **Planification du Personnel :** Adapter les plannings du personnel (cuisiniers, serveurs) pour s'assurer d'une couverture adéquate en cas de pic d'activité ou de période creuse.
* **Marketing et Promotions :** Lancer des offres spéciales ou des promotions ciblées pendant les périodes de faible affluence anticipée.
* **Préparation de Menus Spéciaux :** Créer des menus thématiques ou des plats spéciaux en lien avec des événements locaux prédits par l'OSINT.
* **Gestion de la Trésorerie :** Anticiper les flux de trésorerie en fonction des prédictions de ventes pour une meilleure gestion financière.

## Objectif du Projet

Kairoscope est développé comme un service conçu pour les restaurants. L'idée centrale est de leur fournir un **tableau de bord simple** qui :

1. **Prédit leurs ventes et leur affluence** à court terme (J+1 à J+14).
2. **Démontre la valeur de l'OSINT :** Le tableau de bord affiche deux courbes : une prédiction "classique" (basée sur l'historique) et la prédiction "Kairoscope" (enrichie par les événements OSINT), montrant l'écart.
3. **Explique le "pourquoi" :** Des annotations sur le graphique permettent de comprendre les pics ou les creux (ex: "+30% attendu vendredi soir en raison du concert à proximité").
4. **Notifications :** L’envoi de notification en temps réel afin de piloter stratégiquement au moment opportun.

## Objectifs Techniques

1. **Configuration :** Pour que l'utilisateur renseigne l'adresse de son commerce et importe son historique de ventes (via un simple CSV).
2. **Tableau de bord Prédictif :** L'écran principal avec le graphique comparatif et les annotations explicatives.
3. **Flux "Kairos" :** Une liste simple des événements OSINT détectés par le système (météo, événements locaux, actualités).

## Critères de Succès

Le succès de ce PoC sera évalué sur les points suivants :

* Capacité du modèle à intégrer et exploiter les données OSINT pour améliorer la prédiction.
* Fonctionnalité et convivialité de l'application de démonstration.
* Qualité et impact de la vidéo promotionnelle.
* Clarté et attractivité du pitch commercial.

## Conclusion

Le projet "Kairoscope" représente une initiative stratégique en matière d'OSINT, dont l'objectif est d'optimiser la prédiction commerciale au sein des commerces de proximité. Par l'intégration et l'analyse de données internes et externes, il est conçu pour fournir aux restaurateurs une vision proactive, favorisant ainsi une gestion améliorée et l'identification de nouvelles opportunités.
Ce PoC constitue le fondement d'un futur outil d'aide à la décision.

maxime lpb kkkk
