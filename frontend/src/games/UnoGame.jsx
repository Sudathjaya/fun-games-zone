import React, { useState, useCallback } from 'react';
import GameHeader from '../components/GameHeader';

const COLORS = ['red', 'green', 'blue', 'yellow'];
const COLOR_STYLES = {
  red:    'bg-red-500 border-red-600',
  green:  'bg-green-500 border-green-600',
  blue:   'bg-blue-500 border-blue-600',
  yellow: 'bg-yellow-400 border-yellow-500',
  wild:   'bg-gray-800 border-gray-600',
};
const COLOR_TEXT = { red: 'text-red-500', green: 'text-green-500', blue: 'text-blue-500', yellow: 'text-yellow-500' };

function createDeck() {
  const deck = [];
  COLORS.forEach(color => {
    // 0 once, 1-9 twice, action cards twice
    deck.push({ color, value: '0' });
    for (let n = 1; n <= 9; n++) { deck.push({ color, value: String(n) }); deck.push({ color, value: String(n) }); }
    ['Skip', 'Reverse', 'Draw2'].forEach(v => { deck.push({ color, value: v }); deck.push({ color, value: v }); });
  });
  // Wild cards ×4 each
  for (let i = 0; i < 4; i++) { deck.push({ color: 'wild', value: 'Wild' }); deck.push({ color: 'wild', value: 'Wild4' }); }
  return deck;
}

function shuffle(deck) { return [...deck].sort(() => Math.random() - 0.5); }

function initGame(numPlayers) {
  let deck = shuffle(createDeck());
  const hands = Array.from({ length: numPlayers }, () => deck.splice(0, 7));
  // First card must not be wild
  let startIdx = deck.findIndex(c => c.color !== 'wild');
  const topCard = deck.splice(startIdx, 1)[0];
  return { deck, hands, discard: [topCard], currentColor: topCard.color };
}

function canPlay(card, topCard, currentColor) {
  if (card.color === 'wild') return true;
  if (card.color === currentColor) return true;
  if (card.value === topCard.value && topCard.color !== 'wild') return true;
  return false;
}

const CARD_LABELS = { Skip: '⊘ Skip', Reverse: '⇄ Rev', Draw2: '+2', Wild: '🌈', Wild4: '🌈+4' };

function CardView({ card, playable, selected, onClick, small }) {
  const cs = COLOR_STYLES[card.color] || COLOR_STYLES.wild;
  const label = CARD_LABELS[card.value] || card.value;
  return (
    <button
      onClick={onClick}
      disabled={!playable}
      className={`rounded-xl border-4 font-black flex items-center justify-center transition-all select-none
                  ${small ? 'w-9 h-14 text-xs' : 'w-12 h-18 sm:w-14 sm:h-20 text-sm'}
                  ${cs}
                  ${playable ? 'hover:scale-110 hover:-translate-y-2 cursor-pointer ring-2 ring-white shadow-xl' : 'opacity-70 cursor-default'}
                  ${selected ? 'scale-125 -translate-y-4 ring-4 ring-yellow-300' : ''}`}
      style={{ height: small ? 56 : 72 }}>
      <span className="text-white drop-shadow">{label}</span>
    </button>
  );
}

