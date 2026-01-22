import { useState, useEffect } from 'react';

const TestMessage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count modified:', count);
  }, [count]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);

        const response = await fetch('http://localhost:8081/test');

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du message');
        }

        const data = await response.json();
        setMessage(data.message);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 m-8 mx-auto max-w-[600px] rounded-xl shadow-md text-white bg-gradient-to-br from-[#667eea] to-[#764ba2]">
        <div className="w-[50px] h-[50px] border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 m-8 mx-auto max-w-[600px] rounded-xl shadow-md text-white bg-gradient-to-br from-[#f093fb] to-[#f5576c]">
        <h2 className="m-0 mb-4 text-3xl font-semibold">❌ Erreur</h2>
        <p className="m-0 text-base opacity-90">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center p-8 m-8 mx-auto max-w-[600px] rounded-xl shadow-md text-white transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
        <h2 className="m-0 mb-4 text-3xl font-semibold">✅ Message reçu</h2>
        <p className="text-xl font-medium p-4 bg-white/20 rounded-lg backdrop-blur-sm mt-4">{message}</p>
      </div>

      <div className="flex flex-col items-center justify-center p-6 m-8 mx-auto max-w-[600px] bg-white dark:bg-card-dark rounded-xl shadow border border-border-light dark:border-border-dark">
        <h2 className="text-2xl font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">🔢 Compteur</h2>
        <p className="text-4xl font-bold text-primary mb-4">{count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Incrémenter
        </button>
      </div>
    </div>
  );
};

export default TestMessage;
