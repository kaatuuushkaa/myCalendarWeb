"use client";

import { Box, Typography } from "@mui/material";
import CalendarGrid from "@/components/calendar/CalendarGrid/CalendarGrid";
import CreateEventModal from "@/widgets/CreateEventModal/CreateEventModal";
import EventDetailModal from "@/widgets/EventDetailModal/EventDetailModal";
import EditEventModal from "@/widgets/EditEventModal/EditEventModal";
import { useEvents } from "@/hooks/useEvents";
import { useCalendar } from "./useCalendar";

export default function CalendarWidget() {
    // данные с сервера — через хук
    const { events, error, handleCreate, handleDelete, handleUpdate } = useEvents();

    // локальный стейт календаря — внутри виджета
    const {
        year, setYear,
        selectedDate, openCreate, closeCreate,
        selectedEvent, openDetail, closeDetail,
        editingEvent, openEdit, closeEdit,
    } = useCalendar();

    return (
        <Box>
            {error && (
                <Box sx={{ p: 3 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            <CalendarGrid
                events={events}
                onDayClick={openCreate}
                onEventClick={openDetail}
                year={year}
                onYearChange={setYear}
            />

            <CreateEventModal
                open={!!selectedDate}
                selectedDate={selectedDate ?? ""}
                onClose={closeCreate}
                onCreate={handleCreate}
            />

            <EventDetailModal
                open={!!selectedEvent}
                event={selectedEvent}
                onClose={closeDetail}
                onDelete={handleDelete}
                onEdit={openEdit}
            />

            <EditEventModal
                open={!!editingEvent}
                event={editingEvent}
                onClose={closeEdit}
                onUpdate={handleUpdate}
            />
        </Box>
    );
}