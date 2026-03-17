"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";

export default function CalendarPage() {
    const router = useRouter();

    useEffect(() => {
        // useEffect выполняется после рендера страницы в браузере
        // проверяем есть ли токен в localStorage
        // если нет — пользователь не авторизован, отправляем на логин
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
        }
    }, []); // [] — пустой массив зависимостей, выполняется только один раз при загрузке

    const handleLogout = () => {
        // удаляем токены из localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // перенаправляем на логин
        router.push("/login");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",  // элементы друг под другом
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
            }}
        >
            <Typography variant="h4" fontWeight={600} mb={2}>
                Мой календарь
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={4}>
                Здесь будет календарь с ивентами
            </Typography>

            {/* кнопка выхода */}
            <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
            >
                Выйти
            </Button>
        </Box>
    );
}