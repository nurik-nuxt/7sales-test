<script setup lang="ts">
import { useChannelStore } from "~/src/shared/store/channel";
import { useToast } from "primevue/usetoast";
import { useSubscriptionStore } from "~/src/shared/store/subscription";

const subscriptionStore = useSubscriptionStore();
const toast = useToast();
const { t } = useI18n();
const channels = ref([
  {
    id: 1,
    title: 'amoCRM',
    key: 'amocrm'
  },
  {
    id: 2,
    title: 'Bitrix24',
    key: 'bitrix24'
  },
  {
    id: 3,
    title: 'Telegram',
    key: 'telegram'
  },
  {
    id: 4,
    title: 'Whatsapp',
    key: 'whatsapp'
  },
  {
    id: 5,
    title: 'Avito',
    key: 'avito'
  },
  {
    id: 6,
    title: t('onlineChat'),
    key: 'onlineChat'
  }
]);

const channelStore = useChannelStore();

const createChannel = (key: string) => {
  return navigateTo({ name: `channels-create-${key}` })
}

const availableChannels = computed(() => {
  return channelStore.getChannels
})

const deleteChannelId = ref<string | null>(null);
const visibleChannel = ref<boolean>(false)
const deleteChannel = async () => {
  if (deleteChannelId.value) {
    await channelStore.deleteChannel(deleteChannelId.value).then(async (res) => {
      if (res.success) {
        await channelStore.getAllChannels();
        deleteChannelId.value = null;
        visibleChannel.value = false;
      } else {
        toast.add({ severity: 'error', summary: t('error'), detail: res?.message, life: 5000 })
      }
    });
  }
}

const removeChannel = async (id: string) => {
  visibleChannel.value = true;
  deleteChannelId.value = id
}
const openChannel = (type: string, id: string) => {
  if (type === 'wappi') {
    return navigateTo({ name: `channels-whatsapp-id`, params: { id }})
  }
  return navigateTo({ name: `channels-${type}-id`, params: { id }})
}

onMounted(async () => {
  await channelStore.getAllChannels();
})

const test = async () => {
  await subscriptionStore.subscriptionConsume()
}
</script>

