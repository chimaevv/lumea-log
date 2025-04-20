import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={baloo.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
