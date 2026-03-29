import { leagueAccentMap } from '../data/leagues.js';
import { API_BASE } from '../core/api.js';

const quizLeagueSelect = document.querySelector('#quiz-league');
const quizCards = Array.from(document.querySelectorAll('.quiz-card'));

const quizOverlay = document.querySelector('#quiz-overlay');
const quizExitBtn = document.querySelector('#quiz-exit');
const quizStageCompetition = document.querySelector('#quiz-stage-competition');
const quizStageDifficulty = document.querySelector('#quiz-stage-difficulty');
const quizStageScore = document.querySelector('#quiz-stage-score');
const quizProgressBar = document.querySelector('#quiz-progress-bar');
const quizQuestionEl = document.querySelector('#quiz-question');
const quizOptionsEl = document.querySelector('#quiz-options');
const quizActionsEl = document.querySelector('#quiz-actions');

const COMPETITION_LABELS = {
  premier: 'Premier League',
  championship: 'EFL Championship',
  seriea: 'Serie A',
  laliga: 'LaLiga',
  bundesliga: 'Bundesliga',
  ligue1: 'Ligue 1',
  ucl: 'Champions League'
};

const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
};

const clampInt = (value, min, max) => {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
};

let state = null;

export const setQuizAccent = (leagueId) => {
  if (!leagueId) return;
  const color = leagueAccentMap[leagueId];
  if (color) {
    document.documentElement.style.setProperty('--quiz-accent', color);
  }
};

const ensureCountBadge = (card) => {
  if (!card) return null;
  const head = card.querySelector('.quiz-head');
  if (!head) return null;

  const existing = head.querySelector('.quiz-count-badge');
  if (existing) return existing;

  const badge = document.createElement('span');
  badge.className = 'quiz-count-badge';
  badge.textContent = '—';

  const dice = head.querySelector('.quiz-dice');
  if (dice) head.insertBefore(badge, dice);
  else head.appendChild(badge);

  return badge;
};

