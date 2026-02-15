export const serverConfig = {
  api: import.meta.env.DEV ? 'http://localhost:3000/api' : null,
};

export function withApi(...pathname: string[]) {
  return [serverConfig.api, pathname.join('/')].join('/');
}
