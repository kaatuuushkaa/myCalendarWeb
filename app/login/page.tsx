// "use client" — эта страница работает в браузере
// нужно потому что используем useState внутри хука
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// useSearchParams — хук Next.js для чтения параметров из URL
// например из /login?registered=true достанем registered=true
import { useSearchParams } from "next/navigation";
import { Box, Typography, Alert, Link } from "@mui/material";
import AuthInput from "@/components/ui/AuthInput/AuthInput";
import AuthButton from "@/components/ui/AuthButton/AuthButton";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    // локальное состояние полей формы
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    // достаём логику из хука — сам хук не знает про UI
    const { loading, error, handleLogin } = useAuth();

    // читаем параметры из URL
    // если пришли с /register, там будет ?registered=true
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";

    // валидация на стороне фронта — проверяем до отправки на сервер
    const [validationError, setValidationError] = useState<string | null>(null);

    const onSubmit = async () => {
        // сбрасываем предыдущую ошибку валидации
        setValidationError(null);

        // простая проверка — поля не пустые
        if (!login || !password) {
            setValidationError("Заполните все поля");
            return; // return останавливает выполнение — не идём дальше
        }

        // вызываем хук — он сделает запрос и перенаправит на /calendar
        await handleLogin({ login, password });
    };

    return (
        // Box — универсальный контейнер MUI, как div но с удобной стилизацией через sx
        <Box
            sx={{
                // минимальная высота — весь экран
                minHeight: "100vh",
                // flexbox по центру — выравниваем форму по центру страницы
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // цвет фона страницы
                bgcolor: "#f5f5f5",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,        // максимальная ширина формы
                    bgcolor: "white",     // белый фон карточки
                    borderRadius: 2,      // скруглённые углы
                    p: 4,                 // padding: 32px со всех сторон
                    boxShadow: 3,         // тень карточки, 3 = средняя тень MUI
                }}
            >
                {/* заголовок страницы */}
                <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
                    Войти в myCalendar
                </Typography>

                {/* показываем сообщение если пользователь только что зарегистрировался */}
                {justRegistered && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Вы успешно зарегистрировались! Войдите в аккаунт.
                    </Alert>
                )}

                {/* показываем ошибку валидации или ошибку от сервера */}
                {/* validationError проверяем первым — она приоритетнее */}
                {(validationError || error) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {validationError || error}
                    </Alert>
                )}

                {/* поля формы — каждое обёрнуто в Box для отступа снизу */}
                <Box sx={{ mb: 2 }}>
                    <AuthInput
                        label="Логин или email"
                        value={login}
                        onChange={setLogin}  // setLogin — функция из useState, обновляет состояние
                    />
                </Box>

                <Box sx={{ mb: 1 }}>
                    <AuthInput
                        label="Пароль"
                        type="password"      // type="password" скрывает символы
                        value={password}
                        onChange={setPassword}
                    />
                </Box>

                {/* кнопка входа — передаём onSubmit и состояние загрузки */}
                <AuthButton
                    label="Войти"
                    onClick={onSubmit}
                    loading={loading}
                />

                {/* ссылка на регистрацию */}
                <Typography variant="body2" textAlign="center" mt={2} color="text.secondary">
                    Нет аккаунта?{" "}
                    {/* Link из MUI — ссылка в стиле Material, href — куда ведёт */}
                    <Link href="/register" underline="hover">
                        Зарегистрируйтесь
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}