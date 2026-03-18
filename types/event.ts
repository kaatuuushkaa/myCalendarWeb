export interface Event {
    id: string;
    user_id: string;
    title: string;
    description: string;
    start_at: string;
    end_at: string;
    event_date: string;
}

export interface CreateEventRequest {
    title: string;
    description: string;
    start_at: string;
    end_at: string;
}

export interface GetUserEventsResponse {
    events: Event[];
}