// локальный стейт календаря — живёт внутри виджета
// снаружи никто не знает про selectedDate, editingEvent и тд
import { useState } from "react";
import { Event } from "@/types/event";

export function useCalendar() {
    const [year, setYear]                   = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate]   = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [editingEvent, setEditingEvent]   = useState<Event | null>(null);

    const openCreate = (date: string) => setSelectedDate(date);
    const closeCreate = () => setSelectedDate(null);

    const openDetail = (event: Event) => setSelectedEvent(event);
    const closeDetail = () => setSelectedEvent(null);

    const openEdit = (event: Event) => {
        setSelectedEvent(null); // закрываем просмотр
        setEditingEvent(event); // открываем редактирование
    };
    const closeEdit = () => setEditingEvent(null);

    return {
        year, setYear,
        selectedDate, openCreate, closeCreate,
        selectedEvent, openDetail, closeDetail,
        editingEvent, openEdit, closeEdit,
    };
}