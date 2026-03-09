import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import {
  Inter, Roboto, Open_Sans, Lato, Montserrat, Poppins, Nunito, Raleway,
  Work_Sans, DM_Sans, Outfit, Plus_Jakarta_Sans, Space_Grotesk, Urbanist,
  Quicksand, Rubik, Karla, Manrope, Lexend, Cabin, Mulish, Nunito_Sans,
  Josefin_Sans, Titillium_Web, Exo_2, Figtree, Sora, Archivo,
  Playfair_Display, Merriweather, Lora, Crimson_Text, EB_Garamond,
  Libre_Baskerville, Cormorant_Garamond, Bitter, Source_Serif_4,
  DM_Serif_Display, Noto_Serif, Vollkorn, Spectral,
  JetBrains_Mono, Fira_Code, Source_Code_Pro, Space_Mono,
  IBM_Plex_Mono, Roboto_Mono, Inconsolata,
  Oswald, Bebas_Neue, Anton, Righteous, Comfortaa, Fredoka,
  Abril_Fatface, Alfa_Slab_One, Permanent_Marker, Press_Start_2P,
  Bungee, Bungee_Shade, Silkscreen, Black_Ops_One,
  Pacifico, Dancing_Script, Caveat, Satisfy, Great_Vibes, Lobster,
  Sacramento, Indie_Flower, Kalam,
} from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Sans-serif
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"], variable: "--font-roboto" })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-openSans" })
const lato = Lato({ subsets: ["latin"], weight: ["100", "300", "400", "700", "900"], variable: "--font-lato" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: "--font-poppins" })
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" })
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-workSans" })
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmSans" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plusJakartaSans" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-spaceGrotesk" })
const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" })
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" })
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" })
const karla = Karla({ subsets: ["latin"], variable: "--font-karla" })
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" })
const cabin = Cabin({ subsets: ["latin"], variable: "--font-cabin" })
const mulish = Mulish({ subsets: ["latin"], variable: "--font-mulish" })
const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunitoSans" })
const josefinSans = Josefin_Sans({ subsets: ["latin"], variable: "--font-josefinSans" })
const titilliumWeb = Titillium_Web({ subsets: ["latin"], weight: ["200", "300", "400", "600", "700", "900"], variable: "--font-titilliumWeb" })
const exo2 = Exo_2({ subsets: ["latin"], variable: "--font-exo2" })
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" })
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" })
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" })

// Serif
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfairDisplay" })
const merriweather = Merriweather({ subsets: ["latin"], weight: ["300", "400", "700", "900"], variable: "--font-merriweather" })
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" })
const crimsonText = Crimson_Text({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-crimsonText" })
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-ebGaramond" })
const libreBaskerville = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libreBaskerville" })
const cormorantGaramond = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-cormorantGaramond" })
const bitter = Bitter({ subsets: ["latin"], variable: "--font-bitter" })
const sourceSerif4 = Source_Serif_4({ subsets: ["latin"], variable: "--font-sourceSerif4" })
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dmSerif" })
const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-notoSerif" })
const vollkorn = Vollkorn({ subsets: ["latin"], variable: "--font-vollkorn" })
const spectral = Spectral({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800"], variable: "--font-spectral" })

// Monospace
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrainsMono" })
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-firaCode" })
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-sourceCodePro" })
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-spaceMono" })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700"], variable: "--font-ibmPlexMono" })
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-robotoMono" })
const inconsolata = Inconsolata({ subsets: ["latin"], variable: "--font-inconsolata" })

// Display
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" })
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebasNeue" })
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" })
const righteous = Righteous({ subsets: ["latin"], weight: "400", variable: "--font-righteous" })
const comfortaa = Comfortaa({ subsets: ["latin"], variable: "--font-comfortaa" })
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" })
const abrilFatface = Abril_Fatface({ subsets: ["latin"], weight: "400", variable: "--font-abrilFatface" })
const alfaSlabOne = Alfa_Slab_One({ subsets: ["latin"], weight: "400", variable: "--font-alfaSlabOne" })
const permanentMarker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-permanentMarker" })
const pressStart2P = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pressStart2P" })
const bungee = Bungee({ subsets: ["latin"], weight: "400", variable: "--font-bungee" })
const bungeeShade = Bungee_Shade({ subsets: ["latin"], weight: "400", variable: "--font-bungeeShade" })
const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-silkscreen" })
const blackOpsOne = Black_Ops_One({ subsets: ["latin"], weight: "400", variable: "--font-blackOpsOne" })

// Handwriting
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-pacifico" })
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancingScript" })
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" })
const satisfy = Satisfy({ subsets: ["latin"], weight: "400", variable: "--font-satisfy" })
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-greatVibes" })
const lobster = Lobster({ subsets: ["latin"], weight: "400", variable: "--font-lobster" })
const sacramento = Sacramento({ subsets: ["latin"], weight: "400", variable: "--font-sacramento" })
const indieFlower = Indie_Flower({ subsets: ["latin"], weight: "400", variable: "--font-indieFlower" })
const kalam = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-kalam" })

const allFontVariables = [
  inter, roboto, openSans, lato, montserrat, poppins, nunito, raleway,
  workSans, dmSans, outfit, plusJakartaSans, spaceGrotesk, urbanist,
  quicksand, rubik, karla, manrope, lexend, cabin, mulish, nunitoSans,
  josefinSans, titilliumWeb, exo2, figtree, sora, archivo,
  playfairDisplay, merriweather, lora, crimsonText, ebGaramond,
  libreBaskerville, cormorantGaramond, bitter, sourceSerif4,
  dmSerif, notoSerif, vollkorn, spectral,
  jetbrainsMono, firaCode, sourceCodePro, spaceMono,
  ibmPlexMono, robotoMono, inconsolata,
  oswald, bebasNeue, anton, righteous, comfortaa, fredoka,
  abrilFatface, alfaSlabOne, permanentMarker, pressStart2P,
  bungee, bungeeShade, silkscreen, blackOpsOne,
  pacifico, dancingScript, caveat, satisfy, greatVibes, lobster,
  sacramento, indieFlower, kalam,
].map((f) => f.variable).join(" ")

export const metadata: Metadata = {
  title: "GSAP Animation Playground",
  description: "Create stunning text animations with GSAP",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${allFontVariables}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}