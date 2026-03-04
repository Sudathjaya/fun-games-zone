import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

/**
 * Save a score to Firestore for the current user.
 * Only updates if the new score is higher than the existing best.
 * Also updates the global leaderboard for this game.
 *
 * @param {string} gameId - e.g. 'memory', '2048', 'snake'
 * @param {number} score  - the score to save
 */
export async function saveScore(gameId, score) {
  const user = auth.currentUser;
  if (!user) return; // anonymous — nothing to save

  const scoreRef = doc(db, 'users', user.uid, 'scores', gameId);
  const snap = await getDoc(scoreRef);

  if (snap.exists() && snap.data().best >= score) return; // not a new high score

  // Save user's best
  await setDoc(scoreRef, { best: score, updatedAt: serverTimestamp() });

  // Update global leaderboard
  const lbRef = doc(db, 'leaderboard', gameId, 'entries', user.uid);
  await setDoc(lbRef, {
    name:      user.displayName || 'Player',
    photoURL:  user.photoURL   || '',
    score,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
