const isSafeUrl = (input) => {
  let urlString = '';
  if (typeof input === 'string') {
    urlString = input;
  } else if (input instanceof URL) {
    urlString = input.href;
  } else if (input instanceof Request) {
    urlString = input.url;
  }

  if (!urlString) return false;

  try {
    // If running in browser context, validate against the current origin
    if (typeof window !== 'undefined') {
      const url = new URL(urlString, window.location.origin);
      return url.origin === window.location.origin;
    }

    new URL(urlString);
    return false; // If it parsed without a base, it's an absolute URL
  } catch {
    return true;
  }
};

// Simulate browser environment
global.window = {
  location: {
    origin: 'https://neon-notes.vercel.app'
  }
};

console.log(isSafeUrl('//attacker.com')); // Should be false
console.log(isSafeUrl('api/data')); // Should be true
console.log(isSafeUrl('/api/data')); // Should be true
console.log(isSafeUrl('https://neon-notes.vercel.app/api')); // Should be true
console.log(isSafeUrl('https://external-api.com/data')); // Should be false
