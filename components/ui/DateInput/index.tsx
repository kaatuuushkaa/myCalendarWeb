"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface DateInputProps {
    label: string;
    value: string;        // "2000-01-15"
    onChange: (value: string) => void;
    error?: string;
}

export default function DateInput({ label, value, onChange, error }: DateInputProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={label}
                value={value ? dayjs(value) : null}
                onChange={(newValue: Dayjs | null) => {
                    onChange(newValue ? newValue.format("YYYY-MM-DD") : "");
                }}
                format="DD.MM.YYYY"
                slotProps={{
                    textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!error,
                        helperText: error,
                    },
                }}
            />
        </LocalizationProvider>
    );
}