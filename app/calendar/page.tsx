"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarGrid from "@/components/calendar/CalendarGrid/CalendarGrid";
import CreateEventModal from "@/widgets/CreateEventModal/CreateEventModal";
import EventDetailModal from "@/widgets/EventDetailMpdal/EventDetailModal";
import ProfileDrawer from "@/widgets/ProfileDrawer/ProfileDrawer";
import { useEvents } from "@/hooks/useEvents";
import { Event } from "@/types/event";

export default function CalendarPage() {
    const router = useRouter();
    const { events, loading, error, handleCreate, handleDelete } = useEvents();

    const [selectedDate, setSelectedDate]   = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [drawerOpen, setDrawerOpen]       = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) router.push("/login");
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username"); // убираем username тоже
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
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}
            >
                {/* левая часть шапки — кнопка меню + название */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={() => setDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={700}>
                        myCalendar
                    </Typography>
                </Box>

                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Выйти
                </Button>
            </Box>

            {error && (
                <Box sx={{ p: 3 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            <CalendarGrid
                events={events}
                onDayClick={(date) => setSelectedDate(date)}
                onEventClick={(event) => setSelectedEvent(event)}
            />

            <CreateEventModal
                open={!!selectedDate}
                selectedDate={selectedDate ?? ""}
                onClose={() => setSelectedDate(null)}
                onCreate={handleCreate}
            />

            <EventDetailModal
                open={!!selectedEvent}
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onDelete={handleDelete}
            />

            {/* боковое меню профиля */}
            <ProfileDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </Box>
    );
}