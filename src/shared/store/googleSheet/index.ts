import {useApi} from "~/composable";

export const useGoogleSheetStore = defineStore('googleSheet', {
    state: () => {
        return {
            googleSheetLink: null as string | null,
            googleSheetId: null as string | null,
            googleSheetName: null as string | null,
            googleSheetColumnNames: [] as string[],
            googleLists: [] as string[],
        }
    },

    actions: {
        async getGoogleSheetLists(googleSheetLink: string) {
            try {
                const response = await useApi(`/googleSheets/getSheetLists?url=${googleSheetLink}`, {
                    method: 'GET'
                })
                if (response?.sheetLists?.length) {
                    return response.sheetLists
                }
            } catch (error) {
                console.error(error)
            }
        },

        async getGoogleSheetColumns(googleSheetLink, listTitle) {
            try {
                if (!googleSheetLink || !listTitle) {
                    console.error('Google Sheet URL or list title is missing');
                    return;
                }

                const encodedUrl = encodeURIComponent(googleSheetLink);
                const encodedTitle = encodeURIComponent(listTitle);

                const response = await useApi(`/googleSheets/getSheetColumns?url=${encodedUrl}&listTitle=${encodedTitle}`, {
                    method: 'GET',
                });

                if (response.error) {
                    console.error('Error from API:', response.error);
                    return;
                }

                if (response.columns?.length) {
                    return response.columns
                }
            } catch (error) {
                console.error('Error fetching Google Sheet columns:', error);
            }
        }
    }
})