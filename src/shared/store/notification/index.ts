import { useApi } from "~/composable";

export const useNotificationStore = defineStore('notification', {

    state: () => {
        return {
            notifications: [] as any,
            telegramNotificationAccounts: [] as any
        }
    },

    getters: {
        getNotifications: (state) => state.notifications,
        getTelegramNotificationAccounts: (state) => state.telegramNotificationAccounts,
    },

    actions: {
        async getTelegramNotificationLink() {
            try {
                return await useApi(`/telegram/linkTelegram`, {
                    method: 'GET'
                });
            } catch (e) {
                console.log(e)
            }
        },

        setNotification(notification: any) {
          this.notifications[0] = notification
        },

        async getNotificationList() {
            try {
                const resp = await useApi(`/notification`, {
                    method: 'GET'
                })
                if (resp?.notifications) {
                    this.notifications = resp?.notifications
                }
            } catch (e) {
                console.error(e)
            }
        },

        async getUsersForNotification() {
            try {
                const response = await useApi(`/telegram/accounts-for-notification`, {
                    method: 'GET'
                })
                if (response?.success) {
                    this.telegramNotificationAccounts = response?.accounts
                }
            } catch (e) {
                console.error(e)
            }
        },

        async unsubscribeTelegramAccount(chatId: number) {
            try {
                const response = await useApi(`/telegram/unsubscribe`, {
                    method: 'POST',
                    body: {
                        chat_id: chatId
                    }
                })
                if (response) {
                    return response?.success
                }
            } catch (e) {
                console.error(e)
            }
        },

        async subscribeTelegramAccount(chatId: number) {
            try {
                const response = await useApi(`/telegram/subscribe`, {
                    method: 'POST',
                    body: {
                        chat_id: chatId
                    }
                })
                if (response) {
                    return response?.success
                }
            } catch (e) {
                console.error(e)
            }
        },

        async deleteTelegramAccount(chatId: number) {
            try {
                const response = await useApi(`/telegram/delete`, {
                    method: 'DELETE',
                    body: {
                        chat_id: chatId
                    }
                })
                if (response) {
                    return response?.success
                }
            } catch (e) {
                console.error(e)
            }
        },
    }
})