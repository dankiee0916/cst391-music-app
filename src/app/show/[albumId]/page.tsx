// app/show/[albumId]/page.tsx
// -----------------------------------------------
// Reuse the edit page component for the /show route.
// When mounted under /show, the edit page will detect
// "read-only" mode and display a view-only Album screen.
// -----------------------------------------------

export { default } from "@/app/edit/[albumId]/page";
