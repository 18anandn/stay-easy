export enum Subdomain {
  ADMIN = 'admin',
  OWNER = 'owner',
  AUTH = 'auth',
  MAIN = 'main',
}

export const getSubdomain = () => {
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  
  if (subdomain === Subdomain.ADMIN) return Subdomain.ADMIN;
  if (subdomain === Subdomain.OWNER) return Subdomain.OWNER;
  if (subdomain === Subdomain.AUTH) return Subdomain.AUTH;

  return Subdomain.MAIN;
};
