
const DEFAULT_DURATION = 5000; // 5s

export type NotificationType = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
export interface NotificationToast {
    id: number;
    title?: string;
    message: string;
    notiType: NotificationType;
    duration: number | undefined; // duration in miliseconds
}

class NotificationsManager {
    notifications = $state<NotificationToast[]>([]);

    addNotification = (
        message: string,
        title?: string,
        notiType: NotificationType = 'INFO',
        duration: number = DEFAULT_DURATION
    ) => {
        const notiId = Date.now();
        // if(isDuration && duration === undefined) {
        //     // use default duration if not passed in
        //     duration = DEFAULT_DURATION;
        // }
        const newNoti: NotificationToast = {
            id: notiId,
            title,
            message,
            notiType,
            duration
        };
        this.notifications.push(newNoti);
        
        if (duration) {
            setTimeout(() => {
                this.removeNotification(notiId);
            }, duration);
        }
    }

    removeNotification = (notiId: number) => {
        this.notifications = this.notifications.filter(noti => noti.id !== notiId);
    }

    notifySuccess = (message: string, title?: string, duration?: number) => {
        this.addNotification(
            message, 
            title ?? 'Success !', 
            'SUCCESS',
            duration
        );
    }
    notifyError = (message: string, title?: string, duration?: number) => {
        this.addNotification(
            message,
            title ?? 'Error !',
            'ERROR',
            duration
        );
    }
}

export const notiManager = new NotificationsManager();