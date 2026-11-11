/** The Light / Dark choice on the projects page, shared with the project popup and page. */
export type ProjectsTheme = "light" | "dark";

const KEY = "studio-projects-theme";

export function readProjectsTheme(): ProjectsTheme {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function saveProjectsTheme(theme: ProjectsTheme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage blocked */
  }
}
