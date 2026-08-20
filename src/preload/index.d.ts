export interface MyWordsBridge {
  versions: {
    app: string;
  };
}

declare global {
  interface Window {
    myWords: MyWordsBridge;
  }
}
