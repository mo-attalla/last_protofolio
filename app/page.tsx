import fs from "fs";
import path from "path";
import { AppChrome } from "@/components/AppChrome";
import { SiteNavigation } from "@/components/SiteNavigation";
import { LoadingScreen } from "@/components/motion/LoadingScreen";
import { AboutSection } from "@/sections/AboutSection";
import { ContactSection } from "@/sections/ContactSection";
import { HeroSection } from "@/sections/HeroSection";
import { ExperienceSection } from "@/sections/ExperienceSection";
import { PortfolioSection } from "@/sections/PortfolioSection";
import { ProjectsSection } from "@/sections/ProjectsSection";
import { ServicesSection } from "@/sections/ServicesSection";

export default function Home() {
  const projectsDir = path.join(process.cwd(), "public/images/projects");
  let projectImages: string[] = [];
  try {
    const files = fs.readdirSync(projectsDir);
    projectImages = files
      .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .map((file) => `/images/projects/${file}`);
  } catch {
    // folder missing or empty
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <AppChrome />
      <LoadingScreen />
      <SiteNavigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ExperienceSection />
      <ProjectsSection images={projectImages} />
      <PortfolioSection />
      <ContactSection />
    </main>
  );
}
