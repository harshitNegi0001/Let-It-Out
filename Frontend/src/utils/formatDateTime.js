

export const formatTime = (dateStr) => {
  if (!dateStr) return '';

  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
};


export const formatDate = (dateStr) => {
  if (!dateStr) return '';

  const input = new Date(dateStr);
  const now = new Date();

  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const inputDay = startOfDay(input);
  const today = startOfDay(now);

  const diffDays = Math.round(
    (today - inputDay) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return input.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
