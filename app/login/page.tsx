// page знает только маршрут — компонует виджет
import { Suspense } from "react";
import LoginWidget from "@/widgets/LoginWidget";

export default function LoginPage() {
    return (
        // Suspense нужен потому что LoginWidget использует useSearchParams
        // Next.js требует Suspense для хуков которые читают URL параметры
        <Suspense>
            <LoginWidget />
        </Suspense>
    );
}