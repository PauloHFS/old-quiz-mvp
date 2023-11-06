export const getURL = () => {
  let url =
    import.meta.env.VITE_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    import.meta.env.VITE_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:5173/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};
