import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Dashboard Anggaran", description: "Monitoring realisasi anggaran", manifest: "/manifest.webmanifest", icons: { icon: "/icon.svg", apple: "/icon.svg" } };
export const viewport: Viewport = { themeColor: "#07111f", width: "device-width", initialScale: 1 };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="id"><body>{children}</body></html>; }
