export const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const getInitials = (user: any) => {
  const first = String(user?.first_name || '').trim();
  const last = String(user?.last_name || '').trim();
  if (first || last) {
    return `${first[0] || ''}${last[0] || ''}`.trim().toUpperCase();
  }
  const username = String(user?.username || '').trim();
  return username ? username.slice(0, 2).toUpperCase() : 'GU';
};

