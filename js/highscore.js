/**
 * High Score System for FunWebGames
 * Uses localStorage to persist high scores across sessions
 * 
 * Usage:
 *   HighScore.set('color-match', 'moves', 25);  // Lower is better
 *   HighScore.set('bubble-pop', 'score', 150);  // Higher is better
 *   const best = HighScore.get('color-match', 'moves');
 *   HighScore.reset();  // Clear all scores
 */

const HighScore = (function() {
  const STORAGE_KEY = 'funwebgames-highscores';
  
  // Load scores from localStorage
  function loadScores() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('HighScore: Could not load scores', e);
      return {};
    }
  }
  
  // Save scores to localStorage
  function saveScores(scores) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {
      console.warn('HighScore: Could not save scores', e);
    }
  }
  
  // Get high score for a game and metric
  // metricType: 'low' means lower is better (moves), 'high' means higher is better (score)
  function get(game, metric) {
    const scores = loadScores();
    if (scores[game] && scores[game][metric] !== undefined) {
      return scores[game][metric];
    }
    return null;
  }
  
  // Set high score for a game and metric
  // metricType: 'low' means lower is better (moves), 'high' means higher is better (score)
  function set(game, metric, value, metricType = 'low') {
    const scores = loadScores();
    
    if (!scores[game]) {
      scores[game] = {};
    }
    
    const currentBest = scores[game][metric];
    
    // Update if no existing score or if new score is better
    if (currentBest === null || currentBest === undefined) {
      scores[game][metric] = value;
      saveScores(scores);
      return true; // New record
    }
    
    if (metricType === 'low') {
      // Lower is better (e.g., moves, time)
      if (value < currentBest) {
        scores[game][metric] = value;
        saveScores(scores);
        return true; // New record
      }
    } else {
      // Higher is better (e.g., score, points)
      if (value > currentBest) {
        scores[game][metric] = value;
        saveScores(scores);
        return true; // New record
      }
    }
    
    return false; // Not a new record
  }
  
  // Check if a score exists
  function has(game, metric) {
    return get(game, metric) !== null;
  }
  
  // Reset all scores
  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
  
  // Reset scores for a specific game
  function resetGame(game) {
    const scores = loadScores();
    if (scores[game]) {
      delete scores[game];
      saveScores(scores);
    }
  }
  
  // Get all scores (for debugging)
  function getAll() {
    return loadScores();
  }
  
  // Format score display with label
  function display(game, metric, label = 'Best') {
    const score = get(game, metric);
    if (score !== null) {
      return `${label}: ${score}`;
    }
    return '';
  }
  
  // Public API
  return {
    get,
    set,
    has,
    reset,
    resetGame,
    getAll,
    display
  };
})();

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HighScore;
}
