export const serverConfig = {
  api: import.meta.env.DEV
    ? 'http://localhost:3000/api'
    : 'https://cbdc-markka-server.onrender.com',
};

export function withApi(...pathname: string[]) {
  return [serverConfig.api, pathname.join('/')].join('/');
}
