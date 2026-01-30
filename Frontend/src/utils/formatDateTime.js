

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

export const timeCount = (createdAt) => {
  if (!createdAt) return '';

  const postDate = new Date(createdAt);
  const now = new Date();

  const diffMs = now - postDate;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  // 🔹 Recent first (priority)
  if (diffMs < minute) return 'just now';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;

  // 🔹 Same calendar day but older
  if (postDate.toDateString() === now.toDateString()) {
    return `today at ${postDate
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase()}`;
  }

  // 🔹 Older dates
  if (diffMs < month) return `${Math.floor(diffMs / day)}d ago`;
  if (diffMs < year) return `${Math.floor(diffMs / month)}mon ago`;

  return `${Math.floor(diffMs / year)}yr ago`;
}