<template>
  <Dialog v-model:visible="visibleChannel" modal :header="t('deleteChannel')" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">Вы точно хотите удалить этого канала?</span>
    <div class="flex justify-content-center gap-2 w-full">
      <Button type="button" :label="t('delete')" severity="danger" @click="deleteChannel"></Button>
      <Button type="button" :label="t('cancel')" @click="visibleChannel = false"></Button>
    </div>
  </Dialog>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5 class="font-bold">{{ $t('connectNewChannel') }}</h5>
        <div class="mt-5 bot-list">
          <button
              v-for="(bot) in channels"
              :key="bot.id"
              class="bot-item"
              @click="createChannel(bot.key)"
          >{{ bot.title }}</button>
        </div>
        <div class="chanel-list mt-2" v-if="availableChannels?.length">
          <h5 class="font-bold mb-2">{{ $t('connectedChannels') }}</h5>
          <span class="chanel-list__item" v-for="channel in availableChannels" :key="channel._id">
             <span class="mr-2">
               <i v-if="channel.type === 'telegram'" style="color: #3B82F6; font-size: 27px" class="pi pi-telegram" />
               <i v-if="channel.type === 'whatsapp'" style="color: #22c55e; font-size: 27px" class="pi pi-whatsapp" />
               <span v-if="channel.type === 'avito'" style="width: 30px">
                <svg width="30px" height="30px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="140" r="40" fill="#59ff59"/>
                  <circle cx="140" cy="140" r="30" fill="#ff5959"/>
                  <circle cx="140" cy="80" r="50" fill="#59a1ff"/>
                  <circle cx="80" cy="60" r="20" fill="#a159ff"/>
                </svg>
              </span>
               <span v-if="channel.type === 'bitrix24'" style="width: 30px">
                 <svg width="30px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="512" cy="512" r="512" style="fill:#2fc7f7"/>
                    <path d="M877 499.07h-22v-22h-5.91V505H877zM852.07 543A43.93 43.93 0 1 1 896 499.07 44.17 44.17 0 0 1 852.07 543zm0-79.83a35.9 35.9 0 1 0 35.9 35.9 35.87 35.87 0 0 0-35.9-35.9zm-84.48 59.56v-70.12h-14.78l-56.18 73.07v13.94h50.69v27.88h20.27v-27.88h16.9v-16.9zm-20.27-16.47v16.04H733.8c-4.22 0-11.83.42-14.36.42l28.72-38.86c0 3.38-.84 13.52-.84 22.39zm-132.21 60.82h79v-17.32h-52.39c7.18-28.72 51.11-35.06 51.11-67.16 0-17.32-11.83-30-36.33-30a85.18 85.18 0 0 0-38 9.29L624 478c8.45-3.8 17.74-7.6 29.14-7.6 9.29 0 17.74 3.8 17.74 14.36.41 23.6-51.12 25.29-55.77 82.32zm-76.45-46.89-33.79-46.46h24.5l22 30.41 22.39-30.41h24.5L564 520.19l34.64 46.89h-24.5l-22.39-31.26-22.81 31.26h-24.5zm-73.92-75.61a14.36 14.36 0 0 1 28.72 0c0 7.6-6.34 13.94-14.78 13.94s-13.94-5.91-13.94-13.94zm2.53 29.14h23.65v93.35h-23.64zm-73.5 0h20.27l2.53 10.56c8.45-8.45 16.05-12.67 25.77-12.67a24.76 24.76 0 0 1 13.09 3.8L447 495.27a20.08 20.08 0 0 0-10.56-3c-6.34 0-11.4 2.53-19 9.29v65.94h-23.66zm-124.6-29.14a14.24 14.24 0 0 1 14.36-14.36c8 0 14.78 5.91 14.78 14.36 0 7.6-6.34 13.94-14.78 13.94s-14.36-5.91-14.36-13.94zm2.53 29.14h23.65v93.35h-23.64zm55.3 70.55v-52h-16.9v-18.54H327v-21.54l23.65-6.76v28.3H379l-5.91 18.59H350.7v46c0 8.87 3 11.83 9.29 11.83a26.42 26.42 0 0 0 14.36-4.65l7.18 16.05c-6.76 4.65-18.16 7.18-27.46 7.18-16.89.46-27.07-8.84-27.07-24.46zM164 437h38c27.88 0 40.55 16.05 40.55 32.95 0 11.4-5.49 21.54-15.63 27v.42c15.21 3.8 24.5 16.05 24.5 31.26 0 20.27-15.21 38.44-45.62 38.44H164zm35.06 54.49c13.09 0 20.27-7.18 20.27-17.32 0-9.71-6.34-17.32-20.27-17.32h-11v34.64zm3.8 56.18c15.63 0 24.5-5.91 24.5-19 0-11-8.45-17.74-21.54-17.74h-17.74v36.75z" style="fill:#fff"/>
                 </svg>
               </span>
               <span v-if="channel.type === 'amocrm'" style="width: 30px">
                 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 30 30" version="1.1">
<defs>
<filter id="alpha" filterUnits="objectBoundingBox" x="0%" y="0%" width="100%" height="100%">
  <feColorMatrix type="matrix" in="SourceGraphic" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
</filter>
<mask id="mask0">
  <g filter="url(#alpha)">
<rect x="0" y="0" width="30" height="30" style="fill:rgb(0%,0%,0%);fill-opacity:0.913725;stroke:none;"/>
  </g>
</mask>
<clipPath id="clip1">
  <rect x="0" y="0" width="30" height="30"/>
