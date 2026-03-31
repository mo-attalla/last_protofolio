export type ProjectItem = {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  slug: string;
  year?: string;
  /** Optional one-line summary — shows in the showcase when set. */
  description?: string;
};

/*
 * Start with an empty list to keep this section fake-content free.
 * Add items here later and the Projects section will scale naturally.
 */
export const projects: ProjectItem[] = [];
