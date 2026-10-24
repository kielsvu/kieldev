import "./globals.css";
import { MotionConfig } from "framer-motion";
import RefreshRedirect from '@/components/RefreshRedirect';

export const metadata = {
  title: "kiel.dev",
  description: "kiel personal portfolio, focused on web development and modern UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Tells every Framer Motion animation to respect OS reduce-motion setting */}
        <MotionConfig reducedMotion="user">
          <RefreshRedirect />
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
