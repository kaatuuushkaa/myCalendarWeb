"use client";

import { Box, Typography, Tooltip } from "@mui/material";
import { Event } from "@/types/event";

interface DayCellProps {
    date: Date;
    dateStr: string;          // "2026-03-20"
    events: Event[];          // ивенты этого дня
    isToday: boolean;
    onDayClick: (date: string) => void;
    onEventClick: (event: Event) => void;
}

export default function DayCell({
                                    date,
                                    dateStr,
                                    events,
                                    isToday,
                                    onDayClick,
                                    onEventClick,
                                }: DayCellProps) {
    const hasEvents = events.length > 0;

    return (
        <Box
            onClick={() => onDayClick(dateStr)}
            sx={{
                position: "relative",
                minHeight: 52,
                borderRadius: 1,
                p: "4px",
                cursor: "pointer",
                // если есть ивенты — пастельно розовый фон
                bgcolor: hasEvents ? "#fce4ec" : "transparent",
                // сегодня — синяя рамка
                border: isToday ? "2px solid #1976d2" : "1px solid transparent",
                "&:hover": {
                    bgcolor: hasEvents ? "#f8bbd0" : "#f5f5f5",
                },
                transition: "background-color 0.15s",
            }}
        >
            {/* номер дня */}
            <Typography
                variant="caption"
                sx={{
                    display: "block",
                    textAlign: "center",
                    fontWeight: isToday ? 700 : 400,
                    // сегодня — белый текст на синем кружке
                    color: isToday ? "white" : hasEvents ? "#c2185b" : "#333",
                    bgcolor: isToday ? "#1976d2" : "transparent",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    lineHeight: "20px",
                    mx: "auto",
                    mb: "2px",
                }}
            >
                {date.getDate()}
            </Typography>

            {/* ярлыки ивентов */}
            {events.map((event) => (
                <Tooltip
                    key={event.id}
                    title={`${event.title} — ${formatTime(event.start_at)}`}
                    placement="top"
                >
                    <Box
                        onClick={(e) => {
                            // stopPropagation — останавливаем всплытие
                            // без этого клик на ивент открыл бы и форму создания
                            e.stopPropagation();
                            onEventClick(event);
                        }}
                        sx={{
                            bgcolor: "#e91e63",
                            color: "white",
                            borderRadius: "3px",
                            px: "4px",
                            py: "1px",
                            mb: "2px",
                            fontSize: 10,
                            // обрезаем длинный текст
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                            "&:hover": {
                                bgcolor: "#c2185b",
                            },
                        }}
                    >
                        {event.title}
                    </Box>
                </Tooltip>
            ))}
        </Box>
    );
}

// форматируем время из RFC3339 в "14:00"
function formatTime(rfc3339: string): string {
    const date = new Date(rfc3339);
    return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });
}