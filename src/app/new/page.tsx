// app/new/page.tsx
// ------------------------------------------------------------
// Reuse the edit page component for the /new route.
// When mounted under /new, there is no albumId in the URL.
// The edit page logic detects the absence of albumId and
// automatically switches to "create" mode, using POST instead of PUT.
// ------------------------------------------------------------

// Re-export the default export from the edit route
export { default } from "../edit/[albumid]/page";

