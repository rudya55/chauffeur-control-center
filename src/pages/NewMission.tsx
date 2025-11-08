import React from 'react';

// Page minimale d'exemple pour créer une "mission" et déclencher la fonction dispatch-course
export default function NewMission() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  async function createAndDispatch() {
    setLoading(true);
    setResult(null);
    try {
      // Exemple : appeler l'API de création de réservation backend
      // Remplacez par votre logique d'insert réelle
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup_address: 'Aéroport CDG', destination: 'Paris centre', client_name: 'Test' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Erreur création reservation');

      // Appel de la fonction dispatch-course — côté serveur il est préférable
      // d'appeler la fonction depuis le backend. Ici c'est juste un exemple.
      await fetch(process.env.REACT_APP_NOTIFY_FUNCTION_URL || '/api/dispatch-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: data.id })
      });

      setResult('Mission créée et dispatch demandée (voir logs).');
    } catch (e: any) {
      setResult('Erreur: ' + (e.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Créer une mission (test)</h2>
      <button onClick={createAndDispatch} disabled={loading}>
        {loading ? 'Envoi...' : 'Créer & Dispatch'}
      </button>
      {result && <p>{result}</p>}
    </div>
  );
}
