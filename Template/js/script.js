import { CustomControl } from '../../Control/customControl.js';

/**
 * Simulate API call to load JSON data.
 */

function loadData() {
    return fetch("../Data/data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load data.json");
            }
            return response.json();
        })
        .then(data => {
            console.log("[script] Data loaded:", data);
            return data;
        })
        .catch(err => {
            console.error("[script] Error loading JSON:", err);
            return [];
        });
}

/**
 * Initialize dropdown after data is loaded.
 */
async function init() {
    const data = await loadData();

    //* First dropdown - Single selection only
    CustomControl.initialize({
        containerId: "DDLcontainer0000",
        placeholder: "اختر المنطقة...",
        label: "1- المناطق (قائمة عادية - اختيار واحد)",
        data: data
    })

    //* Second dropdown - Single selection with search
    CustomControl.initialize({
        containerId: "DDLcontainer0001",
        placeholder: "اختر المنطقة...",
        label: "2- المناطق (قائمة عادية - اختيار واحد - بحث)",
        data: data,
        flags: {
            search: { enabled: true }
        }
    })

    //* Third dropdown - Single selection with search and tree view
    CustomControl.initialize({
        containerId: "DDLcontainer0002",
        placeholder: "اختر المدينة...",
        label: "3- المناطق (قائمة عادية - اختيار واحد - تصغير و تكبير - بحث)",
        data: data,
        flags: {
            search: { enabled: true },
            treeView: { enabled: true },
        }
    })

    //* Fourth dropdown - Multi selection with search
    CustomControl.initialize({
        containerId: "DDLcontainer0003",
        placeholder: "اختر المناطق...",
        label: "4- المناطق والمدن (قائمة عادية - اختيار متعدد - بحث - تحديد و إلغاء تحديد الكل)",
        data: data,
        flags: {
            search: { enabled: true },
            multiSelect: { enabled: true },
            selectAllBtn: { enabled: true },
            clearAllBtn: { enabled: true }
        }
    })

    //* Fifth dropdown - Multi selection with search and tree view
    CustomControl.initialize({
        containerId: "DDLcontainer0004",
        placeholder: "اختر المدن...",
        label: "5- المناطق والمدن (قائمة عادية - اختيار متعدد - تصغير و تكبير - بحث - تحديد و إلغاء تحديد الكل)",
        data: data,
        flags: {
            search: { enabled: true },
            multiSelect: { enabled: true },
            treeView: { enabled: true },
            selectAllBtn: { enabled: true },
            clearAllBtn: { enabled: true }
        }
    })

}

document.addEventListener("DOMContentLoaded", init);
