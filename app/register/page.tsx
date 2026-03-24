"use client";

import { useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import AuthInput from "@/components/ui/AuthInput/AuthInput";
import AuthButton from "@/components/ui/AuthButton/AuthButton";
import {Box, Typography, Alert, Link, Grid} from "@mui/material";

export default function RegisterPage() {
    // const [login, setLogin] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [birth, setBirth] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({})
    const { loading, error, handleRegister } = useAuth();

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!username) newErrors.username = "Логин обязателен";
        if (!password) newErrors.password = "Пароль обязателен";
        if (password && password.length<8) newErrors.password="Минимум 8 символов";
        if (!email) newErrors.email = "Email обязателен";
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Неверный формат email";
        }
        if (!name) newErrors.name = "Имя обязательно";
        if (!surname) newErrors.surname = "Фамилия обязательна";
        if (!birth) newErrors.birth = "Дата рождения обязательна";

        setErrors(newErrors);

        return Object.keys(newErrors).length ===0;
    };

    const onSubmit = async () => {
        // если валидация не прошла — останавливаемся
        if (!validate()) return;

        await handleRegister({ username, password, email, name, surname, birth });
    };

    return (
        <Box
            sx={{
                minHeight:"100vh",
                display: "flex",
                alignItems:"center",
                justifyContent:"center",
                bgcolor:"#f5f5f5",
            }}
        >
            <Box
                sx={{
                    width:"100%",
                    maxWidth: 480,
                    bgcolor:"white",
                    borderRadius:2,
                    p:4,
                    boxShadow:3,
                }}
            >
                <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
                    Регистрация
                </Typography>

                {/* ошибка от сервера — показываем если бэкенд вернул ошибку */}
                {error && (
                    <Alert severity="error" sx={{mb:2}}>
                        {error}
                    </Alert>
                )}

                {/* Grid — сетка MUI для расположения элементов в ряд */}
                {/* имя и фамилия рядом — каждый занимает половину ширины */}
                <Grid container spacing={2}>
                    <Grid item xs={6}> {/* xs=6 — половина из 12 колонок */}
                        <AuthInput
                            label="Имя"
                            value={name}
                            onChange={setName}
                            error={errors.name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <AuthInput
                            label={"Фамилия"}
                            value={surname}
                            onChange={setSurname}
                            error={errors.surname}
                        />
                    </Grid>
                </Grid>

                <Box sx={{mt:2}}>
                    <AuthInput
                        label={"Логин"}
                        value={username}
                        onChange={setUsername}
                        error={errors.username}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <AuthInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        error={errors.email}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <AuthInput
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        error={errors.password}
                    />
                </Box>

                {/* поле даты — используем type="date" */}
                {/* InputLabelProps={{ shrink: true }} — фикс MUI для date полей */}
                {/* без этого label накладывается на значение поля */}
                <Box sx={{ mt: 2 }}>
                    <AuthInput
                        label="Дата рождения"
                        type="date"
                        value={birth}
                        onChange={setBirth}
                        error={errors.birth}
                        shrinkLabel
                    />
                </Box>

                <AuthButton
                    label="Зарегистрироваться"
                    onClick={onSubmit}
                    loading={loading}
                />

                <Typography variant="body2" textAlign="center" mt={2} color="text.secondary">
                    Уже есть аккаунт?{" "}
                    <Link href="/login" underline="hover">
                        Войти
                    </Link>
                </Typography>
            </Box>

        </Box>
    );
}