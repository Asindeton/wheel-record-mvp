/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_COOKIE_NAME: string;
  readonly VITE_COOKIE_AGE: number;
  readonly VITE_SHOP_ID: number;
  readonly VITE_AUTH_TOKEN: string;
  readonly VITE_AUTH_TYPE: string;
  readonly VITE_PROXY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
