// app/about/page.tsx
// SSR AboutBox page for Francisco's Music App

import Link from "next/link";

export const metadata = {
  title: "About - Francisco's Music App",
};

export default function AboutPage() {
  return (
    <main className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h1 className="h4 mb-0">About Me</h1>
        </div>

        <div className="card-body">
          <p className="card-text">
            My name is Francisco Gonzalez and I am a student at Grand Canyon University.
          </p>

          <p className="card-text">
            Boss: <strong>Francisco Gonzalez</strong>
          </p>

          <p className="card-text">
            This About box is rendered on the <strong>server</strong> by Next.js.
          </p>

          <Link href="/" className="btn btn-primary">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
