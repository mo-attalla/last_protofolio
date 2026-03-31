export const SITE_CONFIG = {
  name: "Mohamed Attalla",
  title: "Graphic Designer",
  services: [
    "Social Media Design",
    "Advertising Design",
    "Editorial Design",
    "Branding",
    "Sports Branding",
    "UI/UX Principles",
  ],
} as const;

/** Short blurbs per service — edit here or move to CMS later. */
export const SERVICE_DETAILS: Record<
  (typeof SITE_CONFIG.services)[number],
  string
> = {
  "Social Media Design":
    "Campaign-ready grids, motion-minded stills, and visuals built for platforms that move fast.",
  "Advertising Design":
    "Concept-to-layout creatives for print and digital campaigns with a sharp, memorable tone.",
  "Editorial Design":
    "Structured layouts and print-ready typography with an obsessive focus on readability.",
  "Branding":
    "Visual identities and comprehensive design systems built for scale and impact.",
  "Sports Branding":
    "High-energy match-day graphics, posters, and dynamic visual storytelling.",
  "UI/UX Principles":
    "Interfaces and flows that feel intentional—clarity first, style that supports the product.",
};

export const SITE_EMAIL = "265moabdou@gmail.com";
export const SITE_PHONE = "+20 106 808 3975";

export const SITE_TAGLINE = "Design with restraint, built for impact.";

/** Placeholder hrefs — replace with real profiles when ready. */
export const SOCIAL_LINKS = [
  { label: "Behance", href: "https://www.behance.net/mohamedabdoua" },
  { label: "Portfolio", href: "https://drive.google.com/file/d/15rQCh0wlxoKU8WU2r6M3YVNkCaY1agkX/view?usp=drive_link" },
  { label: "LinkedIn", href: "https://drive.google.com/file/d/15rQCh0wlxoKU8WU2r6M3YVNkCaY1agkX/view?usp=drive_link" },
] as const;

export const ABOUT_INTRO =
  "Graphic Designer focused on branding, editorial systems, and high-impact visual storytelling.";

export const ABOUT_DETAIL =
  "I combine an engineering mindset with deliberate creative discipline. Every project—whether it's an expansive brand identity, structured editorial layout, or dynamic sports visuals—is built to be strategic, striking, and entirely intentional.";

export const EXPERIENCE_DATA = [
  {
    role: "Founder & Lead Designer",
    company: "ektbly",
    date: "2022 – Present",
    description: "Premium educational book design. End-to-end visual identities and print-ready typography."
  },
  {
    role: "Visual Content Lead",
    company: "KOVO",
    date: "Jan 2026 – Present",
    description: "Directing brand development and campaign visual strategy alongside the creative team."
  },
  {
    role: "Graphic Designer",
    company: "Ezz Agency",
    date: "Jan 2023 – May 2025",
    description: "High-paced commercial campaigns, social media grids, and advertising creatives."
  },
  {
    role: "Freelance Designer",
    company: "Independent",
    date: "2022 – Present",
    description: "Specialized in sports branding, product manipulation, and dynamic e-commerce layouts."
  }
];

export const SKILLS_DATA = [
  "Branding", 
  "Editorial Design", 
  "Book Layout", 
  "Social Media Graphics", 
  "Sports Manipulation", 
  "UI/UX Principles"
];

export const SOFTWARE_DATA = [
  { name: "Adobe Photoshop", level: "Advanced" },
  { name: "Adobe InDesign", level: "Advanced" },
  { name: "Adobe Illustrator", level: "Intermediate" },
  { name: "Adobe Premiere Pro", level: "Basic" }
];

export const LEADERSHIP_DATA = [
  "OGV Member — AIESEC in Egypt (2024)",
  "Active Member — GDG Zagazig",
  "Member — ZigZag Club"
];

export const EDUCATION_DATA = {
  degree: "Electronics & Communication Engineering",
  school: "Zagazig University",
  date: "Expected 2028"
};

/** Section ids used for in-page navigation (must match section `id` attributes). */
export const NAV_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Latest" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
] as const;
