declare global {
  interface Window {
    SKETCH: string;
  }
}

try {
  // defined in env via CLI
  // SKETCH=<sketch-name> npm run dev
  await import(/* @vite-ignore */ `./${window.SKETCH}.ts`);
} catch (e) {
  console.error(`module import error:`, e);
}

export {};
