export class ApiInterface {
  private api: string;

  constructor(api: string) {
    this.api = api;
  }

  public withApi(...pathname: string[]) {
    return [this.api, pathname.join('/')].join('/');
  }

  public async sendMoney(data: any) {
    return await fetch(this.withApi('transactions'), {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
