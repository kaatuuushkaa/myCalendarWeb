"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import HeaderWidget from "@/widgets/HeaderWidget";
import CalendarWidget from "@/widgets/CalendarWidgets";
import ProfileDrawer from "@/widgets/ProfileDrawer/ProfileDrawer";

export default function CalendarPage() {
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isAuthed, setIsAuthed]     = useState<boolean | null>(null);
    // проверяем авторизацию — это логика страницы, она знает про роутинг
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        // просто читаем токен и редиректим — без setState
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthed(true);
        }
    }, []);

    if (isAuthed === null) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    // page — только компоновка виджетов
    // никакой бизнес-логики
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
            <HeaderWidget onMenuClick={() => setDrawerOpen(true)} />
            <CalendarWidget />
            <ProfileDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </Box>
    );
}