const fetchCounts = async (competition) => {
  const params = new URLSearchParams({ competition });
  const res = await fetch(`${API_BASE}/quiz/count?${params.toString()}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(String(data?.error || 'Quiz count error'));
  return data?.counts && typeof data.counts === 'object' ? data.counts : null;
};

const setCardCounts = (counts) => {
  quizCards.forEach((card) => {
    const difficulty = card.dataset.quizDifficulty || 'easy';
    const badge = ensureCountBadge(card);
    if (!badge) return;

    if (!counts) {
      badge.textContent = '—';
      badge.classList.remove('is-empty');
      return;
    }

    const n = Number(counts[difficulty] ?? 0);
    badge.textContent = `${Number.isFinite(n) ? n : 0} Q`;
    badge.classList.toggle('is-empty', !n);
  });
};

const refreshCounts = async () => {
  const competition = quizLeagueSelect?.value;
  if (!competition) return setCardCounts(null);

  try {
    const counts = await fetchCounts(competition);
    setCardCounts(counts);
  } catch (err) {
    setCardCounts(null);
    console.warn('Unable to load quiz question counts.', err);
  }
};

const openOverlay = () => {
  if (!quizOverlay) return;
  quizOverlay.classList.remove('is-hidden');
  quizOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('quiz-overlay-open');
};

const closeOverlay = () => {
  if (!quizOverlay) return;
  quizOverlay.classList.add('is-hidden');
  quizOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('quiz-overlay-open');
  state = null;

  if (quizQuestionEl) quizQuestionEl.textContent = '';
  if (quizOptionsEl) quizOptionsEl.innerHTML = '';
  if (quizActionsEl) quizActionsEl.innerHTML = '';
  if (quizProgressBar) quizProgressBar.style.width = '0%';
  if (quizStageScore) quizStageScore.textContent = 'Score: 0';
};

const normalizeOptionLabel = (index) => String.fromCharCode(65 + index);

const setStageMeta = ({ competition, difficulty, score, index, total }) => {
  if (quizStageCompetition) {
    quizStageCompetition.textContent = COMPETITION_LABELS[competition] || competition;
  }
  if (quizStageDifficulty) {
    quizStageDifficulty.textContent = DIFFICULTY_LABELS[difficulty] || difficulty;
  }
  if (quizStageScore) {
    quizStageScore.textContent = `Score: ${score}`;
  }
  if (quizProgressBar) {
    const pct = total ? Math.round((index / total) * 100) : 0;
    quizProgressBar.style.width = `${pct}%`;
  }
};

const renderFinished = () => {
  if (!state) return;
  setStageMeta({
    competition: state.competition,
    difficulty: state.difficulty,
    score: state.score,
    index: state.questions.length,
    total: state.questions.length
  });

  if (quizQuestionEl) {
    quizQuestionEl.textContent = `Finished! You scored ${state.score} / ${state.questions.length}.`;
  }
  if (quizOptionsEl) quizOptionsEl.innerHTML = '';
  if (quizActionsEl) {
    quizActionsEl.innerHTML = '';
    const againBtn = document.createElement('button');
    againBtn.type = 'button';
    againBtn.className = 'quiz-next-btn';
    againBtn.textContent = 'Play Again';
    againBtn.addEventListener('click', () => {
      const { competition, difficulty } = state;
      startQuiz({ competition, difficulty });
    });
    quizActionsEl.appendChild(document.createElement('div'));
    quizActionsEl.appendChild(againBtn);
  }
};

const renderQuestion = () => {
  if (!state) return;
  const current = state.questions[state.index];
  if (!current) return renderFinished();

  setStageMeta({
    competition: state.competition,
    difficulty: state.difficulty,
    score: state.score,
    index: state.index,
    total: state.questions.length
  });

  if (quizQuestionEl) {
    quizQuestionEl.textContent = `Q${state.index + 1}. ${current.prompt}`;
  }

  if (quizOptionsEl) {
    quizOptionsEl.innerHTML = '';
    current.options.forEach((text, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option-btn';
      btn.textContent = `${normalizeOptionLabel(idx)}) ${text}`;
      btn.addEventListener('click', () => {
        if (!state || state.answered) return;
        state.answered = true;

        const correct = idx === current.correctIndex;
        if (correct) state.score += 1;

        const optionBtns = Array.from(quizOptionsEl.querySelectorAll('.quiz-option-btn'));
        optionBtns.forEach((b, bIdx) => {
          b.disabled = true;
          if (bIdx === current.correctIndex) b.classList.add('correct');
          if (bIdx === idx && !correct) b.classList.add('wrong');
        });

        setStageMeta({
          competition: state.competition,
          difficulty: state.difficulty,
          score: state.score,
          index: state.index,
          total: state.questions.length
        });

        if (quizActionsEl) {
          quizActionsEl.innerHTML = '';
          const result = document.createElement('div');
          result.className = 'quiz-result';
          if (correct) {
            result.textContent = 'Correct!';
          } else {
            const correctLetter = normalizeOptionLabel(current.correctIndex);
            result.textContent = `Wrong. Correct answer: ${correctLetter}`;
          }

          const nextBtn = document.createElement('button');
          nextBtn.type = 'button';
          nextBtn.className = 'quiz-next-btn';
          nextBtn.textContent =
            state.index === state.questions.length - 1 ? 'Finish' : 'Next';
          nextBtn.addEventListener('click', () => {
            if (!state) return;
            state.index += 1;
            state.answered = false;
            renderQuestion();
          });

          quizActionsEl.appendChild(result);
          quizActionsEl.appendChild(nextBtn);
        }
      });
      quizOptionsEl.appendChild(btn);
    });
  }

  if (quizActionsEl) quizActionsEl.innerHTML = '';
};

const fetchQuestions = async ({ competition, difficulty, limit }) => {
  const safeLimit = clampInt(limit, 5, 30);
  const params = new URLSearchParams({
    competition,
    difficulty,
    limit: String(safeLimit)
  });
  const res = await fetch(`${API_BASE}/quiz/questions?${params.toString()}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(String(data?.error || 'Quiz API error'));
  return Array.isArray(data?.questions) ? data.questions : [];
};

