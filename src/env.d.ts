/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_COOKIE_NAME: string;
  readonly VITE_COOKIE_AGE: number;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
