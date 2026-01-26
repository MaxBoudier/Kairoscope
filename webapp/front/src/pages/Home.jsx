import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page-container">
      <section className="page">



        <header className="hero" id="projet">
          <div className="hero-content">
            <p className="eyebrow">Note de cadrage — Projet Kairoscope</p>
            <h1>
              Prédire l’affluence, expliquer le pourquoi.
              <span>OSINT + séries temporelles pour une décision proactive.</span>
            </h1>
            <p className="lead">
              Kairoscope intègre des données externes (actualités, événements
              locaux, météo, réseaux sociaux) aux historiques internes pour
              améliorer la prédiction de l’affluence. Un tableau de bord simple
              compare la prévision classique à la prévision Kairoscope et explique
              l’écart.
            </p>
            <p className="support">
              Objectif : permettre aux commerces de proximité d’anticiper stocks,
              personnel, promotions et trésorerie. Projet porté par Maxime
              Boudier, étudiant CNAM ingénieur BDIA (2e année).
            </p>
            <div className="hero-cta">
              <button className="primary">Voir la démo</button>
              <button className="ghost">Lire la note</button>
            </div>
            <div className="hero-metrics">
              <div>
                <strong>J+1 → J+14</strong>
                <span>Horizon de prédiction</span>
              </div>
              <div>
                <strong>Double courbe</strong>
                <span>Classique vs Kairoscope</span>
              </div>
              <div>
                <strong>Alertes</strong>
                <span>Notifications temps réel</span>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <div className="card-header">
              <span>Tableau de bord prédictif</span>
              <span className="pulse"></span>
            </div>
            <div className="card-body">
              <div className="card-row">
                <div className="dot"></div>
                <div>
                  <h3>Prévision enrichie</h3>
                  <p>OSINT intégré aux séries temporelles.</p>
                </div>
              </div>
              <div className="card-row">
                <div className="dot"></div>
                <div>
                  <h3>Annotations claires</h3>
                  <p>Comprendre les pics et creux d’activité.</p>
                </div>
              </div>
              <div className="card-row">
                <div className="dot"></div>
                <div>
                  <h3>Actions guidées</h3>
                  <p>Notifier l’équipe au moment opportun.</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="section strip" id="fonctionnement">
          <div className="strip-item">
            <span>01</span>
            <p>Prédit les ventes et l’affluence à court terme (J+1 à J+14).</p>
          </div>
          <div className="strip-item">
            <span>02</span>
            <p>Montre la valeur de l’OSINT via deux courbes comparatives.</p>
          </div>
          <div className="strip-item">
            <span>03</span>
            <p>Explique le pourquoi grâce à des annotations sur le graphe.</p>
          </div>
          <div className="strip-item">
            <span>04</span>
            <p>Envoie des notifications en temps réel pour agir vite.</p>
          </div>
        </section>

        <section className="section grid">
          <article>
            <h2>Contexte & valeur ajoutée</h2>
            <p>
              Les modèles traditionnels reposent sur l’historique interne.
              Kairoscope enrichit la prédiction avec des facteurs externes pour
              coller davantage à la réalité terrain.
            </p>
            <ul className="list">
              <li>Actualités et événements locaux influençant l’affluence.</li>
              <li>Météo, incidents et tendances sociales.</li>
              <li>Signaux OSINT consolidés en un flux exploitable.</li>
            </ul>
            <button className="ghost">Découvrir la vision</button>
          </article>
          <article>
            <h2>Actions métiers concrètes</h2>
            <p>
              Les prédictions et alertes Kairoscope guident les décisions
              opérationnelles d’un restaurateur ou d’un commerce de proximité.
            </p>
            <ul className="list">
              <li>Gestion des stocks pour éviter ruptures et gaspillages.</li>
              <li>Planification du personnel selon les pics d’activité.</li>
              <li>Marketing & promotions ciblées aux bons moments.</li>
              <li>Menus spéciaux liés aux événements locaux.</li>
              <li>Anticipation des flux de trésorerie.</li>
            </ul>
            <button className="ghost">Voir les actions</button>
          </article>
          <article>
            <h2>Objectifs techniques</h2>
            <p>
              Un PoC centré sur l’expérience utilisateur et la qualité de la
              prédiction.
            </p>
            <ul className="list">
              <li>
                Configuration : adresse du commerce + import CSV des ventes.
              </li>
              <li>Tableau de bord prédictif avec comparaison et annotations.</li>
              <li>Flux “KairOS” listant météo, événements et actualités.</li>
            </ul>
            <button className="ghost">Voir le plan</button>
          </article>
        </section>

        <section className="section grid" id="membres">
          <article>
            <h2>Portage du projet</h2>
            <p>
              Maxime Boudier, étudiant CNAM ingénieur BDIA (2e année), pilote le
              cadrage, la vision produit et l’intégration OSINT.
            </p>
            <ul className="list">
              <li>Note de cadrage et objectifs PoC.</li>
              <li>Coordination des jalons et livrables.</li>
              <li>Validation des hypothèses métier.</li>
            </ul>
            <button className="ghost">Voir le parcours</button>
          </article>
          <article>
            <h2>Équipe data & IA</h2>
            <p>
              Modélisation des séries temporelles et mise en évidence de la valeur
              ajoutée des données externes.
            </p>
            <ul className="list">
              <li>Comparaison modèle classique vs Kairoscope.</li>
              <li>Feature engineering sur les signaux OSINT.</li>
              <li>Évaluation continue de la précision.</li>
            </ul>
            <button className="ghost">Méthodo data</button>
          </article>
          <article>
            <h2>Terrain & expérience</h2>
            <p>
              Retours des commerçants pour s’assurer d’une application simple,
              conviviale et réellement utile.
            </p>
            <ul className="list">
              <li>Interviews et tests d’usage en conditions réelles.</li>
              <li>Amélioration continue du tableau de bord.</li>
              <li>Mesure de l’impact opérationnel.</li>
            </ul>
            <button className="ghost">Voir l’impact</button>
          </article>
        </section>

        <section className="section carousel">
          <div className="carousel-header">
            <h2>Critères de succès</h2>
            <p>Ce qui définit la réussite du PoC Kairoscope.</p>
            <div className="carousel-tags">
              <span>Intégration OSINT</span>
              <span>Application conviviale</span>
              <span>Vidéo promo impactante</span>
              <span>Pitch commercial clair</span>
            </div>
          </div>
          <div className="carousel-inner">
            <input
              className="carousel-input"
              type="radio"
              name="carousel"
              id="slide-1"
              defaultChecked
            />
            <input
              className="carousel-input"
              type="radio"
              name="carousel"
              id="slide-2"
            />
            <input
              className="carousel-input"
              type="radio"
              name="carousel"
              id="slide-3"
            />
            <input
              className="carousel-input"
              type="radio"
              name="carousel"
              id="slide-4"
            />
            <input
              className="carousel-input"
              type="radio"
              name="carousel"
              id="slide-5"
            />
            <input
              className="carousel-input"
              type="radio"
              name="carousel"
              id="slide-6"
            />

            <div className="carousel-viewport">
              <div className="carousel-track">
                <div className="slide">
                  <img src="/Images/banner.png" alt="Vision Kairoscope 01" />
                </div>
                <div className="slide">
                  <img src="/Images/banner.png" alt="Vision Kairoscope 02" />
                </div>
                <div className="slide">
                  <img src="/Images/banner.png" alt="Vision Kairoscope 03" />
                </div>
                <div className="slide">
                  <img src="/Images/banner.png" alt="Vision Kairoscope 04" />
                </div>
                <div className="slide">
                  <img src="/Images/banner.png" alt="Vision Kairoscope 05" />
                </div>
                <div className="slide">
                  <img src="/Images/banner.png" alt="Vision Kairoscope 06" />
                </div>
              </div>
            </div>

            <div className="carousel-nav">
              <label className="carousel-arrow prev prev-1" htmlFor="slide-6"
              >&#8592;</label
              >
              <label className="carousel-arrow prev prev-2" htmlFor="slide-1"
              >&#8592;</label
              >
              <label className="carousel-arrow prev prev-3" htmlFor="slide-2"
              >&#8592;</label
              >
              <label className="carousel-arrow prev prev-4" htmlFor="slide-3"
              >&#8592;</label
              >
              <label className="carousel-arrow prev prev-5" htmlFor="slide-4"
              >&#8592;</label
              >
              <label className="carousel-arrow prev prev-6" htmlFor="slide-5"
              >&#8592;</label
              >

              <label className="carousel-arrow next next-1" htmlFor="slide-2"
              >&#8594;</label
              >
              <label className="carousel-arrow next next-2" htmlFor="slide-3"
              >&#8594;</label
              >
              <label className="carousel-arrow next next-3" htmlFor="slide-4"
              >&#8594;</label
              >
              <label className="carousel-arrow next next-4" htmlFor="slide-5"
              >&#8594;</label
              >
              <label className="carousel-arrow next next-5" htmlFor="slide-6"
              >&#8594;</label
              >
              <label className="carousel-arrow next next-6" htmlFor="slide-1"
              >&#8594;</label
              >
            </div>

            <div className="carousel-dots">
              <label className="carousel-dot" htmlFor="slide-1"></label>
              <label className="carousel-dot" htmlFor="slide-2"></label>
              <label className="carousel-dot" htmlFor="slide-3"></label>
              <label className="carousel-dot" htmlFor="slide-4"></label>
              <label className="carousel-dot" htmlFor="slide-5"></label>
              <label className="carousel-dot" htmlFor="slide-6"></label>
            </div>
          </div>
        </section>

        <section className="section cta" id="contact">
          <div>
            <h2>Prêt à lancer le PoC Kairoscope ?</h2>
            <p>
              Une initiative stratégique OSINT pour optimiser la prédiction
              commerciale. Contacte l’équipe pour une démo, la note de cadrage
              complète et un accompagnement sur mesure.
            </p>
          </div>
          <button className="primary">Nous contacter</button>
        </section>
      </section>
    </div>
  );
};

export default Home;
