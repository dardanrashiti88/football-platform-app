export const initMatch = () => {
  const applyRatingColors = () => {
    const ratings = Array.from(document.querySelectorAll('.stat-rating'));
    if (!ratings.length) return;

    let maxValue = -Infinity;
    ratings.forEach((el) => {
      const raw = el.textContent || '';
      const value = parseFloat(raw);
      if (Number.isFinite(value)) {
        maxValue = Math.max(maxValue, value);
      }
    });

    ratings.forEach((el) => {
      const raw = el.textContent || '';
      const value = parseFloat(raw);
      el.classList.remove('rating-low', 'rating-mid', 'rating-high', 'rating-top');
      if (!Number.isFinite(value)) return;

      if (value <= 5.9) {
        el.classList.add('rating-low');
      } else if (value <= 6.9) {
        el.classList.add('rating-mid');
      } else {
        el.classList.add('rating-high');
      }

      if (value === maxValue) {
        el.classList.add('rating-top');
      }
    });
  };

  applyRatingColors();
};
