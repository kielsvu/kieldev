import "./globals.css";
import { MotionConfig } from "framer-motion";
import RefreshRedirect from '@/components/RefreshRedirect';

export const metadata = {
  title: "kiel.dev",
  description: "kiel personal portfolio, focused on web development and modern UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* reducedMotion="user" makes every Framer Motion animation
            respect the OS-level "reduce motion" accessibility setting */}
        <MotionConfig reducedMotion="user">
          <RefreshRedirect />
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