export default function UnoGame({ onBack, game }) {
  const [numPlayers, setNumPlayers] = useState(null);
  const [state, setState] = useState(null);
  const [turn, setTurn] = useState(0);
  const [direction, setDirection] = useState(1); // 1=clockwise, -1=counter
  const [selectedCard, setSelectedCard] = useState(null);
  const [wildPicker, setWildPicker] = useState(null); // index of wild card being played
  const [message, setMessage] = useState('');
  const [winner, setWinner] = useState(null);
  const [calledUno, setCalledUno] = useState({});

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 2000); };

  const startGame = useCallback((n) => {
    setNumPlayers(n);
    setState(initGame(n));
    setTurn(0); setDirection(1); setSelectedCard(null);
    setWildPicker(null); setMessage(''); setWinner(null); setCalledUno({});
  }, []);

  const nextTurn = useCallback((currentTurn, dir, skip = 0) => {
    let next = currentTurn;
    for (let i = 0; i < 1 + skip; i++) {
      next = (next + dir + numPlayers) % numPlayers;
    }
    return next;
  }, [numPlayers]);

  const drawCard = useCallback(() => {
    setState(prev => {
      const s = { ...prev, deck: [...prev.deck], hands: prev.hands.map(h => [...h]) };
      if (!s.deck.length) {
        const top = s.discard.pop();
        s.deck = shuffle(s.discard);
        s.discard = [top];
      }
      if (s.deck.length) {
        const card = s.deck.pop();
        s.hands[turn].push(card);
      }
      return s;
    });
    setTurn(t => nextTurn(t, direction));
    setSelectedCard(null);
  }, [turn, direction, nextTurn]);

  const playCard = useCallback((cardIdx, chosenColor) => {
    const card = state.hands[turn][cardIdx];
    const topCard = state.discard[state.discard.length - 1];

    if (!canPlay(card, topCard, state.currentColor)) return;

    // Wild: need color picker
    if ((card.value === 'Wild' || card.value === 'Wild4') && !chosenColor) {
      setWildPicker(cardIdx);
      return;
    }

    setState(prev => {
      const s = { ...prev, deck: [...prev.deck], hands: prev.hands.map(h => [...h]), discard: [...prev.discard] };
      s.hands[turn] = s.hands[turn].filter((_, i) => i !== cardIdx);
      s.discard.push(card);
      s.currentColor = chosenColor || card.color;
      return s;
    });
    setWildPicker(null);
    setSelectedCard(null);

    // Check win
    if (state.hands[turn].length === 1) { // will be 0 after setState
      setWinner(turn);
      return;
    }

    // Handle effects
    let nextDir = direction;
    let skip = 0;
    let drawPenalty = 0;

    if (card.value === 'Reverse') {
      nextDir = -direction;
      setDirection(nextDir);
      if (numPlayers === 2) skip = 1; // reverse = skip in 2-player
    }
    if (card.value === 'Skip') skip = 1;
    if (card.value === 'Draw2') { drawPenalty = 2; skip = 1; }
    if (card.value === 'Wild4') { drawPenalty = 4; skip = 1; }

    const next = nextTurn(turn, nextDir, skip);

    if (drawPenalty) {
      setState(prev => {
        const s = { ...prev, deck: [...prev.deck], hands: prev.hands.map(h => [...h]) };
        for (let i = 0; i < drawPenalty; i++) {
          if (!s.deck.length) {
            const top = s.discard.pop();
            s.deck = shuffle(s.discard); s.discard = [top];
          }
          if (s.deck.length) s.hands[next].push(s.deck.pop());
        }
        return s;
      });
      showMsg(`Player ${next + 1} draws ${drawPenalty}!`);
    }

    setTurn(next);
  }, [state, turn, direction, numPlayers, nextTurn]);

  if (!numPlayers) return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-yellow-500 to-blue-600">
      <GameHeader game={game} onBack={onBack} />
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-4">
        <div className="text-7xl font-black text-white drop-shadow-2xl">UNO</div>
        <p className="text-white/80">Match colors and numbers! First to empty their hand wins!</p>
        <div className="flex gap-4 flex-wrap justify-center">
          {[2, 3, 4].map(n => (
            <button key={n} onClick={() => startGame(n)}
              className="bg-white text-gray-900 font-black px-8 py-4 rounded-2xl text-xl transition-all hover:scale-105 shadow-xl">
              {n} Players
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (!state) return null;
  const topCard = state.discard[state.discard.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GameHeader game={game} onBack={() => { setNumPlayers(null); setState(null); }}
        extra={<span className="text-white text-sm font-bold">🃏 {state.deck.length} left</span>} />

      {/* Message */}
      {message && <div className="text-center py-1"><span className="text-yellow-300 font-bold animate-pulse">{message}</span></div>}

      {winner !== null && (
        <div className="text-center py-2">
          <span className="text-yellow-400 font-black text-2xl">🏆 Player {winner + 1} wins!</span>
        </div>
      )}

      {/* Wild color picker */}
      {wildPicker !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 text-center">
            <p className="text-white font-black mb-4">Choose a color:</p>
            <div className="grid grid-cols-2 gap-3">
              {COLORS.map(c => (
                <button key={c} onClick={() => playCard(wildPicker, c)}
                  className={`${COLOR_STYLES[c]} rounded-xl py-4 px-8 text-white font-black text-lg hover:scale-105 transition-all`}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other players' hand sizes */}
      <div className="flex justify-center gap-3 px-3 py-2 flex-wrap">
        {Array.from({ length: numPlayers }, (_, i) => i !== turn && (
          <div key={i} className={`text-xs font-bold px-3 py-1 rounded-full border
                                    ${i === turn ? 'bg-white text-gray-900' : 'border-white/30 text-white/70'}`}>
            P{i + 1}: {state.hands[i].length} cards
            {state.hands[i].length === 1 && ' 🔔 UNO!'}
          </div>
        ))}
      </div>

      {/* Center: top card + current color */}
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="flex items-center gap-4">
          <div className="text-white/50 text-sm">Current color:</div>
          <div className={`w-8 h-8 rounded-full border-4 border-white/50 ${COLOR_STYLES[state.currentColor] || 'bg-gray-700'}`} />
        </div>
        <div className="relative">
          <CardView card={topCard} playable={false} small={false} />
          {topCard.color !== state.currentColor && (
            <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-white ${COLOR_STYLES[state.currentColor]}`} />
          )}
        </div>
        <div className="text-white/50 text-xs">Discard pile</div>
      </div>

      {/* Current player */}
      {winner === null && (
        <div className="text-center py-1">
          <span className="bg-white/20 text-white font-black px-4 py-1 rounded-full text-sm">
            🎮 Player {turn + 1}'s turn — {state.hands[turn].length} cards
          </span>
        </div>
      )}

      {/* Current player's hand */}
      {winner === null && (
        <div className="px-3 py-3">
          <p className="text-white/50 text-xs text-center mb-2">Your cards — tap to play</p>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {state.hands[turn].map((card, idx) => {
              const playable = canPlay(card, topCard, state.currentColor);
              return (
                <CardView
                  key={idx}
                  card={card}
                  playable={playable}
                  selected={selectedCard === idx}
                  onClick={() => {
                    if (!playable) return;
                    if (selectedCard === idx) playCard(idx);
                    else setSelectedCard(idx);
                  }}
                  small={state.hands[turn].length > 8}
                />
              );
            })}
          </div>
          <div className="text-center text-white/40 text-xs mt-2">Tap once to select, tap again to play</div>
          <div className="flex justify-center gap-3 mt-3">
            <button onClick={drawCard}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-2 rounded-xl text-sm transition-all">
              Draw Card
            </button>
            {state.hands[turn].length === 2 && (
              <button onClick={() => { setCalledUno(p => ({ ...p, [turn]: true })); showMsg('UNO! 🔔'); }}
                className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-2 rounded-xl text-sm transition-all animate-pulse">
                UNO! 🔔
              </button>
            )}
          </div>
        </div>
      )}

      {winner !== null && (
        <div className="flex justify-center gap-3 py-4">
          <button onClick={() => startGame(numPlayers)} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-6 py-2 rounded-xl transition-all hover:scale-105">
            Play Again
          </button>
          <button onClick={() => { setNumPlayers(null); setState(null); }} className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-2 rounded-xl">
            Menu
          </button>
        </div>
      )}
    </div>
  );
}
