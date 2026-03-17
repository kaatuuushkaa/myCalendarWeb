import type { Metadata } from "next";

//AppRoterCacheProvider - провайдер от MUI специльано для next.js App Router
//без него стили будут мигать при первой загрузке
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import App from "next/app";

//что здесь написано - попадает в <head>
export const metadata: Metadata = {
  title: "MyCalendar",
  description: "Твой личный календарь",
};

//компонент обертка
//children - содержимое текущей страницы
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
            {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