</clipPath>
<g id="surface5" clip-path="url(#clip1)">
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(96.862745%,98.431373%,99.215686%);fill-opacity:1;" d="M 12.359375 0.972656 C 20.851562 0.421875 26.265625 4.21875 28.609375 12.359375 C 29.292969 20.855469 25.542969 26.273438 17.359375 28.609375 C 8.863281 29.292969 3.449219 25.542969 1.109375 17.359375 C 0.460938 8.839844 4.210938 3.378906 12.359375 0.972656 Z M 12.359375 0.972656 "/>
</g>
</defs>
<g id="surface1">
<use xlink:href="#surface5" mask="url(#mask0)"/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(21.960784%,60.784314%,82.352941%);fill-opacity:1;" d="M 24.027344 5.972656 C 23.675781 6.496094 23.167969 6.773438 22.5 6.804688 C 17.027344 6.609375 11.5625 6.609375 6.109375 6.804688 C 5.753906 6.570312 5.800781 6.246094 6.25 5.832031 C 6.1875 5.722656 6.09375 5.675781 5.972656 5.695312 C 11.085938 1.34375 16.546875 0.925781 22.359375 4.445312 C 22.886719 5.019531 23.445312 5.527344 24.027344 5.972656 Z M 24.027344 5.972656 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(18.039216%,58.431373%,81.176471%);fill-opacity:1;" d="M 5.972656 5.695312 C 6.09375 5.675781 6.1875 5.722656 6.25 5.832031 C 5.800781 6.246094 5.753906 6.570312 6.109375 6.804688 C 11.5625 6.609375 17.027344 6.609375 22.5 6.804688 C 23.167969 6.773438 23.675781 6.496094 24.027344 5.972656 C 26.746094 8.632812 27.902344 11.875 27.5 15.695312 C 27.21875 15.925781 26.894531 16.019531 26.527344 15.972656 C 27.019531 13.636719 26.183594 12.847656 24.027344 13.609375 C 23.261719 14.738281 23.355469 15.804688 24.304688 16.804688 C 22.226562 17.269531 21.535156 16.4375 22.222656 14.304688 C 23.105469 13.191406 24.261719 12.636719 25.695312 12.640625 C 23 11.207031 21.148438 11.945312 20.140625 14.859375 C 20.046875 14.859375 19.953125 14.859375 19.859375 14.859375 C 20.230469 12.777344 19.398438 11.992188 17.359375 12.5 C 17.125 12.785156 16.847656 13.015625 16.527344 13.195312 C 15.71875 11.613281 14.652344 11.429688 13.332031 12.640625 C 13.15625 12.136719 12.832031 11.769531 12.359375 11.527344 C 11.746094 11.921875 11.328125 12.480469 11.109375 13.195312 C 10.804688 14.28125 10.621094 15.394531 10.554688 16.527344 C 10.273438 16.761719 9.949219 16.851562 9.582031 16.804688 C 9.453125 15.441406 9.640625 14.144531 10.140625 12.917969 C 10.132812 12.492188 9.945312 12.167969 9.582031 11.945312 C 8.515625 11.902344 7.40625 11.902344 6.25 11.945312 C 5.269531 12.601562 4.4375 13.386719 3.75 14.304688 C 3.769531 14.183594 3.722656 14.089844 3.609375 14.027344 C 3.414062 14.4375 3.089844 14.621094 2.640625 14.582031 C 2.683594 13.929688 2.636719 13.28125 2.5 12.640625 C 2.359375 14.023438 2.316406 15.414062 2.359375 16.804688 C 1.554688 12.46875 2.757812 8.765625 5.972656 5.695312 Z M 5.972656 5.695312 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(16.470588%,56.862745%,80.392157%);fill-opacity:1;" d="M 7.359375 12.917969 C 7.6875 12.855469 7.964844 12.949219 8.195312 13.195312 C 7.984375 14.105469 7.847656 15.03125 7.777344 15.972656 C 7.210938 17.085938 6.46875 17.273438 5.554688 16.527344 C 5.417969 14.949219 6.019531 13.746094 7.359375 12.917969 Z M 7.359375 12.917969 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(29.411765%,62.352941%,82.745098%);fill-opacity:1;" d="M 25.140625 14.304688 C 25.457031 14.386719 25.644531 14.617188 25.695312 15 C 25.601562 15.230469 25.507812 15.464844 25.417969 15.695312 C 25.152344 15.265625 25.058594 14.800781 25.140625 14.304688 Z M 25.140625 14.304688 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(55.686275%,75.686275%,89.019608%);fill-opacity:1;" d="M 19.859375 14.859375 C 19.953125 14.859375 20.046875 14.859375 20.140625 14.859375 C 20.222656 15.535156 20.132812 16.183594 19.859375 16.804688 C 19.5 16.117188 19.5 15.46875 19.859375 14.859375 Z M 19.859375 14.859375 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(14.117647%,55.686275%,79.607843%);fill-opacity:1;" d="M 3.75 14.304688 C 2.769531 17.253906 3.785156 18.59375 6.804688 18.332031 C 7.300781 18.117188 7.71875 17.792969 8.054688 17.359375 C 8.488281 18.441406 9.226562 18.71875 10.277344 18.195312 C 10.980469 18.90625 11.671875 18.90625 12.359375 18.195312 C 12.589844 17.09375 12.730469 15.984375 12.777344 14.859375 C 12.9375 13.96875 13.445312 13.507812 14.304688 13.472656 C 14.257812 15.140625 14.304688 16.808594 14.445312 18.472656 C 14.96875 18.710938 15.476562 18.617188 15.972656 18.195312 C 15.707031 16.613281 16.078125 15.179688 17.082031 13.890625 C 17.347656 13.753906 17.625 13.707031 17.917969 13.75 C 17.886719 14.679688 17.792969 15.605469 17.640625 16.527344 C 17.613281 17.203125 17.796875 17.804688 18.195312 18.332031 C 19.011719 18.433594 19.796875 18.292969 20.554688 17.917969 C 21.738281 18.46875 22.988281 18.609375 24.304688 18.332031 C 25.144531 17.492188 26.160156 17.167969 27.359375 17.359375 C 27.214844 18.480469 26.84375 19.5 26.25 20.417969 C 26.023438 20.160156 25.792969 19.878906 25.554688 19.582031 C 18.496094 19.882812 11.367188 19.882812 4.167969 19.582031 C 3.800781 19.757812 3.570312 20.035156 3.472656 20.417969 C 2.804688 19.332031 2.4375 18.128906 2.359375 16.804688 C 2.316406 15.414062 2.359375 14.023438 2.5 12.640625 C 2.636719 13.28125 2.683594 13.929688 2.640625 14.582031 C 3.089844 14.621094 3.414062 14.4375 3.609375 14.027344 C 3.722656 14.089844 3.769531 14.183594 3.75 14.304688 Z M 3.75 14.304688 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(7.058824%,53.333333%,78.431373%);fill-opacity:1;" d="M 26.25 20.417969 C 25.910156 21.402344 25.355469 22.234375 24.582031 22.917969 C 18.101562 22.546875 11.621094 22.546875 5.140625 22.917969 C 4.367188 22.234375 3.8125 21.402344 3.472656 20.417969 C 3.570312 20.035156 3.800781 19.757812 4.167969 19.582031 C 11.367188 19.882812 18.496094 19.882812 25.554688 19.582031 C 25.792969 19.878906 26.023438 20.160156 26.25 20.417969 Z M 26.25 20.417969 "/>
<path style=" stroke:none;fill-rule:evenodd;fill:rgb(7.45098%,51.764706%,77.647059%);fill-opacity:1;" d="M 24.582031 22.917969 C 22.039062 26.15625 18.660156 27.730469 14.445312 27.640625 C 10.578125 27.488281 7.476562 25.914062 5.140625 22.917969 C 11.621094 22.546875 18.101562 22.546875 24.582031 22.917969 Z M 24.582031 22.917969 "/>
</g>
</svg>
               </span>
             </span>
            <div class="channel-info">
              <span class="channel-title">{{ channel.title }}</span>
            </div>
            <i style="cursor: pointer; margin-left: auto; margin-right: 10px; color: #EE9186;" class="pi pi-trash" @click="removeChannel(channel._id)"/>
            <i style="cursor: pointer" class="pi pi-cog" @click="openChannel(channel.type, channel._id)"/>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bot-list {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.channel-type {
  margin-left: 8px;
}


@media (max-width: 601px) {
  .bot-list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .channel-type {
    margin-left: 0;
  }
  .channel-title {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.bot-item {
  background: #F0F4F9;
  border: 1px solid var(--surface-border);
  padding: 16px;
  box-shadow: var(--card-shadow);
  border-radius: var(--border-radius);
  cursor: pointer;
}

.chanel-list__item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.channel-info {
  display: flex;
  flex-direction: column;
}

@media (min-width: 601px) {
  .channel-info {
    flex-direction: row;
  }
}
</style>