const startQuiz = async ({ competition, difficulty }) => {
  if (!quizOverlay || !quizQuestionEl || !quizOptionsEl || !quizActionsEl) return;

  openOverlay();
  if (quizQuestionEl) quizQuestionEl.textContent = 'Loading quiz...';
  if (quizOptionsEl) quizOptionsEl.innerHTML = '';
  if (quizActionsEl) quizActionsEl.innerHTML = '';

  let questions = [];
  let loadError = null;
  try {
    questions = await fetchQuestions({ competition, difficulty, limit: 10 });
  } catch (err) {
    loadError = err instanceof Error ? err : new Error('Unable to load quiz questions');
    questions = [];
  }

  if (!questions.length) {
    setStageMeta({ competition, difficulty, score: 0, index: 0, total: 1 });
    if (loadError) {
      quizQuestionEl.textContent = 'Quiz server is not reachable right now.';
    } else {
      quizQuestionEl.textContent = 'No questions found for this competition + difficulty yet.';
    }
    quizOptionsEl.innerHTML = '';
    quizActionsEl.innerHTML = '';
    const hint = document.createElement('div');
    hint.className = 'quiz-result';
    if (loadError) {
      hint.textContent = `Start the backend API (expected at ${API_BASE}), then try again.`;
      // Helpful for debugging in devtools without breaking the UI.
      console.error('Quiz load failed:', loadError);
    } else {
      hint.textContent = 'Add questions to the database, then try again.';
    }
    quizActionsEl.appendChild(hint);
    return;
  }

  state = {
    competition,
    difficulty,
    questions,
    index: 0,
    score: 0,
    answered: false
  };

  renderQuestion();
};

export const initQuiz = () => {
  if (quizLeagueSelect) {
    quizLeagueSelect.addEventListener('change', () => {
      setQuizAccent(quizLeagueSelect.value);
      refreshCounts();
    });
  }

  const initialLeague = document.querySelector('.sidebar-item.active')?.dataset.league;
  if (quizLeagueSelect && !quizLeagueSelect.value && initialLeague) {
    quizLeagueSelect.value = initialLeague;
  }
  if (quizLeagueSelect?.value) {
    setQuizAccent(quizLeagueSelect.value);
  }

  quizCards.forEach((card) => {
    ensureCountBadge(card);
    const body = card.querySelector('.quiz-body');
    if (!body) return;

    const startBtn = document.createElement('button');
    startBtn.type = 'button';
    startBtn.className = 'quiz-start-btn';
    startBtn.innerHTML = '<span>Start</span><span aria-hidden="true">&#9654;</span>';

    const hint = document.createElement('div');
    hint.className = 'quiz-start-hint';
    hint.textContent = 'Select a competition above, then start the quiz.';

    startBtn.addEventListener('click', () => {
      const competition = quizLeagueSelect?.value;
      const mode = card.dataset.quizMode || 'single';
      const difficulty = card.dataset.quizDifficulty || 'easy';

      if (!competition) {
        hint.textContent = 'Pick a competition first.';
        quizLeagueSelect?.focus();
        return;
      }

      if (mode !== 'single') {
        hint.textContent = 'Online mode coming soon.';
        return;
      }

      startQuiz({ competition, difficulty });
    });

    body.innerHTML = '';
    body.appendChild(startBtn);
    body.appendChild(hint);
  });

  quizExitBtn?.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && quizOverlay && !quizOverlay.classList.contains('is-hidden')) {
      closeOverlay();
    }
  });

  refreshCounts();
};
