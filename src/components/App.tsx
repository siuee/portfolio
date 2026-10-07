import { Suspense } from "react";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import RevealObserver from "./ui/RevealObserver";
import { SmoothScroll } from "@/lib/scroll";

/**
 * Section order: Hero → About → Skills → Work → Experience → Contact.
 * Certifications and Achievements are omitted: the resume lists none.
 * Each section sits in its own Suspense boundary so React hydrates them as
 * separate tasks instead of one long main-thread block.
 */
export default function App() {
  return (
    <>
      <SmoothScroll />
      <RevealObserver />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Hero />
        {[About, Skills, Work, Experience, Contact].map((Section, i) => (
          <Suspense key={i}>
            <Section />
          </Suspense>
        ))}
      </main>
      <Footer />
      <style href="app" precedence="default">{`
        .skip-link{position:fixed;left:12px;top:12px;z-index:100;padding:10px 16px;border-radius:999px;background:var(--ink);color:#fff;font-size:14px;transform:translateY(-160%);transition:transform .4s var(--ease)}
        .skip-link:focus{transform:none}
        main:focus{outline:none}
      `}</style>
    </>
  );
}
