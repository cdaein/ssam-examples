try {
  // defined in env via CLI
  await import(/* @vite-ignore */ `./${window.SKETCH}.ts`);
} catch (e) {
  console.error(`module import error:`, e);
}
export {};
