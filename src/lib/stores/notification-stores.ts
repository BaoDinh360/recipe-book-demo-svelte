import { writable } from "svelte/store";

export type NotificationType = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
export interface Notification {
    id: number;
    message: string;
    notiType: NotificationType;
    duration: number; // duration in miliseconds
}

export const notifications = writable<Notification[]>([]);
let nextId = 0;

export const addNotification = (message: string, notiType: NotificationType = 'INFO', duration: number = 3000) => {
    const id = nextId++;
    const newNoti: Notification = {
        id,
        message,
        notiType,
        duration
    };

    notifications.update(n => [...n, newNoti]);

    setTimeout(() => removeNotification(id), duration);
}

export const removeNotification = (id: number) => {
    notifications.update(n => n.filter(note => note.id !== id));
}

export const notifySuccess = (message: string) => addNotification(message, 'SUCCESS');
export const notifyError = (message: string) => addNotification(message, 'ERROR', 5000);
