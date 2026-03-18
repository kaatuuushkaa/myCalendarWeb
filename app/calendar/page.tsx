"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import CreateEventModal from "@/widgets/CreateEventModal";
import EventDetailModal from "@/widgets/EventDetailModal";
import { useEvents } from "@/hooks/useEvents";
import { Event } from "@/types/event";

export default function CalendarPage() {
    const router = useRouter();
    const { events, loading, error, handleCreate, handleDelete } = useEvents();

    // selectedDate — дата на которую кликнули для создания ивента
    const [selectedDate, setSelectedDate]     = useState<string | null>(null);
    // selectedEvent — ивент на который кликнули для просмотра
    const [selectedEvent, setSelectedEvent]   = useState<Event | null>(null);

    // проверяем авторизацию
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) router.push("/login");
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/login");
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>

            {/* шапка */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 4,
                    py: 2,
                    bgcolor: "white",
                    boxShadow: 1,
                    position: "sticky", // шапка остаётся наверху при скролле
                    top: 0,
                    zIndex: 100,
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    myCalendar
                </Typography>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Выйти
                </Button>
            </Box>

            {/* ошибка загрузки */}
            {error && (
                <Box sx={{ p: 3 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            {/* сетка календаря */}
            <CalendarGrid
                events={events}
                onDayClick={(date) => setSelectedDate(date)}
                onEventClick={(event) => setSelectedEvent(event)}
            />

            {/* модалка создания — открывается при клике на день */}
            <CreateEventModal
                open={!!selectedDate}         // !! превращает строку/null в boolean
                selectedDate={selectedDate ?? ""}
                onClose={() => setSelectedDate(null)}
                onCreate={handleCreate}
            />

            {/* модалка просмотра — открывается при клике на ивент */}
            <EventDetailModal
                open={!!selectedEvent}
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onDelete={handleDelete}
            />
        </Box>
    );
}
