<script setup lang="ts">
import { useNotificationStore } from "~/src/shared/store/notification";
import { useToast } from "primevue/usetoast";
import { useClipboard } from '@vueuse/core';

const { t } = useI18n();
const toast = useToast();
const { copy } = useClipboard();

const notificationStore = useNotificationStore();

const telegramLink = ref<string>('')

const copyToClipboard = async () => {
  await copy(<string>telegramLink.value).then(() => {
    toast.add({ severity: 'success', summary: t('successClipboard'), life: 5000 });

  });
}


const openTelegram = () => {
  window.open(telegramLink.value, '_blank');
}

const telegramNotificationAccounts = computed(() => {
  return notificationStore.getTelegramNotificationAccounts
})

onMounted(async () => {
  await notificationStore.getTelegramNotificationLink().then((res) => {
    const response = JSON.parse(res);
    telegramLink.value = response?.link;
  })
  await notificationStore.getUsersForNotification()
})

const unsubscribeTelegram = async (chatId: number) => {
  await notificationStore.unsubscribeTelegramAccount(chatId).then(async (res) => {
    if (res) {
      await notificationStore.getUsersForNotification()
    }
  })
}

const subscribeTelegram = async (chatId: number) => {
  await notificationStore.subscribeTelegramAccount(chatId).then(async (res) => {
    if (res) {
      await notificationStore.getUsersForNotification()
    }
  })
}

const deleteTelegram = async (chatId: number) => {
  await notificationStore.deleteTelegramAccount(chatId).then(async (res) => {
    if (res) {
      await notificationStore.getUsersForNotification()
    }
  })
}
</script>

<template>
  <div class="notification-wrapper">
    <div class="notification-card">
      <div class="flex flex-column gap-2">
        <h5>{{ $t('telegram') }}</h5>
        <span style="color: #0f172a;">{{ $t('subscribeBotLink') }}</span>
        <div class="flex align-items-center gap-2 mt-3 mobile">
          <Button raised :label="t('subscribe')" class="connect-btn" @click="openTelegram"/>
          <InputGroup style="max-width: 500px">
            <InputText :value="telegramLink" readonly/>
            <InputGroupAddon>
              <i class="pi pi-copy" style="cursor: pointer" @click="copyToClipboard"></i>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
    <div class="notification-card">
      <div v-if="telegramNotificationAccounts?.length">
        <h5>Аккаунты подписанные на бота Уведомления 7s</h5>
        <div class="flex flex-column gap-3">
          <div v-for="(telegramAccount, index) in telegramNotificationAccounts" :key="index" class="flex align-items-center w-full">
              <span style="width: 150px">
                @{{ telegramAccount.nickname }}
              </span>
<!--            <Button v-if="telegramAccount.status === 'active'" label="Отписаться" severity="danger" @click="unsubscribeTelegram(telegramAccount?.chat_id)"/>-->
<!--            <Button v-if="telegramAccount.status !== 'active'" label="Подписаться" @click="subscribeTelegram(telegramAccount?.chat_id)"/>-->
            <Button severity="danger" label="Удалить" @click="deleteTelegram(telegramAccount?.chat_id)" class="ml-auto"/>
          </div>
        </div>
      </div>
    </div>
    <div class="notification-card">
      <div class="flex flex-column gap-2">
        <h5>{{ $t('email') }}</h5>
        <span style="color: #0f172a;">{{ $t('enterEmailForNotifications') }}</span>
        <InputText class="mt-3" style="max-width: 500px" :placeholder="t('email')" id="email" type="text" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .mobile {
    display: flex;
    flex-direction: column;
  }
  .connect-btn {
    width: 100%;
  }
}
</style>