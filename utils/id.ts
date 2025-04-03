export const getRandomId = () => self.crypto.randomUUID();

export const getShortBase64Id = () => {
  const uuid = self.crypto.randomUUID().replace(/-/g, '');
  if (!uuid) return 'Error';
  return btoa(uuid).slice(0, 8);
};
