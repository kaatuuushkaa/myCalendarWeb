"use client";

import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Box, Alert,
} from "@mui/material";
import AuthInput from "@/components/ui/AuthInput/AuthInput";
import { CreateEventRequest } from "@/types/event";

interface CreateEventModalProps {
    open: boolean;
    selectedDate: string;   // "2026-03-20" — дата на которую кликнули
    onClose: () => void;
    onCreate: (req: CreateEventRequest) => Promise<void>;
}

export default function CreateEventModal({
                                             open,
                                             selectedDate,
                                             onClose,
                                             onCreate,
                                         }: CreateEventModalProps) {
    const [title, setTitle]             = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime]     = useState("09:00");
    const [endTime, setEndTime]         = useState("10:00");
    const [error, setError]             = useState<string | null>(null);
    const [loading, setLoading]         = useState(false);

    // сбрасываем форму при закрытии
    const handleClose = () => {
        setTitle("");
        setDescription("");
        setStartTime("09:00");
        setEndTime("10:00");
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!title) {
            setError("Заголовок обязателен");
            return;
        }

        // собираем RFC3339 из даты и времени
        // selectedDate = "2026-03-20", startTime = "09:00"
        // → "2026-03-20T09:00:00Z"
        const startAt = `${selectedDate}T${startTime}:00+03:00`;
        const endAt   = `${selectedDate}T${endTime}:00+03:00`;

        if (endAt <= startAt) {
            setError("Время окончания должно быть позже начала");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await onCreate({ title, description, start_at: startAt, end_at: endAt });
            handleClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Ошибка создания");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Новый ивент — {formatDisplayDate(selectedDate)}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <AuthInput
                        label="Заголовок *"
                        value={title}
                        onChange={setTitle}
                    />

                    <AuthInput
                        label="Описание"
                        value={description}
                        onChange={setDescription}
                    />

                    {/* время начала и окончания рядом */}
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
                <Button onClick={handleClose} color="inherit">
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Сохранение..." : "Сохранить"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// форматируем "2026-03-20" → "20 марта 2026"
function formatDisplayDate(dateStr: string): string {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}