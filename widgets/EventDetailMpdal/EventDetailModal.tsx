"use client";

import {
    Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, Box, Divider,
} from "@mui/material";
import { Event } from "@/types/event";

interface EventDetailModalProps {
    open: boolean;
    event: Event | null;      // null если ничего не выбрано
    onClose: () => void;
    onDelete: (id: string) => Promise<void>;
}

export default function EventDetailModal({
                                             open,
                                             event,
                                             onClose,
                                             onDelete,
                                         }: EventDetailModalProps) {
    if (!event) return null;

    const handleDelete = async () => {
        await onDelete(event.id);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{event.title}</DialogTitle>

            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

                    {/* дата */}
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Дата
                        </Typography>
                        <Typography variant="body1">
                            {formatDisplayDate(event.event_date)}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* время */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Начало
                            </Typography>
                            <Typography variant="body1">
                                {formatTime(event.start_at)}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Окончание
                            </Typography>
                            <Typography variant="body1">
                                {formatTime(event.end_at)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* описание — показываем только если есть */}
                    {event.description && (
                        <>
                            <Divider />
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Описание
                                </Typography>
                                <Typography variant="body1">
                                    {event.description}
                                </Typography>
                            </Box>
                        </>
                    )}

                    <Divider />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                {/* кнопка удаления — красная слева */}
                <Button
                    onClick={handleDelete}
                    color="error"
                    variant="outlined"
                    sx={{ mr: "auto" }} // прижимаем влево
                >
                    Удалить
                </Button>

                <Button onClick={onClose} color="inherit">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function formatDisplayDate(dateStr: string): string {
    const date = new Date(dateStr.substring(0, 10) + "T00:00:00");
    return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function formatTime(rfc3339: string): string {
    return new Date(rfc3339).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

