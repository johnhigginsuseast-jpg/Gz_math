if (new URLSearchParams(location.search).get('lesson') === 'line-circle') {
  await import('./app.mjs');
} else {
  await import('./module-app.mjs');
}
