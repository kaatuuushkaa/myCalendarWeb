// redirect — функция Next.js для серверного редиректа
// работает без "use client" — выполняется на сервере до отправки страницы браузеру
import { redirect } from "next/navigation";

export default function Home() {
  // как только кто-то открывает localhost:3000 — сразу перекидываем на /login
  redirect("/login");
}