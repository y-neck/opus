// Display preamble in html head
export default defineNuxtPlugin(() => {
  if (typeof document !== 'undefined') {
    // Create custom preamble to show in inspector
    const preamble =
      document.createComment(`Hi, welcome to this page. Discover more on https://github.com/y-neck/opus`);

    // Add preamble before html tag
    document.documentElement.parentNode?.insertBefore(
      preamble,
      document.documentElement
    );
  }
});
