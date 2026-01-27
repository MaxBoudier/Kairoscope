import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-['Space_Grotesk'] dark:bg-[#0b0f14] dark:text-[#f5f7fb] transition-colors duration-300">
      {/* Fonts Import */}
      <style>
        {`@import url("https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Space+Grotesk:wght@300..700&display=swap");`}
      </style>

      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-70 bg-[linear-gradient(120deg,rgba(255,255,255,0.8),rgba(240,248,255,0.9))] dark:bg-[linear-gradient(120deg,rgba(3,6,10,0.7),rgba(10,12,16,0.92))]"></div>
      {/* Additional radial gradients for dark mode (kept as standard div to avoid complex composition if not needed in light) */}
      <div className="pointer-events-none fixed inset-0 z-[1] hidden dark:block bg-[radial-gradient(circle_at_top_left,rgba(232,255,106,0.2),transparent_45%),radial-gradient(circle_at_20%_60%,rgba(88,193,255,0.12),transparent_50%)] opacity-70"></div>

      {/* Banner Image */}
      <div className="pointer-events-none fixed inset-0 z-0 scale-[1.03] transform bg-[url('/Images/banner.png')] bg-contain bg-[center_top] bg-no-repeat blur-[2px] opacity-90 dark:opacity-60 transition-opacity duration-300"></div>

      <section className="relative z-[2] mx-auto max-w-[1280px] px-6 pb-[60px] pt-5 md:px-20 md:pb-20 md:pt-6">

        {/* Hero Section */}
        <header className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-[30px] scroll-mt-[120px] md:mt-20" id="projet">
          <div className="hero-content">
            <p className="text-xs uppercase tracking-[2.5px] text-blue-600 font-bold dark:text-[#e8ff6a]">Note de cadrage — Projet Kairoscope</p>
            <h1 className="my-3 font-['Funnel_Display'] text-[clamp(32px,5vw,56px)] leading-[1.05] text-slate-900 dark:text-white">
              Prédire l’affluence, expliquer le pourquoi.
              <span className="mt-3.5 block text-[clamp(16px,2vw,22px)] text-slate-500 dark:text-[#b0b8c5]">OSINT + séries temporelles pour une décision proactive.</span>
            </h1>
            <p className="max-w-[520px] text-lg leading-relaxed text-slate-600 dark:text-[#b0b8c5]">
              Kairoscope intègre des données externes (actualités, événements
              locaux, météo, réseaux sociaux) aux historiques internes pour
              améliorer la prédiction de l’affluence. Un tableau de bord simple
              compare la prévision classique à la prévision Kairoscope et explique
              l’écart.
            </p>
            <p className="mt-3.5 max-w-[520px] text-[15px] leading-relaxed text-slate-500 dark:text-[#b0b8c5]">
              Objectif : permettre aux commerces de proximité d’anticiper stocks,
              personnel, promotions et trésorerie. Projet porté par Maxime
              Boudier, étudiant CNAM ingénieur BDIA (2e année).
            </p>
            <div className="my-7 flex flex-wrap gap-3">
              <button className="cursor-pointer rounded-full border border-transparent bg-[#e8ff6a] px-[22px] py-3 text-sm font-semibold text-[#111] shadow-[0_12px_30px_rgba(232,255,106,0.25)] transition-all hover:-translate-y-0.5">Voir la démo</button>
              <button className="cursor-pointer rounded-full border border-slate-300 bg-transparent px-[22px] py-3 text-sm text-slate-700 transition-all hover:border-lime-500 hover:text-lime-600 dark:border-white/12 dark:text-[#f5f7fb] dark:hover:border-[#e8ff6a] dark:hover:text-[#e8ff6a]">Lire la note</button>
            </div>
            <div className="flex flex-wrap gap-6">
              <div>
                <strong className="block text-[22px] font-semibold text-slate-900 dark:text-white">J+1 → J+14</strong>
                <span className="text-[13px] text-slate-500 dark:text-[#b0b8c5]">Horizon de prédiction</span>
              </div>
              <div>
                <strong className="block text-[22px] font-semibold text-slate-900 dark:text-white">Double courbe</strong>
                <span className="text-[13px] text-slate-500 dark:text-[#b0b8c5]">Classique vs Kairoscope</span>
              </div>
              <div>
                <strong className="block text-[22px] font-semibold text-slate-900 dark:text-white">Alertes</strong>
                <span className="text-[13px] text-slate-500 dark:text-[#b0b8c5]">Notifications temps réel</span>
              </div>
            </div>
          </div>

          {/* Hero Card */}
          <div className="rounded-[20px] border border-slate-200 bg-white/60 p-[22px] shadow-xl backdrop-blur-[16px] dark:border-white/12 dark:bg-[rgba(16,20,28,0.75)] dark:shadow-[0_30px_80px_rgba(6,10,16,0.65)] transition-colors duration-300">
            <div className="mb-[18px] flex items-center justify-between text-[13px] uppercase tracking-[1.4px] text-slate-500 dark:text-[#b0b8c5]">
              <span>Tableau de bord prédictif</span>
              <span className="h-2.5 w-2.5 animate-[pulse_1.8s_infinite] rounded-full bg-lime-500 shadow-[0_0_0_rgba(132,204,22,0.6)] dark:bg-[#e8ff6a] dark:shadow-[0_0_0_rgba(232,255,106,0.6)]"></span>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-[20px_1fr] items-start gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-lime-400 to-emerald-400 dark:from-[#e8ff6a] dark:to-[#7fffd4]"></div>
                <div>
                  <h3 className="mb-1 text-base m-0 text-slate-900 dark:text-white">Prévision enrichie</h3>
                  <p className="m-0 text-sm text-slate-500 dark:text-[#b0b8c5]">OSINT intégré aux séries temporelles.</p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-start gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-lime-400 to-emerald-400 dark:from-[#e8ff6a] dark:to-[#7fffd4]"></div>
                <div>
                  <h3 className="mb-1 text-base m-0 text-slate-900 dark:text-white">Annotations claires</h3>
                  <p className="m-0 text-sm text-slate-500 dark:text-[#b0b8c5]">Comprendre les pics et creux d’activité.</p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-start gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-lime-400 to-emerald-400 dark:from-[#e8ff6a] dark:to-[#7fffd4]"></div>
                <div>
                  <h3 className="mb-1 text-base m-0 text-slate-900 dark:text-white">Actions guidées</h3>
                  <p className="m-0 text-sm text-slate-500 dark:text-[#b0b8c5]">Notifier l’équipe au moment opportun.</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Functioning Strip */}
        <section className="mt-[90px] grid scroll-mt-[120px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[18px] rounded-[20px] border border-slate-200 bg-white p-7 shadow-lg dark:border-white/12 dark:bg-[rgba(17,22,32,0.95)] dark:shadow-none transition-colors duration-300" id="fonctionnement">
          <div>
            <span className="text-xs uppercase tracking-[2px] text-blue-600 font-bold dark:text-[#e8ff6a]">01</span>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-[#b0b8c5]">Prédit les ventes et l’affluence à court terme (J+1 à J+14).</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[2px] text-blue-600 font-bold dark:text-[#e8ff6a]">02</span>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-[#b0b8c5]">Montre la valeur de l’OSINT via deux courbes comparatives.</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[2px] text-blue-600 font-bold dark:text-[#e8ff6a]">03</span>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-[#b0b8c5]">Explique le pourquoi grâce à des annotations sur le graphe.</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[2px] text-blue-600 font-bold dark:text-[#e8ff6a]">04</span>
            <p className="mt-3 text-[15px] text-slate-600 dark:text-[#b0b8c5]">Envoie des notifications en temps réel pour agir vite.</p>
          </div>
        </section>

        {/* Context Grid */}
        <section className="mt-[90px] grid scroll-mt-[120px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          <article className="rounded-[20px] border border-slate-200 bg-white/80 p-[26px] shadow-lg backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/12 dark:bg-[rgba(16,20,28,0.75)] dark:shadow-[0_20px_50px_rgba(3,5,8,0.4)] dark:hover:border-[#e8ff6a]/35 dark:hover:shadow-[0_28px_70px_rgba(3,5,8,0.55)]">
            <h2 className="mt-0 font-['Funnel_Display'] text-2xl font-bold text-slate-900 dark:text-white">Contexte & valeur ajoutée</h2>
            <p className="leading-relaxed text-slate-600 dark:text-[#b0b8c5]">
              Les modèles traditionnels reposent sur l’historique interne.
              Kairoscope enrichit la prédiction avec des facteurs externes pour
              coller davantage à la réalité terrain.
            </p>
            <ul className="mt-4 list-none space-y-2.5 p-0">
              {[
                "Actualités et événements locaux influençant l’affluence.",
                "Météo, incidents et tendances sociales.",
                "Signaux OSINT consolidés en un flux exploitable."
              ].map((item, i) => (
                <li key={i} className="relative pl-[18px] text-sm text-slate-600 dark:text-[#b0b8c5] leading-relaxed before:absolute before:left-0 before:top-[0.45em] before:h-2 before:w-2 before:rounded-full before:bg-gradient-to-br before:from-lime-400 before:to-emerald-400 dark:before:from-[#e8ff6a] dark:before:to-[#7fffd4]">
                  {item}
                </li>
              ))}
            </ul>
            <button className="mt-4 cursor-pointer rounded-full border border-slate-300 bg-transparent px-[22px] py-3 text-sm text-slate-700 transition-all hover:border-lime-500 hover:text-lime-600 dark:border-white/12 dark:text-[#f5f7fb] dark:hover:border-[#e8ff6a] dark:hover:text-[#e8ff6a]">Découvrir la vision</button>
          </article>

          <article className="rounded-[20px] border border-slate-200 bg-white/80 p-[26px] shadow-lg backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/12 dark:bg-[rgba(16,20,28,0.75)] dark:shadow-[0_20px_50px_rgba(3,5,8,0.4)] dark:hover:border-[#e8ff6a]/35 dark:hover:shadow-[0_28px_70px_rgba(3,5,8,0.55)]">
            <h2 className="mt-0 font-['Funnel_Display'] text-2xl font-bold text-slate-900 dark:text-white">Actions métiers concrètes</h2>
            <p className="leading-relaxed text-slate-600 dark:text-[#b0b8c5]">
              Les prédictions et alertes Kairoscope guident les décisions
              opérationnelles d’un restaurateur ou d’un commerce de proximité.
            </p>
            <ul className="mt-4 list-none space-y-2.5 p-0">
              {[
                "Gestion des stocks pour éviter ruptures et gaspillages.",
                "Planification du personnel selon les pics d’activité.",
                "Marketing & promotions ciblées aux bons moments.",
                "Menus spéciaux liés aux événements locaux.",
                "Anticipation des flux de trésorerie."
              ].map((item, i) => (
                <li key={i} className="relative pl-[18px] text-sm text-slate-600 dark:text-[#b0b8c5] leading-relaxed before:absolute before:left-0 before:top-[0.45em] before:h-2 before:w-2 before:rounded-full before:bg-gradient-to-br before:from-lime-400 before:to-emerald-400 dark:before:from-[#e8ff6a] dark:before:to-[#7fffd4]">
                  {item}
                </li>
              ))}
            </ul>
            <button className="mt-4 cursor-pointer rounded-full border border-slate-300 bg-transparent px-[22px] py-3 text-sm text-slate-700 transition-all hover:border-lime-500 hover:text-lime-600 dark:border-white/12 dark:text-[#f5f7fb] dark:hover:border-[#e8ff6a] dark:hover:text-[#e8ff6a]">Voir les actions</button>
          </article>

          <article className="rounded-[20px] border border-slate-200 bg-white/80 p-[26px] shadow-lg backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/12 dark:bg-[rgba(16,20,28,0.75)] dark:shadow-[0_20px_50px_rgba(3,5,8,0.4)] dark:hover:border-[#e8ff6a]/35 dark:hover:shadow-[0_28px_70px_rgba(3,5,8,0.55)]">
            <h2 className="mt-0 font-['Funnel_Display'] text-2xl font-bold text-slate-900 dark:text-white">Objectifs techniques</h2>
            <p className="leading-relaxed text-slate-600 dark:text-[#b0b8c5]">
              Un PoC centré sur l’expérience utilisateur et la qualité de la
              prédiction.
            </p>
            <ul className="mt-4 list-none space-y-2.5 p-0">
              {[
                "Configuration : adresse du commerce + import CSV des ventes.",
                "Tableau de bord prédictif avec comparaison et annotations.",
                "Flux “KairOS” listant météo, événements et actualités."
              ].map((item, i) => (
                <li key={i} className="relative pl-[18px] text-sm text-slate-600 dark:text-[#b0b8c5] leading-relaxed before:absolute before:left-0 before:top-[0.45em] before:h-2 before:w-2 before:rounded-full before:bg-gradient-to-br before:from-lime-400 before:to-emerald-400 dark:before:from-[#e8ff6a] dark:before:to-[#7fffd4]">
                  {item}
                </li>
              ))}
            </ul>
            <button className="mt-4 cursor-pointer rounded-full border border-slate-300 bg-transparent px-[22px] py-3 text-sm text-slate-700 transition-all hover:border-lime-500 hover:text-lime-600 dark:border-white/12 dark:text-[#f5f7fb] dark:hover:border-[#e8ff6a] dark:hover:text-[#e8ff6a]">Voir le plan</button>
          </article>
        </section>

        {/* Team Grid */}
        <section className="mt-[90px] grid scroll-mt-[120px] grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6" id="membres">
          {[
            { title: " Vision & Pilotage", desc: "Maxime Boudier — Chef de projet / OSINT. Étudiant ingénieur BDIA au CNAM (2e année), Maxime porte la vision globale de Kairoscope et pilote l’intégration des données OSINT.", tasks: ["Définition de la vision produit", "Intégration des données externes (OSINT)", "Cadrage du PoC et roadmap", "Coordination de l’équipe"], cta: "Voir le rôle" },
            { title: "Développement & Data", desc: "Arthur Cielsar — Développeur full-stack. Étudiant en Licence Informatique Générale au CNAM (3e année), Arthur est en charge du développement front-end et back-end de l’application Kairoscope.", tasks: ["Développement de l’interface utilisateur", "Architecture back-end", "Connexion aux sources de données", "Mise en place des premières briques IA"], cta: "Voir la stack" },
            { title: "Stratégie, marché & produit", desc: "Mahé Joninon — Étude de marché, pitch & produit. Étudiant en Licence Informatique Générale au CNAM, Mahé travaille sur la structuration du projet côté marché, communication et expérience utilisateur.", tasks: ["Étude de marché & positionnement", "Préparation des pitchs jury / investisseurs", "Rédaction des supports (PDF, slides, scripts)", "Conception et développement de la landing page", "Branding & image du projet"], cta: "Voir la vision" },
            { title: "Business & terrain", desc: "Julie — Analyse marché & retours terrain (EGC). Étudiante à l’EGC, Julie apporte une vision business au projet et travaille sur la validation terrain de Kairoscope auprès des restaurateurs.", tasks: ["Étude de marché & segmentation clients", "Interviews de restaurateurs", "Tests d’usage en conditions réelles", "Analyse de la valeur perçue", "Recommandations business"], cta: "Voir l’impact" }
          ].map((card, index) => (
            <article key={index} className="rounded-[20px] border border-slate-200 bg-white/80 p-[26px] shadow-lg backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/12 dark:bg-[rgba(16,20,28,0.75)] dark:shadow-[0_20px_50px_rgba(3,5,8,0.4)] dark:hover:border-[#e8ff6a]/35 dark:hover:shadow-[0_28px_70px_rgba(3,5,8,0.55)]">
              <h2 className="mt-0 font-['Funnel_Display'] text-2xl font-bold text-slate-900 dark:text-white">{card.title}</h2>
              <p className="leading-relaxed text-slate-600 dark:text-[#b0b8c5]">
                {card.desc}
              </p>
              <ul className="mt-4 list-none space-y-2.5 p-0">
                {card.tasks.map((task, i) => (
                  <li key={i} className="relative pl-[18px] text-sm text-slate-600 dark:text-[#b0b8c5] leading-relaxed before:absolute before:left-0 before:top-[0.45em] before:h-2 before:w-2 before:rounded-full before:bg-gradient-to-br before:from-lime-400 before:to-emerald-400 dark:before:from-[#e8ff6a] dark:before:to-[#7fffd4]">{task}</li>
                ))}
              </ul>
              <button className="mt-4 cursor-pointer rounded-full border border-slate-300 bg-transparent px-[22px] py-3 text-sm text-slate-700 transition-all hover:border-lime-500 hover:text-lime-600 dark:border-white/12 dark:text-[#f5f7fb] dark:hover:border-[#e8ff6a] dark:hover:text-[#e8ff6a]">{card.cta}</button>
            </article>
          ))}
        </section>

        {/* Carousel */}
        <section className="group relative mt-[90px] scroll-mt-[120px]">
          <div className="mb-6 flex flex-col gap-2.5">
            <h2 className="m-0 font-['Funnel_Display'] text-2xl font-bold text-slate-900 dark:text-white">Critères de succès</h2>
            <p className="m-0 text-slate-500 dark:text-[#b0b8c5]">Ce qui définit la réussite du PoC Kairoscope.</p>
            <div className="flex flex-wrap gap-2">
              {["Intégration OSINT", "Application conviviale", "Vidéo promo impactante", "Pitch commercial clair"].map((tag, i) => (
                <span key={i} className="rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-xs text-slate-600 dark:border-white/12 dark:bg-[rgba(10,12,16,0.6)] dark:text-[#b0b8c5]">{tag}</span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-[22px] shadow-lg dark:border-white/12 dark:bg-[rgba(17,22,32,0.95)]">
            <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100 shadow-xl dark:border-white/12 dark:bg-[#0b0f14] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {[...Array(totalSlides)].map((_, i) => (
                  <div key={i} className="min-w-full">
                    <img src="/Images/banner.png" alt={`Vision Kairoscope 0${i + 1}`} className="block h-[240px] w-full object-cover filter contrast-[1.1] saturate-[0.95] md:h-[360px]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 opacity-0 transition-all hover:-translate-y-[calc(50%+2px)] hover:border-lime-500 hover:text-lime-600 group-hover:opacity-100 cursor-pointer shadow-md dark:border-white/12 dark:bg-[rgba(10,12,16,0.8)] dark:text-[#f5f7fb] dark:hover:border-[#e8ff6a] dark:hover:text-[#e8ff6a]"
            >
              &#8592;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 opacity-0 transition-all hover:-translate-y-[calc(50%+2px)] hover:border-lime-500 hover:text-lime-600 group-hover:opacity-100 cursor-pointer shadow-md dark:border-white/12 dark:bg-[rgba(10,12,16,0.8)] dark:text-[#f5f7fb] dark:hover:border-[#e8ff6a] dark:hover:text-[#e8ff6a]"
            >
              &#8594;
            </button>

            {/* Dots */}
            <div className="mt-3.5 flex justify-center gap-2">
              {[...Array(totalSlides)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2.5 w-2.5 rounded-full border border-slate-300 dark:border-white/12 transition-all cursor-pointer ${currentSlide === i ? 'bg-lime-500 border-lime-500 dark:bg-[#e8ff6a] dark:border-[#e8ff6a]' : ''}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-[90px] flex scroll-mt-[120px] flex-wrap items-center justify-between gap-6 rounded-[20px] border border-slate-200 bg-lime-50 p-8 shadow-sm dark:border-white/12 dark:bg-[#0b0f14] dark:bg-gradient-to-br dark:from-[#e8ff6a]/16 dark:to-[#7fffd4]/8 dark:shadow-none" id="contact">
          <div>
            <h2 className="mb-3 mt-0 font-['Funnel_Display'] text-2xl font-bold text-slate-900 dark:text-white">Prêt à lancer le PoC Kairoscope ?</h2>
            <p className="m-0 text-slate-600 dark:text-[#b0b8c5]">
              Une initiative stratégique OSINT pour optimiser la prédiction
              commerciale. Contacte l’équipe pour une démo, la note de cadrage
              complète et un accompagnement sur mesure.
            </p>
          </div>
          <button className="cursor-pointer rounded-full border border-transparent bg-[#e8ff6a] px-[22px] py-3 text-sm font-semibold text-[#111] shadow-[0_12px_30px_rgba(232,255,106,0.25)] transition-all hover:-translate-y-0.5">Nous contacter</button>
        </section>
      </section>
    </div>
  );
};

export default Home;
