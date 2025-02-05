class AppAuthentication {
  private _token: string = '';

  constructor() {}

  setToken(token: string) {
    this._token = token;
  }

  getToken() {
    return this._token;
  }
}

export const appAuthentication = new AppAuthentication();
