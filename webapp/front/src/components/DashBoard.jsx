import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [socketStatus, setSocketStatus] = useState('disconnected'); // disconnected, connecting, connected, error
  const [progress, setProgress] = useState({ step: 0, total: 0, message: '', step_name: '' });
  const [predictions, setPredictions] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const connectWebSocket = () => {
      setSocketStatus('connecting');
      const ws = new WebSocket('ws://localhost:8000/ws/predict');
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to AI WebSocket');
        setSocketStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.status === 'message') {
            // General status update if needed
          } else if (data.status === 'steps') {
            setProgress({
              step: data.step,
              total: data.total_step,
              message: data.message,
              step_name: data.step_name
            });
          } else if (data.status === 'output') {
            // Transform payload for chart if necessary, or just use it
            // payload: [{date: '...', predicted_affluence: 45, ...}, ...]
            if (data.payload) {
              setPredictions(data.payload);
            }
          } else if (data.status === 'error') {
            console.error('AI Error:', data.message);
          }
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setSocketStatus('error');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        if (socketStatus !== 'error') {
          setSocketStatus('disconnected');
        }
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-20 bg-background-light dark:bg-background-dark font-sans text-text-primary-light dark:text-text-primary-dark transition-colors duration-200">

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pt-6 pb-2 transition-colors">
        <h2 className="text-xl font-bold leading-tight tracking-tight">Tableau de Bord</h2>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-card-dark text-text-primary-light dark:text-text-primary-dark shadow-sm ring-1 ring-border-light dark:ring-border-dark transition-all hover:bg-gray-50 dark:hover:bg-opacity-80">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      {/* Time Period Chips */}
      <div className="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar">
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white px-5 shadow-md shadow-primary/20 transition-transform active:scale-95">
          <p className="text-sm font-bold leading-normal">Aujourd'hui</p>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-card-dark border border-border-light dark:border-border-dark px-5 transition-colors hover:bg-gray-50 dark:hover:bg-opacity-80">
          <p className="text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark">Hier</p>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-card-dark border border-border-light dark:border-border-dark px-5 transition-colors hover:bg-gray-50 dark:hover:bg-opacity-80">
          <p className="text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark">7 jours</p>
        </button>
      </div>

      {/* AI Prediction Section */}
      <div className="px-4 py-4">
        <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium leading-normal">
                Prédictions d'Affluence (IA)
              </p>
              {predictions.length > 0 && (
                <p className="text-xl font-bold leading-tight tracking-tight mt-1">
                  {predictions[predictions.length - 1].date}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {socketStatus === 'connecting' && <span className="flex h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>}
              {socketStatus === 'connected' && <span className="flex h-2 w-2 rounded-full bg-green-500"></span>}
              {socketStatus === 'error' && <span className="flex h-2 w-2 rounded-full bg-red-500"></span>}
              <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase font-bold tracking-wider">Actually Live</span>
            </div>
          </div>

          {/* Loading / Progress State */}
          {predictions.length === 0 && (
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              {socketStatus === 'error' ? (
                <p className="text-red-500 text-sm">Erreur de connexion au service IA.</p>
              ) : (
                <>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress.total ? (progress.step / progress.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark animate-pulse">
                    {progress.message || "Initialisation du modèle..."}
                    {progress.total > 0 && ` (${Math.round((progress.step / progress.total) * 100)}%)`}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Chart State */}
          {predictions.length > 0 && (
            <div className="h-64 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictions}>
                  <defs>
                    <linearGradient id="colorAffluence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis
                    dataKey="date"
                    hide={true}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    hide={true}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted_affluence"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAffluence)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Static Revenue Section (Kept as is) */}
      <div className="px-4 pb-4">
        <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-5 shadow-sm opacity-80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium leading-normal">Chiffre d'affaires (Simulé)</p>
              <p className="text-3xl font-bold leading-tight tracking-tight mt-1">2 450,00 €</p>
            </div>
          </div>
          {/* Static Chart SVG */}
          <div className="relative h-32 w-full mt-2 grayscale hover:grayscale-0 transition-all">
            <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 472 150">
              {/* Simplified static content */}
              <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary-light dark:text-text-secondary-dark"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-6">
        <div className="flex flex-col gap-3 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
            <span className="text-green-600 dark:text-green-400 text-xs font-bold">+5%</span>
          </div>
          <div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">Commandes</p>
            <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">45</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <span className="text-green-600 dark:text-green-400 text-xs font-bold">+2%</span>
          </div>
          <div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">Panier Moyen</p>
            <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">54,00 €</p>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="flex flex-col px-4 pb-24">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold leading-tight">Alertes Récentes</h3>
          <a className="text-primary text-sm font-semibold hover:underline" href="#">Voir tout</a>
        </div>
        <div className="flex flex-col gap-3">
          {/* Alert 1 */}
          <div className="flex items-start gap-4 rounded-lg bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-4 shadow-sm hover:border-red-200 dark:hover:border-red-900 transition-colors cursor-pointer group">
            <div className="h-10 w-10 shrink-0 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="font-semibold text-sm truncate">Stock faible : Vin Rouge</h4>
                <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark shrink-0">10m</span>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">Il reste moins de 3 bouteilles en réserve. Pensez à recommander.</p>
            </div>
          </div>
          {/* Alert 2 */}
          <div className="flex items-start gap-4 rounded-lg bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-4 shadow-sm hover:border-blue-200 dark:hover:border-blue-900 transition-colors cursor-pointer group">
            <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined">restaurant</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="font-semibold text-sm truncate">Nouvelle réservation</h4>
                <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark shrink-0">35m</span>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">Table 4 pour 2 personnes à 20h00. Note: Anniversaire.</p>
            </div>
          </div>
          {/* Alert 3 */}
          <div className="flex items-start gap-4 rounded-lg bg-white dark:bg-card-dark border border-border-light dark:border-border-dark p-4 shadow-sm hover:border-green-200 dark:hover:border-green-900 transition-colors cursor-pointer group">
            <div className="h-10 w-10 shrink-0 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined">star</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="font-semibold text-sm truncate">Nouvel avis client</h4>
                <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark shrink-0">1h</span>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">"Super service et plats délicieux ! Je recommande vivement." (5 étoiles)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-20 items-center justify-around border-t border-border-light dark:border-border-dark bg-white dark:bg-card-dark px-2 pb-5 pt-3 backdrop-blur-lg backdrop-saturate-150">
        <a className="group flex flex-col items-center justify-center gap-1 w-16" href="#">
          <div className="flex h-8 w-14 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-primary-dark dark:text-primary text-[24px]">dashboard</span>
          </div>
          <span className="text-[11px] font-bold text-primary-dark dark:text-primary">Accueil</span>
        </a>
        <a className="group flex flex-col items-center justify-center gap-1 w-16" href="#">
          <div className="flex h-8 w-14 items-center justify-center rounded-full bg-transparent transition-colors group-hover:bg-gray-50 dark:group-hover:bg-white/5">
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[24px]">receipt</span>
          </div>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Commandes</span>
        </a>
        <a className="group flex flex-col items-center justify-center gap-1 w-16" href="#">
          <div className="flex h-8 w-14 items-center justify-center rounded-full bg-transparent transition-colors group-hover:bg-gray-50 dark:group-hover:bg-white/5">
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[24px]">restaurant_menu</span>
          </div>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Menu</span>
        </a>
        <a className="group flex flex-col items-center justify-center gap-1 w-16" href="#">
          <div className="flex h-8 w-14 items-center justify-center rounded-full bg-transparent transition-colors group-hover:bg-gray-50 dark:group-hover:bg-white/5">
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[24px]">groups</span>
          </div>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Équipe</span>
        </a>
      </nav>
    </div>
  );
};

export default Dashboard;
