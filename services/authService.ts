//импортируем типы
import { LoginRequest, RegisterRequest, AuthResponse, RegisterResponse} from "@/types/auth"

//@/ - алиас для корня проекта, настроен в tsconfig.json
//можно писать "@/types/auth", а не "../../../types/auth"

//process.env - переменные окрудения Next.js
// NEXT_PUBLIC_ префикс обязателен — только такие переменные доступны в браузере
// если переменная не задана — используем localhost для локальной разработки
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";


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