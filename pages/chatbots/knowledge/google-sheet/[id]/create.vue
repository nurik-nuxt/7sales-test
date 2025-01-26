<template>
  <div class="grid">
    <div class="col-12">
      <div class="card h-full">
        <div class="flex align-items-center gap-3">
          <i class="pi pi-table" style="font-size:24px;" />
          <h5 style="margin: 0">Динамическая база знаний</h5>
        </div>
        <div class="flex flex-column gap-3 mt-2">
          <div class="flex flex-column gap-2">
            <span>Название динамической базы знаний (Название должно отражать суть базы)</span>
            <InputText id="google-sheet-link" v-model="knowledgeFileTitle" />
          </div>
          <div class="flex flex-column gap-2">
            <span>Ссылка таблицы (Google Sheet)</span>
            <InputText id="google-sheet-link" v-model="googleSheetLink" />
            <Button :label="t('toPlug')" @click="connectGoogleSheet"></Button>
          </div>
        </div>
        <div class="flex flex-column gap-3 mt-3">
          <div v-if="sheetLists.length" class="flex align-items-center gap-3">
<!--          <div class="flex align-items-center gap-3">-->
            <div class="flex flex-column gap-2">
              <span>Лист</span>
              <Dropdown
                  id="google-sheet-tab"
                  v-model="selectedSheetListTitle"
                  :options="sheetLists"
                  optionLabel="title"
                  optionValue="title"
                  placeholder="Выберите лист"
                  @change="loadColumns"
              />
            </div>
            <div class="flex flex-column gap-2">
              <span>Частота обновления данных (мин)</span>
              <Dropdown
                  id="update-time"
                  v-model="timerUpdate"
                  :options="durations"
                  option-label="title"
                  option-value="value"
              ></Dropdown>
            </div>
          </div>
          <div v-if="columns.length" class="flex flex-colum gap-2 mt-3">
            <span style="font-weight: 700">В базу знаний загружены данные из столбцов:</span>
            <div
                v-for="(column, index) in columns"
                :key="index"
            >
              {{ column }}
            </div>
          </div>
        </div>
        <Button v-if="sheetLists.length" :disabled="!disabledSaveButton" class="mt-3 w-full" label="Сохранить" @click="saveKnowledgeBase" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGoogleSheetStore } from "~/src/shared/store/googleSheet";
import { useKnowledgeStore } from "~/src/shared/store/knowledge";

const googleSheetStore = useGoogleSheetStore();
const knowledgeStore = useKnowledgeStore();


const { t } = useI18n();
const route = useRoute();

const knowledgeFileTitle = ref<string>('');
const googleSheetLink = ref<string>('');

interface SheetList {
  gridProperties: {
    columnCount: number,
    rowCount: number
  },
  index: number,
  sheetId: number,
  sheetType: string,
  title: string
}

const durations = ref<{ title: string, value: number}[]>([
  {
    title: '15 мин',
    value: 15,
  },
  {
    title: '1 час',
    value: 60,
  },
  {
    title: '6 часа',
    value: 360,
  },
  {
    title: '24 часа',
    value: 1440,
  },
])

const sheetLists = ref<SheetList[]>([]);

const columns = ref<string[]>([])

const selectedSheetListTitle = ref<string>('');
const tableData = ref([])

const loadColumns = async () => {
  await googleSheetStore.getGoogleSheetColumns(googleSheetLink.value, selectedSheetListTitle.value, true).then((res) => {
    columns.value = res.columns
    tableData.value = res.tableData
  })
}


const timerUpdate = ref<number>(0)

const connectGoogleSheet = async () => {
  await googleSheetStore.getGoogleSheetLists(googleSheetLink.value, true).then((res) => {
    sheetLists.value = res;
  })

}

const disabledSaveButton = computed(() => {
  return knowledgeFileTitle?.value?.length && googleSheetLink?.value?.length && selectedSheetListTitle?.value?.length && timerUpdate?.value
})

const saveKnowledgeBase = async () => {
  if (disabledSaveButton.value) {
    await knowledgeStore.addBaseKnowledge(<string>route.params.id, {
      name: knowledgeFileTitle.value,
      content: JSON.stringify(tableData.value),
      duration: timerUpdate.value,
      isGoogleSheet: true,
      google_sheet_link: googleSheetLink.value,
      google_sheet_list: selectedSheetListTitle.value,
    }).then(() => {
      return navigateTo({ name: 'chatbots-id', params: { id: route.params.id }})
    })
  }
}
</script>