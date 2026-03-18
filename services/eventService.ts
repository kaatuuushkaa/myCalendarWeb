import { CreateEventRequest, Event, GetUserEventsResponse} from "@/types/event";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

//возвращаем заголовки с JWT токеном
function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getUserEvents(): Promise<Event[]> {
    const res = await fetch(`${BASE_URL}/event/list`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Не удалось загрузить ивенты");

    const data: GetUserEventsResponse = await res.json();

    // если ивентов нет — бэкенд может вернуть null вместо []
    // поэтому используем ?? [] как защиту
    return data.events ?? [];
}

export async function createEvent(req: CreateEventRequest): Promise<Event> {
    const res = await fetch(`${BASE_URL}/event/create`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(req),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Не удалось создать ивент")
    }

    return res.json();
}

export async function deleteEvent(id:string): Promise<void> {
    const res = await fetch(`${BASE_URL}/event/delete/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Не удалось удалить ивент");
}

export async function updateEvent (id: string, req: CreateEventRequest):Promise<Event> {
    const res = await fetch(`${BASE_URL}/event/update/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({id, ...req}),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Не удалось обновить ивент")
    }
    return res.json();
}