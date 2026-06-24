export class ApiInterface {
  private api: string;

  constructor(api: string) {
    this.api = api;
  }

  private asJson(config: any) {
    return {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'application/json',
      },
    };
  }

  public withApi(...pathname: string[]) {
    return [this.api, pathname.join('/')].join('/');
  }

  /**Creates a new transaction. */
  public async createTransaction(data: any) {
    return await fetch(
      this.withApi('transactions'),
      this.asJson({
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
      }),
    );
  }

  /**Fetches the account; including the latest transactions, of a user. */
  public async getAccount() {
    return await fetch(this.withApi('accounts'), {
      method: 'GET',
      credentials: 'include',
    });
  }

  /**Fetches the session of the current authenticated user*/
  public async getSession() {
    return await fetch(this.withApi('auth/session'), {
      method: 'GET',
      credentials: 'include',
    });
  }

  /**Registers a new user. */
  public async registerUser(credentials: { email: string; password: string; password2: string }) {
    return await fetch(
      this.withApi('auth/register'),
      this.asJson({
        method: 'POST',
        body: JSON.stringify(credentials),
        credentials: 'include',
      }),
    );
  }

  /**Verifies a user by id. */
  public async verifyUserById(credentials: { token: string }) {
    return await fetch(
      this.withApi('auth/verify-email'),
      this.asJson({
        method: 'POST',
        body: JSON.stringify(credentials),
        credentials: 'include',
      }),
    );
  }

  /**Logs a user in. */
  public async loginUser(credentials: any) {
    return await fetch(
      this.withApi('auth/login'),
      this.asJson({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(credentials),
      }),
    );
  }

  /**Logs a user out. */
  public async logoutUser() {
    return await fetch(this.withApi('auth/logout'), {
      method: 'PUT',
      credentials: 'include',
    });
  }
  /**Returns a payment session by its id. */
  public async getPaymentSession(id: string) {
    return await fetch(this.withApi('payment-session', id), {
      credentials: 'include',
      method: 'GET',
    });
  }

  /**Resets the users password. */
  public async resetPassword(payload: { token: string; password: string; password2: string }) {
    return await fetch(
      this.withApi('auth/reset-password'),
      this.asJson({
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  }

  /**Sends a password reset email to the user. */
  public async forgotPassword(payload: { email: string }) {
    return await fetch(
      this.withApi('auth/forgot-password'),
      this.asJson({
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  }
}
