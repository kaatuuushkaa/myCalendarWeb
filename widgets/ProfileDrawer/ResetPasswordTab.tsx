"use client";

import { useState } from "react";
import { Box, Button, Alert } from "@mui/material";
import AuthInput from "@/components/ui/AuthInput/AuthInput";
import { ResetPasswordRequest } from "@/types/auth";
import { getUsernameFromStorage } from "@/services/authService";

interface ResetPasswordTabProps {
    onReset: (data: ResetPasswordRequest) => Promise<void>;
}

export default function ResetPasswordTab({ onReset }: ResetPasswordTabProps) {
    const [oldPassword, setOldPassword]       = useState("");
    const [newPassword, setNewPassword]       = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess]               = useState(false);
    const [error, setError]                   = useState<string | null>(null);
    const [loading, setLoading]               = useState(false);

    const username = getUsernameFromStorage();

    const handleSubmit = async () => {
        setError(null);
        setSuccess(false);

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Заполните все поля");
            return;
        }
        if (newPassword.length < 8) {
            setError("Новый пароль минимум 8 символов");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        setLoading(true);
        try {
            await onReset({
                username,
                oldPassword: oldPassword,
                newPassword: newPassword,
            });
            setSuccess(true);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ошибка смены пароля");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {success && <Alert severity="success">Пароль успешно изменён</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <AuthInput
                label="Текущий пароль"
                type="password"
                value={oldPassword}
                onChange={setOldPassword}
            />
            <AuthInput
                label="Новый пароль"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
            />
            <AuthInput
                label="Повторите новый пароль"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
            />

            <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ mt: 1 }}>
                {loading ? "Сохранение..." : "Изменить пароль"}
            </Button>
        </Box>
    );
}