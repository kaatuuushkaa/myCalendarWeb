//определяем форму данных с которыми будем работать

//LoginRequest - то что отправляем на бэк когда пользоватeль входит
//совпадает с полями pb.AuthRequest
export interface LoginRequest {
    login: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    name: string;
    surname: string;
    birth: string;
}

export interface AuthResponse {
    success: boolean;
    access_token: string;
    refresh_token: string;
}

export interface RegisterResponse {
    success: boolean;
}

export interface ApiError {
    code: number;
    message: string;
}