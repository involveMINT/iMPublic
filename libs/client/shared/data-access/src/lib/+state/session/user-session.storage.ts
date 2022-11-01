export class LocalStorageManager<T> {
  constructor(private readonly key: string) {}

  setValue(data: T): T {
    localStorage.setItem(this.key, JSON.stringify(data));
    return data;
  }

  getValue(): T | undefined {
    const val = localStorage.getItem(this.key);
    return val ? JSON.parse(val) : undefined;
  }

  delete() {
    localStorage.removeItem(this.key);
  }
}

export const ImAuthTokenStorage = new LocalStorageManager<{ id: string; token: string }>(
  'involvemint-auth-token'
);
