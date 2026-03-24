"use client";

import { useState, useEffect } from "react";
import { UserProfile, UpdateUserRequest, ResetPasswordRequest } from "@/types/auth";
import { getUser, updateUser, resetPassword, getUsernameFromStorage } from "@/services/authService";

export function useProfile(open: boolean) { // ← добавили параметр open
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        // загружаем профиль только когда drawer открыт
        // если закрыт — не делаем лишних запросов
        if (!open) return;

        const username = getUsernameFromStorage();
        console.log("useProfile: open=", open, "username=", username);
        if (!username) return;

        loadProfile(username);
    }, [open]); // срабатывает каждый раз когда open меняется

    const loadProfile = async (username: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUser(username);
            console.log("loadProfile result:", data);
            setProfile(data.user);
        } catch (e) {
            console.log("loadProfile error:", e);
            setError(e instanceof Error ? e.message : "Ошибка загрузки профиля");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (data: UpdateUserRequest): Promise<void> => {
        const username = getUsernameFromStorage();
        await updateUser(username, data);
        // обновляем локальный профиль сразу — без лишнего запроса
        setProfile((prev) => prev ? { ...prev, ...data } : prev);
    };

    const handleResetPassword = async (data: ResetPasswordRequest): Promise<void> => {
        const username = getUsernameFromStorage();
        await resetPassword(username, data);
    };

    return { profile, loading, error, handleUpdate, handleResetPassword };
}