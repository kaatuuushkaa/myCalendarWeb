"use client";

import { useState} from "react";
import {TextField, InputAdornment, IconButton} from "@mui/material";
// иконки глазика из MUI — встроены в пакет @mui/material
import { Visibility, VisibilityOff } from "@mui/icons-material";

//пропсы - что передать в компонент снаружи
// пропсы это параметры компонента, как аргументы функции
interface AuthInputProps {
    label: string; //подпись поля - "Логин", "Пароль" и тд
    //?-проп необязательный
    type?: string;
    value: string; //текущее значение поля
    onChange: (value:string) => void; //функция которую вызываем когда пользователь печатает
    error?:string; //текст  ошибки под полем, если есть
    // shrinkLabel — принудительно поднимает label наверх
    // нужно для type="date" и type="time" — там placeholder уже занимает место внутри поля
    shrinkLabel?: boolean;
}

export default function AuthInput({
    label,
    type="text", //дефолт значние - если type не передали - будет "text"
    value,
    onChange,
    error,
                                      shrinkLabel,
                                  }: AuthInputProps) {
    // локальное состояние — показывать пароль или нет
    // живёт внутри компонента, снаружи не видно
    const [showPassword, setShowPassword]=useState(false);

    // isPassword — true если это поле пароля
    // только для таких полей показываем глазик
    const isPassword = type === "password";

   const inputType = isPassword ? (showPassword ? "text": "password") :type;

    return (
        <TextField
            fullWidth
            label={label}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={error}
            variant="outlined"
            size="small"
            // InputLabelProps управляет поведением label
            // shrink: true — label всегда наверху, не залезает в поле
            InputLabelProps={shrinkLabel ? { shrink: true } : undefined}
            // InputProps — пропсы для внутреннего input элемента
            // endAdornment — что показывать в конце поля (справа)
            InputProps={
                isPassword
                    ? {
                        endAdornment: (
                            // InputAdornment — контейнер для иконки внутри поля
                            <InputAdornment position="end">
                                {/* IconButton — кликабельная иконка */}
                                <IconButton
                                    // при клике переключаем showPassword на противоположное значение
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    // onMouseDown preventDefault — чтобы поле не теряло фокус при клике на глазик
                                    onMouseDown={(e) => e.preventDefault()}
                                    edge="end"  // прижимаем к правому краю поля
                                >
                                    {/* если пароль виден — показываем зачёркнутый глаз, иначе обычный */}
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }
                    : undefined  // для не-пароля не добавляем ничего
            }
        />
    );
}