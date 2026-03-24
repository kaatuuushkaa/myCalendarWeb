//импортируем типы
import {LoginRequest, RegisterRequest, AuthResponse, RegisterResponse, UserProfile, UpdateUserRequest, ResetPasswordRequest} from "@/types/auth"

//@/ - алиас для корня проекта, настроен в tsconfig.json
//можно писать "@/types/auth", а не "../../../types/auth"

//process.env - переменные окрудения Next.js
// NEXT_PUBLIC_ префикс обязателен — только такие переменные доступны в браузере
// если переменная не задана — используем localhost для локальной разработки
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface GetUserResponse {
    user: UserProfile;
}
//вспомогательная функция для запроса
//принимает endpoint (например "/user/auth") и данные для отправки
//возвращаем promise с типизированным ответом - Т это generic, подставим нужный тип при вызове
async function post <T>(endpoint: string, body:unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
        },
        //{login: "alice"} → '{"login":"alice"}'
        body: JSON.stringify(body),
    });

    //читаем тело ответа и парсим обратно в объект
    const data = await response.json();

    //если код не 2хх - бросаем ошибку с текстом от сервера
    //остановится выполнение и попадет в catch в хуке
    if (!response.ok) {
        throw new Error(data.message || "Что-то пошло не так")
    }

    return data as T;
}

//login - отправляет логин и пароль, получает токены
//принимает LoginRequest, возвращает Promise<AuthResponse>
export async function login(data: LoginRequest): Promise<AuthResponse> {
    return post<AuthResponse>("/user/auth", data);
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
    return post<RegisterResponse>("/user/register", data);
}

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token");
    return {
        "Content-Type":"application/json",
        Authorization: `Bearer ${token}`,
    };
}

async function request<T>(url:string, options:RequestInit): Promise<T> {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Что-то пошло не так");
    }

    return data as T;
}

export async function getUser(username: string): Promise<GetUserResponse> {
    return request<GetUserResponse>(
        `${BASE_URL}/user/get/${username}`,
        { method: "GET", headers: getAuthHeaders() }
    );
}

export async function updateUser(username: string, data: UpdateUserRequest): Promise<UserProfile> {
    return request<UserProfile>(
        `${BASE_URL}/user/update/${username}`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        }
    );
}

export async function resetPassword(username: string, data: ResetPasswordRequest): Promise<void> {
    await request<void>(
        `${BASE_URL}/user/reset-password/${username}`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        }
    );
}

export function getUsernameFromStorage(): string {
    return localStorage.getItem("username") || "";
}