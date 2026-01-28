import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, X } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const carouselSlides = [
    {
      title: "Présentation",
      desc: "",
      list: [

      ],
      hasVideo: true
    },
    {
      title: "Contexte & valeur ajoutée",
      desc: "Les modèles traditionnels reposent sur l’historique interne. Kairoscope enrichit la prédiction avec des facteurs externes pour coller davantage à la réalité terrain.",
      list: [
        "Actualités et événements locaux influençant l’affluence.",
        "Météo, incidents et tendances sociales.",
        "Signaux OSINT consolidés en un flux exploitable."
      ]
    },
    {
      title: "Actions métiers concrètes",
      desc: "Les prédictions et alertes Kairoscope guident les décisions opérationnelles d’un restaurateur ou d’un commerce de proximité.",
      list: [
        "Gestion des stocks pour éviter ruptures et gaspillages.",
        "Planification du personnel selon les pics d’activité.",
        "Marketing & promotions ciblées aux bons moments.",
        "Menus spéciaux liés aux événements locaux.",
        "Anticipation des flux de trésorerie."
      ]
    },
    {
      title: "Objectifs techniques",
      desc: "Un PoC centré sur l’expérience utilisateur et la qualité de la prédiction.",
      list: [
        "Configuration : adresse du commerce + import CSV des ventes.",
        "Tableau de bord prédictif avec comparaison et annotations.",
        "Flux “Kairos” listant météo, événements et actualités."
      ]
    }
  ];
  const totalSlides = carouselSlides.length;

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
      <div className="pointer-events-none fixed inset-0 z-[1] hidden dark:block bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_45%),radial-gradient(circle_at_20%_60%,rgba(56,189,248,0.12),transparent_50%)] opacity-70"></div>

      {/* Banner Image */}
      <div className="pointer-events-none fixed inset-0 z-0 scale-[1.03] transform bg-[url('/Images/banner.png')] bg-contain bg-[center_top] bg-no-repeat blur-[2px] opacity-90 dark:opacity-60 transition-opacity duration-300"></div>

      <section className="relative z-[2] mx-auto max-w-[1280px] px-6 pb-[60px] pt-5 md:px-20 md:pb-20 md:pt-6">

        {/* Hero Section */}
        <h1 className="mt-10 mb-6 font-['Funnel_Display'] font-bold text-[clamp(32px,5vw,56px)] leading-[1.05] text-slate-900 dark:text-white">
          Prédire l’affluence, expliquer le pourquoi.
          <span className="mt-3.5 block text-[clamp(16px,2vw,22px)] text-slate-500 dark:text-[#b0b8c5]">
            OSINT et séries temporelles pour un modèle prédictif personnalisé.
          </span>
        </h1>
        <header className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-[30px] scroll-mt-[120px]" id="projet">
          <div className="hero-content">
            <p className="max-w-[520px] mt-5 text-lg leading-relaxed text-slate-600 dark:text-[#b0b8c5]">
              Kairoscope intègre des données externes (actualités, événements
              locaux, météo, réseaux sociaux) via une recherche OSINT consolidée en un flux exploitable.
              Ainsi que l'historique de l'affluence pour améliorer la prédiction générée par le modèle Temporal Fusion Transformer.
              Un tableau de bord simple compare la prévision classique à la prévision Kairoscope et explique l’écart.
            </p>
            <p className="mt-3.5 max-w-[520px] text-[15px] leading-relaxed text-slate-500 dark:text-[#b0b8c5]">
              Objectif : permettre aux commerces de proximité d’anticiper stocks,
              personnel, promotions et trésorerie. <br /> Projet porté par Maxime
              Boudier, étudiant CNAM ingénieur BDIA (2e année).
            </p>
            <div className="my-7 flex flex-wrap gap-3">
            </div>
            <div className="flex flex-wrap gap-6">
              <div>
                <strong className="block text-[22px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400 dark:from-[#e8ff6a] dark:to-[#7fffd4]">J+1 → J+14</strong>
                <span className="text-[13px] text-slate-500 dark:text-[#b0b8c5]">Horizon de prédiction</span>
              </div>
              <div>
                <strong className="block text-[22px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400 dark:from-[#e8ff6a] dark:to-[#7fffd4]">Double courbe</strong>
                <span className="text-[13px] text-slate-500 dark:text-[#b0b8c5]">Classique vs Kairoscope</span>
              </div>
              <div>
                <strong className="block text-[22px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400 dark:from-[#e8ff6a] dark:to-[#7fffd4]">Alertes</strong>
                <span className="text-[13px] text-slate-500 dark:text-[#b0b8c5]">Notifications temps réel</span>
              </div>
            </div>
          </div>

          {/* Hero Card */}
          <div className="rounded-[20px] border border-slate-200 bg-white/60 p-[22px] shadow-xl backdrop-blur-[16px] dark:border-white/12 dark:bg-[rgba(16,20,28,0.75)] dark:shadow-[0_30px_80px_rgba(6,10,16,0.65)] transition-colors duration-300">
            <div className="mb-[18px] flex items-center justify-between text-[13px] uppercase tracking-[1.4px] text-slate-500 dark:text-[#b0b8c5]">
              <span>Tableau de bord prédictif</span>
              <span className="h-2.5 w-2.5 animate-[pulse_1.8s_infinite] rounded-full bg-cyan-500 shadow-[0_0_0_rgba(34,211,238,0.6)] dark:bg-[#22d3ee] dark:shadow-[0_0_0_rgba(34,211,238,0.6)]"></span>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-[20px_1fr] items-start gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-linear-to-br from-emerald-400 to-lime-400 dark:from-[#7fffd4] dark:to-[#e8ff6a]"></div>
                <div>
                  <h3 className="mb-1 text-base m-0 text-slate-900 dark:text-white">Prévision enrichie</h3>
                  <p className="m-0 text-sm text-slate-500 dark:text-[#b0b8c5]">OSINT intégré aux séries temporelles.</p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-start gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-linear-to-br from-emerald-400 to-lime-400 dark:from-[#7fffd4] dark:to-[#e8ff6a]"></div>
                <div>
                  <h3 className="mb-1 text-base m-0 text-slate-900 dark:text-white">Annotations claires</h3>
                  <p className="m-0 text-sm text-slate-500 dark:text-[#b0b8c5]">Comprendre les pics et creux d’activité.</p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-start gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-linear-to-br from-emerald-400 to-lime-400 dark:from-[#7fffd4] dark:to-[#e8ff6a]"></div>
                <div>
                  <h3 className="mb-1 text-base m-0 text-slate-900 dark:text-white">Actions guidées</h3>
                  <p className="m-0 text-sm text-slate-500 dark:text-[#b0b8c5]">Notifier l’équipe au moment opportun.</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Carousel */}
        <section className="group relative mt-[90px] scroll-mt-[120px]">
          <div className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-[22px] shadow-lg dark:border-white/12 dark:bg-[rgba(17,22,32,0.95)]">
            <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100 shadow-xl dark:border-white/12 dark:bg-[#0b0f14] dark:shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {carouselSlides.map((slide, i) => (
                  <div key={i} className="min-w-full">
                    <article className="h-full w-full p-6 md:p-10 flex flex-col justify-center bg-white/80 dark:bg-[rgba(16,20,28,0.75)] backdrop-blur-[12px] min-h-[300px]">
                      <h2 className="mt-0 font-['Funnel_Display'] text-2xl font-bold text-slate-900 dark:text-white mb-4">
                        {slide.title}
                      </h2>
                      <p className="leading-relaxed text-slate-600 dark:text-[#b0b8c5] mb-6">
                        {slide.desc}
                      </p>
                      <ul className="list-none space-y-2.5 p-0">
                        {slide.list.map((item, j) => (
                          <li key={j} className="relative pl-[18px] text-sm text-slate-600 dark:text-[#b0b8c5] leading-relaxed before:absolute before:left-0 before:top-[0.45em] before:h-2 before:w-2 before:rounded-full before:bg-gradient-to-br before:from-cyan-400 before:to-blue-500 dark:before:from-[#22d3ee] dark:before:to-[#60a5fa]">
                            {item}
                          </li>
                        ))}
                      </ul>
                      {slide.hasVideo && (
                        <button
                          onClick={() => setShowVideo(true)}
                          className="mt-6 flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-cyan-600 hover:shadow-lg dark:bg-[#22d3ee] dark:text-slate-900 dark:hover:bg-[#60a5fa]"
                        >
                          <Play className="h-4 w-4 fill-current" />
                          Lancer la vidéo
                        </button>
                      )}
                    </article>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 opacity-0 transition-all hover:-translate-y-[calc(50%+2px)] hover:border-cyan-500 hover:text-cyan-600 group-hover:opacity-100 cursor-pointer shadow-md dark:border-white/12 dark:bg-[rgba(10,12,16,0.8)] dark:text-[#f5f7fb] dark:hover:border-[#22d3ee] dark:hover:text-[#22d3ee]"
            >
              &#8592;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 opacity-0 transition-all hover:-translate-y-[calc(50%+2px)] hover:border-cyan-500 hover:text-cyan-600 group-hover:opacity-100 cursor-pointer shadow-md dark:border-white/12 dark:bg-[rgba(10,12,16,0.8)] dark:text-[#f5f7fb] dark:hover:border-[#22d3ee] dark:hover:text-[#22d3ee]"
            >
              &#8594;
            </button>

            {/* Dots */}
            <div className="mt-3.5 flex justify-center gap-2">
              {[...Array(totalSlides)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2.5 w-2.5 rounded-full border border-slate-300 dark:border-white/12 transition-all cursor-pointer ${currentSlide === i ? 'bg-cyan-500 border-cyan-500 dark:bg-[#22d3ee] dark:border-[#22d3ee]' : ''}`}
                />
              ))}
            </div>
          </div>
        </section>


        {/* Team Grid */}
        <section className="mt-[90px] grid scroll-mt-[120px] grid-cols-1 md:grid-cols-2 gap-6" id="membres">
          {[
            {
              name: "Maxime Boudier",
              role: "Chef de projet - Data Engineer",
              school: "Ingénieur Sciences des Données et IA au CNAM (2e année)",
              desc: "Maxime porte la vision globale de Kairoscope et pilote l’intégration de l'intelligence artificielle ainsi que l'OSINT au sein de la solution.",
              tasks: ["Définition de la vision produit", "Intégration des données externes (OSINT)", "Cadrage du PoC et roadmap", "Coordination de l’équipe"],
              linkedin: "https://www.linkedin.com/in/maxime-boudier/"
            },
            {
              name: "Arthur Cielsar",
              role: "Développeur full-stack",
              school: "Licence Informatique Générale au CNAM (3e année)",
              desc: "Arthur est en charge du développement front-end et back-end de l’application Kairoscope.",
              tasks: ["Développement de l’interface utilisateur", "Architecture back-end", "Connexion aux sources de données", "Mise en place des premières briques IA"],
              linkedin: "#"
            },
            {
              name: "Mahé Joninon",
              role: "Étude de marché, pitch & produit",
              school: "Licence Informatique Générale au CNAM",
              desc: "Mahé travaille sur la structuration du projet côté marché, communication et expérience utilisateur.",
              tasks: ["Étude de marché & positionnement", "Préparation des pitchs jury / investisseurs", "Rédaction des supports (PDF, slides, scripts)", "Conception et développement de la landing page", "Branding & image du projet"],
              linkedin: "#"
            },
            {
              name: "Julie Demetriadis",
              role: "Analyse marché & retours terrain",
              school: "Étudiante à l’EGC",
              desc: "Julie apporte une vision business au projet et travaille sur la validation terrain de Kairoscope auprès des restaurateurs.",
              tasks: ["Étude de marché & segmentation clients", "Interviews de restaurateurs", "Tests d’usage en conditions réelles", "Analyse de la valeur perçue", "Recommandations business"],
              linkedin: "#"
            }
          ].map((member, index) => (
            <article key={index} className="flex flex-col rounded-[20px] border border-slate-200 bg-white/80 p-[26px] shadow-lg backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/12 dark:bg-[rgba(16,20,28,0.75)] dark:shadow-[0_20px_50px_rgba(3,5,8,0.4)] dark:hover:border-[#e8ff6a]/35 dark:hover:shadow-[0_28px_70px_rgba(3,5,8,0.55)]">

              <div className="mb-4">
                <h2 className="m-0 font-['Funnel_Display'] text-2xl font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h2>
                <div className="mt-1 text-[15px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-emerald-600 dark:from-[#e8ff6a] dark:to-[#7fffd4]">
                  {member.role}
                </div>
                <div className="mt-0.5 text-sm text-slate-500 dark:text-[#b0b8c5] italic">
                  {member.school}
                </div>
              </div>

              <p className="mb-6 leading-relaxed text-slate-600 dark:text-[#b0b8c5]">
                {member.desc}
              </p>

              <ul className="mb-8 list-none space-y-2.5 p-0 flex-grow">
                {member.tasks.map((task, i) => (
                  <li key={i} className="relative pl-[18px] text-sm text-slate-600 dark:text-[#b0b8c5] leading-relaxed before:absolute before:left-0 before:top-[0.45em] before:h-2 before:w-2 before:rounded-full before:bg-linear-to-br before:from-emerald-400 before:to-lime-400 dark:before:from-[#7fffd4] dark:before:to-[#e8ff6a]">
                    {task}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0077b5] dark:text-slate-500 dark:hover:text-[#0a66c2] transition-colors"
                  aria-label={`LinkedIn de ${member.name}`}
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>

            </article>
          ))}
        </section>

        {/* Footer CTA */}
        {/* <section className="mt-[90px] flex scroll-mt-[120px] flex-wrap items-center justify-between gap-6 rounded-[20px] border border-slate-200 bg-cyan-50 p-8 shadow-sm dark:border-white/12 dark:bg-[#0b0f14] dark:bg-gradient-to-br dark:from-[#22d3ee]/16 dark:to-[#60a5fa]/8 dark:shadow-none" id="contact">
          <div>
            <h2 className="mb-3 mt-0 font-['Funnel_Display'] text-2xl font-bold text-slate-900 dark:text-white">Prêt à lancer le PoC Kairoscope ?</h2>
            <p className="m-0 text-slate-600 dark:text-[#b0b8c5]">
              Une initiative stratégique OSINT pour optimiser la prédiction
              commerciale. Contacte l’équipe pour une démo, la note de cadrage
              complète et un accompagnement sur mesure.
            </p>
          </div>
          <button className="cursor-pointer rounded-full border border-transparent bg-[#22d3ee] px-[22px] py-3 text-sm font-semibold text-[#111] shadow-[0_12px_30px_rgba(34,211,238,0.25)] transition-all hover:-translate-y-0.5">Nous contacter</button>
        </section> */}
      </section>

      {/* Video Overlay */}
      {
        showVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white/70 backdrop-blur-md transition-colors hover:bg-black/70 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="aspect-video w-full flex items-center justify-center bg-slate-900 text-slate-500">
                {/* Placeholder for video */}
                <div className="text-center">
                  <Play className="mx-auto h-16 w-16 opacity-20 mb-4" />
                  <p>La vidéo sera intégrée ici prochainement.</p>
                </div>
                {/* 
                Example usage when video is ready:
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="VIDEO_URL" 
                    title="Kairoscope Demo" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
                */}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Home;
