import { type ReactElement, type ReactNode } from "react";
import { AppProvider } from "@/app/providers";
import { Header } from "@/widgets/header/ui/header";
import "./globals.css";

export const metadata = {
  title: "FSD Shop",
  description: "Feature-Sliced Design 아키텍처 샘플 프로젝트",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <html lang="ko">
      <body>
        <AppProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
