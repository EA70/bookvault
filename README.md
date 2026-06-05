BuchVault

BuchVault est une application web conçue pour simplifier la gestion des emprunts, 
des restitutions et le suivi du catalogue d'ouvrages au sein d'une bibliothèque universitaire. 
L'application sépare distinctement les cas d'utilisation grâce à deux interfaces dédiées : 
un espace étudiant pour la consultation et les demandes, et un panneau d'administration pour la gestion des flux de travail.


Fonctionnalités Principales

- Espace Étudiant
Consultation du catalogue avec recherche par titre ou auteur.
Suivi en temps réel de l'état des demandes (En possession, Restitué, En attente, Refusé).
Tableau de bord individuel intégrant des indicateurs statistiques sur le volume total d'emprunts et les taux de restitution.
Possibilité de notifier l'administration d'une intention de retour.

- Espace Administrateur
Validation ou rejet des demandes de prêt et des signalements de retour.
Vue d'ensemble de l'historique global des transactions par utilisateur.
Module d'extraction de données permettant de générer des rapports d'activité au format PDF.


-Architecture Technique
L'application repose sur une architecture découplée permettant une maintenance indépendante du client et du serveur :
Frontend : Développé avec React.js et structuré graphiquement via Tailwind CSS. L'iconographie est prise en charge par la bibliothèque Lucide React, et les communications avec l'API sont gérées par Axios.
Backend : API REST assurant la persistance des données et la logique métier.
Base de données : Système relationnel ( PostgreSQL) exploitant une machine à états stricte pour la colonne de statut.


