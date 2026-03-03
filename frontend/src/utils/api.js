const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export async function submitScore(game, score, player = 'Anonymous', extra = {}) {
  try {
    const res = await fetch(`${API_URL}/scores/${game}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game, score, player, extra }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getTopScores(game, limit = 10) {
  try {
    const res = await fetch(`${API_URL}/scores/${game}?limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
