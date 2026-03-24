"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Box, Alert,
} from "@mui/material";
import AuthInput from "@/components/ui/AuthInput/AuthInput";
import { Event, CreateEventRequest } from "@/types/event";

interface EditEventModalProps {
    open: boolean;
    event: Event | null;
    onClose: () => void;
    onUpdate: (id: string, req: CreateEventRequest) => Promise<void>;
}

export default function EditEventModal({
                                           open,
                                           event,
                                           onClose,
                                           onUpdate,
                                       }: EditEventModalProps) {
    const [title, setTitle]             = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime]     = useState("09:00");
    const [endTime, setEndTime]         = useState("10:00");
    const [error, setError]             = useState<string | null>(null);
    const [loading, setLoading]         = useState(false);

    // заполняем поля данными ивента когда модалка открывается
    useEffect(() => {
        if (!event) return;
        setTitle(event.title);
        setDescription(event.description ?? "");
        setStartTime(extractTime(event.start_at));
        setEndTime(extractTime(event.end_at));
        setError(null);
    }, [event]);

    const handleClose = () => {
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!event) return;
        if (!title) {
            setError("Заголовок обязателен");
            return;
        }

        const date = event.event_date.substring(0, 10);
        const tz   = getBrowserTimezone();
        const startAt = `${date}T${startTime}:00${tz}`;
        const endAt   = `${date}T${endTime}:00${tz}`;

        if (endAt <= startAt) {
            setError("Время окончания должно быть позже начала");
            return;
        }

        setError(null);
        setLoading(true);
        try {
            await onUpdate(event.id, { title, description, start_at: startAt, end_at: endAt });
            handleClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ошибка обновления");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Редактировать ивент</DialogTitle>

            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <AuthInput label="Заголовок *" value={title} onChange={setTitle} />
                    <AuthInput label="Описание" value={description} onChange={setDescription} />

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        <AuthInput
                            label="Начало"
                            type="time"
                            value={startTime}
                            onChange={setStartTime}
                            shrinkLabel
                        />
                        <AuthInput
                            label="Окончание"
                            type="time"
                            value={endTime}
                            onChange={setEndTime}
                            shrinkLabel
                        />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} color="inherit">Отмена</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? "Сохранение..." : "Сохранить"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function extractTime(rfc3339: string): string {
    const date = new Date(rfc3339);
    return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function getBrowserTimezone(): string {
    const offset = -new Date().getTimezoneOffset();
    const sign   = offset >= 0 ? "+" : "-";
    const hours  = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
    const mins   = String(Math.abs(offset) % 60).padStart(2, "0");
    return `${sign}${hours}:${mins}`;
}