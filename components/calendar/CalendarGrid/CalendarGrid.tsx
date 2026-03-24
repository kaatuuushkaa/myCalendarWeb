"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Event } from "@/types/event";
import DayCell from "../DayCell/DayCell";

interface CalendarGridProps {
    events: Event[];
    onDayClick: (date: string) => void;
    onEventClick: (event: Event) => void;
    year: number;
    onYearChange: (year: number) => void;
}

const MONTHS = [
    "Январь", "Февраль", "Март", "Апрель",
    "Май", "Июнь", "Июль", "Август",
    "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function CalendarGrid({events, onDayClick, onEventClick, year, onYearChange}:CalendarGridProps) {
    // const currentYear = new Date().getFullYear();
    // const [year, setYear] = useState(new Date().getFullYear());
    // const today = new Date();
    const today    = new Date();
    const todayRef = useRef<HTMLDivElement | null>(null);

    // скроллим к сегодня только когда год совпадает с текущим
    useEffect(() => {
        if (year === new Date().getFullYear() && todayRef.current) {
            todayRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [year]);

    // eventsMap — словарь { "2026-03-20": [event1, event2] }
    // чтобы быстро находить ивенты для конкретного дня
    // без этого пришлось бы фильтровать весь массив для каждой ячейки
    const eventsMap = events.reduce<Record<string, Event[]>>((acc, event) => {
        const date = event.event_date.substring(0, 10);
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {});

    // getDaysInMonth — возвращает массив дней месяца
    // каждый элемент это Date объект или null (пустая ячейка в начале сетки)
    const getDaysInMonth = (month: number): (Date | null)[] => {
        const days: (Date | null)[] = [];
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // getDay() возвращает 0=воскресенье, 1=понедельник...
        // нам нужен сдвиг от понедельника
        // если первый день воскресенье (0) → сдвиг 6, иначе день-1
        const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        // добавляем пустые ячейки в начало чтобы выровнять по дням недели
        for (let i = 0; i < startOffset; i++) {
            days.push(null);
        }

        // добавляем все дни месяца
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }

        return days;
    };

    // formatDate — форматирует Date в строку "2026-03-20"
    // именно в таком формате хранится event_date на бэкенде
    const formatDate = (date: Date): string => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0"); // padStart добавляет 0 спереди
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const isToday = (date: Date): boolean => {
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* заголовок с годом и стрелками переключения */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 4 }}>
                {/* стрелка влево — предыдущий год */}
                <IconButton onClick={() => onYearChange(year-1)}>
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
            {/* заголовок с годом */}
            <Typography variant="h4" fontWeight={700}>
                {year}
            </Typography>

                {/* стрелка вправо — следующий год */}
                <IconButton onClick={() => onYearChange(year + 1)}>
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* сетка 12 месяцев — 3 колонки */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // 3 месяца в ряд
                    gap: 4,
                }}
            >
                {MONTHS.map((monthName, monthIndex) => {
                    const days = getDaysInMonth(monthIndex);

                    return (
                        <Box key={monthIndex}>
                            {/* название месяца */}
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                mb={1}
                                sx={{ color: "#333" }}
                            >
                                {monthName}
                            </Typography>

                            {/* сетка дней */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(7, 1fr)", // 7 дней в ряд
                                    gap: "2px",
                                }}
                            >
                                {/* заголовки дней недели */}
                                {WEEKDAYS.map((wd) => (
                                    <Typography
                                        key={wd}
                                        variant="caption"
                                        textAlign="center"
                                        sx={{
                                            color: "#999",
                                            fontWeight: 600,
                                            pb: "4px",
                                        }}
                                    >
                                        {wd}
                                    </Typography>
                                ))}

                                {/* ячейки дней */}
                                {days.map((date, i) => {
                                    if (!date) {
                                        // пустая ячейка — выравнивание сетки
                                        return <Box key={`empty-${i}`} />;
                                    }

                                    const dateStr = formatDate(date);
                                    const dayEvents = eventsMap[dateStr] || [];
                                    const isTodayCell = isToday(date);

                                    return (
                                        <Box
                                            // ref на сегодняшнюю ячейку — для автоскролла
                                            ref={isTodayCell ? todayRef : null}
                                            key={dateStr}
                                        >
                                            <DayCell
                                                date={date}
                                                dateStr={dateStr}
                                                events={dayEvents}
                                                isToday={isTodayCell}
                                                onDayClick={onDayClick}
                                                onEventClick={onEventClick}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}