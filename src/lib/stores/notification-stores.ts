// import { writable } from "svelte/store";

// const DEFAULT_DURATION = 5000; // 5s

// export type NotificationType = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
// export interface Notification {
//     id: number;
//     title?: string;
//     message: string;
//     notiType: NotificationType;
//     isDuration: boolean; // show noti in duration
//     duration: number | undefined; // duration in miliseconds
// }

// export const notifications = writable<Notification[]>([]);
// let nextId = 0;

// const addNotification = (
//     message: string,
//     title?: string,
//     notiType: NotificationType = 'INFO',
//     isDuration: boolean = false, 
//     duration: number | undefined = undefined) => {
//     const id = nextId++;
//     if(isDuration && duration === undefined) {
//         // use default duration if not passed in
//         duration = DEFAULT_DURATION;
//     }
//     const newNoti: Notification = {
//         id,
//         title,
//         message,
//         notiType,
//         isDuration,
//         duration
//     };

//     notifications.update(n => [...n, newNoti]);

//     if(isDuration) {
//         setTimeout(() => removeNotification(id), duration);
//     }
// }

// export const removeNotification = (id: number) => {
//     notifications.update(n => n.filter(note => note.id !== id));
// }

// export const notifySuccess = (message: string, title?: string) => (
//     addNotification(
//         message,
//         title ?? 'Success !',
//         'SUCCESS',
//         true
//     ));
// export const notifyError = (message: string, title?: string) => (
//     addNotification(
//         message,
//         title ?? 'Error !',
//         'ERROR',
//         true
//     ));
