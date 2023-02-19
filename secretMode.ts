type Callback = (result: boolean) => void;

const isIE = (ua: string): boolean => /msie|trident|edge/.test(ua);

const isChrome = (ua: string): boolean => /chrome/.test(ua);

const isSafari = (ua: string): boolean => /safari/.test(ua);

const isFirefox = (ua: string): boolean => /firefox/.test(ua);

const hasIndexedDB = (): boolean => {
  const indexedDB =
    window.indexedDB ||
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB;
  return !!indexedDB;
};

const hasPointerEvent = (): boolean =>
  !!(window.PointerEvent || (window as any).MSPointerEvent);

const requestFileSystem = (size: number): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const request =
      (window as any).RequestFileSystem ||
      (window as any).webkitRequestFileSystem;
    if (request) {
      request(
        (window as any).TEMPORARY,
        size,
        (fs) => resolve(),
        (err) => reject(err)
      );
    } else {
      resolve();
    }
  });
};

const testDatabase = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const db = window.indexedDB.open('test');
    db.onerror = () => {
      reject(new Error('Database error'));
    };
    db.onsuccess = () => {
      resolve();
    };
  });
};

const testLocalStorage = (): boolean => {
  try {
    window.localStorage.setItem('__test__', '__test__');
    window.localStorage.removeItem('__test__');
    return true;
  } catch {
    return false;
  }
};

const testSessionStorage = (): boolean => {
  try {
    window.sessionStorage.setItem('__test__', '__test__');
    window.sessionStorage.removeItem('__test__');
    return true;
  } catch {
    return false;
  }
};

export const isSecretMode = (callback: Callback): void => {
  const ua = window.navigator.userAgent.toLowerCase();

  const tests = [
    [isIE(ua) && !hasIndexedDB() && hasPointerEvent()],
    [
      isChrome(ua) &&
        requestFileSystem(100)
          .then(() => true)
          .catch(() => false),
    ],
    [
      isSafari(ua) &&
        testDatabase()
          .then(() => true)
          .catch(() => false),
    ],
    [
      isFirefox(ua) &&
        testDatabase()
          .then(() => true)
          .catch(() => false),
    ],
    [!testLocalStorage(), !testSessionStorage()],
  ];

  const results = [].concat(...tests);
  const isSecret = results.some((result) => result === true);

  callback(isSecret);
};
