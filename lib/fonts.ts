// Centralized font configuration for the app
// Each entry maps a key used in config to display name and CSS variable

export const googleFonts = [
  // Sans-serif
  { key: "inter", name: "Inter", category: "Sans-serif" },
  { key: "roboto", name: "Roboto", category: "Sans-serif" },
  { key: "openSans", name: "Open Sans", category: "Sans-serif" },
  { key: "lato", name: "Lato", category: "Sans-serif" },
  { key: "montserrat", name: "Montserrat", category: "Sans-serif" },
  { key: "poppins", name: "Poppins", category: "Sans-serif" },
  { key: "nunito", name: "Nunito", category: "Sans-serif" },
  { key: "raleway", name: "Raleway", category: "Sans-serif" },
  { key: "workSans", name: "Work Sans", category: "Sans-serif" },
  { key: "dmSans", name: "DM Sans", category: "Sans-serif" },
  { key: "outfit", name: "Outfit", category: "Sans-serif" },
  { key: "plusJakartaSans", name: "Plus Jakarta Sans", category: "Sans-serif" },
  { key: "spaceGrotesk", name: "Space Grotesk", category: "Sans-serif" },
  { key: "urbanist", name: "Urbanist", category: "Sans-serif" },
  { key: "quicksand", name: "Quicksand", category: "Sans-serif" },
  { key: "rubik", name: "Rubik", category: "Sans-serif" },
  { key: "karla", name: "Karla", category: "Sans-serif" },
  { key: "manrope", name: "Manrope", category: "Sans-serif" },
  { key: "lexend", name: "Lexend", category: "Sans-serif" },
  { key: "cabin", name: "Cabin", category: "Sans-serif" },
  { key: "mulish", name: "Mulish", category: "Sans-serif" },
  { key: "nunitoSans", name: "Nunito Sans", category: "Sans-serif" },
  { key: "josefinSans", name: "Josefin Sans", category: "Sans-serif" },
  { key: "titilliumWeb", name: "Titillium Web", category: "Sans-serif" },
  { key: "exo2", name: "Exo 2", category: "Sans-serif" },
  { key: "figtree", name: "Figtree", category: "Sans-serif" },
  { key: "sora", name: "Sora", category: "Sans-serif" },
  { key: "archivo", name: "Archivo", category: "Sans-serif" },

  // Serif
  { key: "playfairDisplay", name: "Playfair Display", category: "Serif" },
  { key: "merriweather", name: "Merriweather", category: "Serif" },
  { key: "lora", name: "Lora", category: "Serif" },
  { key: "crimsonText", name: "Crimson Text", category: "Serif" },
  { key: "ebGaramond", name: "EB Garamond", category: "Serif" },
  { key: "libreBaskerville", name: "Libre Baskerville", category: "Serif" },
  { key: "cormorantGaramond", name: "Cormorant Garamond", category: "Serif" },
  { key: "bitter", name: "Bitter", category: "Serif" },
  { key: "sourceSerif4", name: "Source Serif 4", category: "Serif" },
  { key: "dmSerif", name: "DM Serif Display", category: "Serif" },
  { key: "notoSerif", name: "Noto Serif", category: "Serif" },
  { key: "vollkorn", name: "Vollkorn", category: "Serif" },
  { key: "spectral", name: "Spectral", category: "Serif" },

  // Monospace
  { key: "jetbrainsMono", name: "JetBrains Mono", category: "Monospace" },
  { key: "firaCode", name: "Fira Code", category: "Monospace" },
  { key: "sourceCodePro", name: "Source Code Pro", category: "Monospace" },
  { key: "spaceMono", name: "Space Mono", category: "Monospace" },
  { key: "ibmPlexMono", name: "IBM Plex Mono", category: "Monospace" },
  { key: "robotoMono", name: "Roboto Mono", category: "Monospace" },
  { key: "inconsolata", name: "Inconsolata", category: "Monospace" },

  // Display / Decorative
  { key: "oswald", name: "Oswald", category: "Display" },
  { key: "bebasNeue", name: "Bebas Neue", category: "Display" },
  { key: "anton", name: "Anton", category: "Display" },
  { key: "righteous", name: "Righteous", category: "Display" },
  { key: "comfortaa", name: "Comfortaa", category: "Display" },
  { key: "fredoka", name: "Fredoka", category: "Display" },
  { key: "abrilFatface", name: "Abril Fatface", category: "Display" },
  { key: "alfaSlabOne", name: "Alfa Slab One", category: "Display" },
  { key: "permanentMarker", name: "Permanent Marker", category: "Display" },
  { key: "pressStart2P", name: "Press Start 2P", category: "Display" },
  { key: "bungee", name: "Bungee", category: "Display" },
  { key: "bungeeShade", name: "Bungee Shade", category: "Display" },
  { key: "silkscreen", name: "Silkscreen", category: "Display" },
  { key: "blackOpsOne", name: "Black Ops One", category: "Display" },

  // Handwriting
  { key: "pacifico", name: "Pacifico", category: "Handwriting" },
  { key: "dancingScript", name: "Dancing Script", category: "Handwriting" },
  { key: "caveat", name: "Caveat", category: "Handwriting" },
  { key: "satisfy", name: "Satisfy", category: "Handwriting" },
  { key: "greatVibes", name: "Great Vibes", category: "Handwriting" },
  { key: "lobster", name: "Lobster", category: "Handwriting" },
  { key: "sacramento", name: "Sacramento", category: "Handwriting" },
  { key: "indieFlower", name: "Indie Flower", category: "Handwriting" },
  { key: "kalam", name: "Kalam", category: "Handwriting" },
] as const;

export type FontKey = (typeof googleFonts)[number]["key"];

// Get CSS variable reference for a font key
export function getFontVariable(key: string): string {
  return `var(--font-${key})`;
}

// Get all unique categories
export function getFontCategories(): string[] {
  return [...new Set(googleFonts.map((f) => f.category))];
}
