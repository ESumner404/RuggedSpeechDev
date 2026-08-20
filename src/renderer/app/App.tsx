export function App() {
  // Phase 0 acceptance: confirm window.isSecureContext is true in the
  // packaged build. Photo capture in Phase 4 depends on it.
  console.log('isSecureContext:', window.isSecureContext);

  return <p class="hello">hello</p>;
}
