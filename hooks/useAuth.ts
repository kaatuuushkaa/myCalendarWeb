//use client - директива next.js
//говорит что этот код выполняется в браузере, а не на сервере
//useState и useRouter работают только на клиенте - без этой строки будет ошибка
"use client";

import {useState} from "react";
import {useRouter } from "next/navigation";
import { login, register } from "@/services/authService";
import {LoginRequest, RegisterRequest } from "@/types/auth";

//описываем что возвращает наш хук
interface UseAuthReturn {
    loading: boolean; //идет ли запрос прямо сейчас
    error: string | null; //текст ошибки или null если ошибки нет
    handleLogin: (data: LoginRequest) => Promise<void>;
    handleRegister: (data: RegisterRequest) => Promise<void>;
}

//useAuth - хук который инкапсулирует всю логику авторизации
//страницы используют этот хук и не знают про fetch, токены и тд
export function useAuth(): UseAuthReturn {
    //loading-true пока идет запрос, показываем спиннер на кнопке
    const [loading, setLoading] = useState(false);

    //error - строку с ошибкой показываем под формой
    //null означает что ошибки нет
    const [error, setError] = useState<string | null>(null)

    //useRouter - хук Next.js для программной навигации между страницами
    const router = useRouter();

    //handleLogin - вызывается когда пользователь нажимает "Войти"
    const handleLogin = async(data: LoginRequest): Promise<void> => {
        //сбрамываем ошибки
        setError(null);
        //показываем что идет загрузка
        setLoading(true);

        try {
            //вызываем сервис - он делает fetch к go бэкенду
            const response = await login(data);

            //сохраняем токены в localStorage браузера
            //localStorage - хранилище в браузере, данные живут до явной очистки
            localStorage.setItem("access_token", response.access_token);    // было response.access_token
            localStorage.setItem("refresh_token", response.refresh_token);  // было response.refresh_token

            //перенаправляем на страницу календаря
            router.push("/calendar");

        }catch (e) {
            //если сервер вернул ошибку - показываем ее пользователю
            // e instanceof Error проверяет что это объект ошибки, а не что-то другое
            setError(e instanceof Error ? e.message:"Ошибка входа");
        } finally {
            //finally выполняется всегда, независимо от результата
            //убираем состояние загрузки
            setLoading(false);
        }
    };

    const handleRegister = async(data: RegisterRequest): Promise<void> =>{
        setError(null);
        setLoading(true);

        try {
            await register(data);

            //после регистрации отправляем на страницу входа
            //?registered=true - страница входа увидит это и покажет сообщение
            router.push("/login?registered=true");
        } catch (e) {
            setError(e instanceof Error ? e.message:"Ошибка входа");
        } finally {
            setLoading(false);
        }
    }

    return {loading, error, handleLogin, handleRegister};
}