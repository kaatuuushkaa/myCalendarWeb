"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Alert, Link } from "@mui/material";
import AuthInput from "@/components/ui/AuthInput/AuthInput";
import AuthButton from "@/components/ui/AuthButton/AuthButton";
import { useAuth } from "@/hooks/useAuth";

export default function LoginWidget() {
    // локальный стейт формы — нужен только этому виджету
    const [login, setLogin]       = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);

    const { loading, error, handleLogin } = useAuth();

    // читаем ?registered=true из URL — показываем сообщение после регистрации
    const searchParams   = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";

    const onSubmit = async () => {
        setValidationError(null);

        if (!login || !password) {
            setValidationError("Заполните все поля");
            return;
        }

        await handleLogin({ login, password });
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    bgcolor: "white",
                    borderRadius: 2,
                    p: 4,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
                    Войти в myCalendar
                </Typography>

                {justRegistered && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Вы успешно зарегистрировались! Войдите в аккаунт.
                    </Alert>
                )}

                {(validationError || error) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {validationError || error}
                    </Alert>
                )}

                <Box sx={{ mb: 2 }}>
                    <AuthInput
                        label="Логин или email"
                        value={login}
                        onChange={setLogin}
                    />
                </Box>

                <Box sx={{ mb: 1 }}>
                    <AuthInput
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={setPassword}
                    />
                </Box>

                <AuthButton label="Войти" onClick={onSubmit} loading={loading} />

                <Typography variant="body2" textAlign="center" mt={2} color="text.secondary">
                    Нет аккаунта?{" "}
                    <Link href="/register" underline="hover">
                        Зарегистрируйтесь
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}