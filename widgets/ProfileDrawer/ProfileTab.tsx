"use client";

import { useState, useEffect } from "react"; // добавили useEffect
import { Box, Typography, Divider, Button, Alert } from "@mui/material";
import AuthInput from "@/components/ui/AuthInput/AuthInput";
import { UserProfile, UpdateUserRequest } from "@/types/auth";

interface ProfileTabProps {
    profile: UserProfile;
    onUpdate: (data: UpdateUserRequest) => Promise<void>;
}

export default function ProfileTab({ profile, onUpdate }: ProfileTabProps) {
    const [name, setName]       = useState(profile.name ?? "");
    const [surname, setSurname] = useState(profile.surname ?? "");
    const [email, setEmail]     = useState(profile.email ?? "");
    const [birth, setBirth]     = useState(profile.birth ?? "");
    const [success, setSuccess] = useState(false);
    const [error, setError]     = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // когда profile загрузился с бэкенда — заполняем поля актуальными данными
    // без этого поля остаются пустыми потому что profile приходит асинхронно
    useEffect(() => {
        setName(profile.name ?? "");       // добавь ?? ""
        setSurname(profile.surname ?? ""); // добавь ?? ""
        setEmail(profile.email ?? "");     // добавь ?? ""
        setBirth(profile.birth ? profile.birth.substring(0, 10) : "");     // добавь ?? ""
    }, [profile]); // срабатывает каждый раз когда profile меняется

    const handleSubmit = async () => {
        setError(null);
        setSuccess(false);
        setLoading(true);
        try {
            await onUpdate({ name, surname, email, birth });
            setSuccess(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ошибка обновления");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
                <Typography variant="caption" color="text.secondary">
                    Логин
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                    {profile.username}
                </Typography>
            </Box>

            <Divider />

            {success && <Alert severity="success">Профиль обновлён</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <AuthInput label="Имя" value={name} onChange={setName} />
            <AuthInput label="Фамилия" value={surname} onChange={setSurname} />
            <AuthInput label="Email" type="email" value={email} onChange={setEmail} />
            <AuthInput
                label="Дата рождения"
                type="date"
                value={birth}
                onChange={setBirth}
                shrinkLabel
            />

            <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ mt: 1 }}>
                {loading ? "Сохранение..." : "Сохранить"}
            </Button>
        </Box>
    );
}