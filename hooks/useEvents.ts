"use client";

import { useState, useEffect, useCallback} from "react";
import { Event, CreateEventRequest} from "@/types/event";
import {getUserEvents, createEvent, deleteEvent, updateEvent} from "@/services/eventService";

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading]= useState(true);
    const [error, setError]=useState<string | null>(null);

    //loadEvents - загружает ивенты с бэкенда
    //useCallback мемоизирует функцю - не пересоздается при каждом рендере
    const loadEvents = useCallback(async ()=> {
        try {
            setLoading(true);
            const data = await getUserEvents();
            setEvents(data);
        } catch (e) {
            setError(e instanceof Error ? e.message: "Ошибка загрузки");
        }finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handleCreate = async (req:CreateEventRequest):Promise<void> => {
        await createEvent(req);
        // перезагружаем весь список — проще чем вручную обновлять state
        await loadEvents();
        // const data = await getUserEvents(); // GET /event/list
        // setEvents(data);
    };

    const handleDelete = async (id:string):Promise<void> => {
        await deleteEvent(id);
        // убираем из локального state без лишнего запроса
        setEvents((prev) => prev.filter((e) => e.id !==id));
    };

   const  handleUpdate= async (id:string, req: CreateEventRequest):Promise<void> => {
       await updateEvent(id, req);
       await loadEvents();
    };

   return {
       events,
       loading,
       error,
       handleCreate,
       handleDelete,
       handleUpdate,
   };
}