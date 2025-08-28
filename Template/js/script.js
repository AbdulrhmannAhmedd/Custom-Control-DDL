/**
 * Simulate API call to load JSON data.
 * We fetch from /Data/data.json (local json file).
 */

async function loadData() {
    try {
        const response = await fetch("../Data/data.json");
        if (!response.ok) {
            throw new Error("Failed to load data.json");
        }
        const data = await response.json();
        console.log("[script] Data loaded:", data);
        return data;
    } catch (err) {
        console.error("[script] Error loading JSON:", err);
        return [];
    }
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
        data: data,
        flags: {
            search: { enabled: false },
            multiSelect: { enabled: false },
            treeView: { enabled: false },
            selectAllBtn: { enabled: false },
            clearAllBtn: { enabled: false }
        }
    })

    //* Second dropdown - Single selection with search
    CustomControl.initialize({
        containerId: "DDLcontainer0001",
        placeholder: "اختر المنطقة...",
        label: "2- المناطق (قائمة عادية - اختيار واحد - بحث)",
        data: data,
        flags: {
            search: { enabled: true },
            multiSelect: { enabled: false },
            treeView: { enabled: false },
            selectAllBtn: { enabled: false },
            clearAllBtn: { enabled: false }
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
            multiSelect: { enabled: false },
            treeView: { enabled: true },
            selectAllBtn: { enabled: false },
            clearAllBtn: { enabled: false }
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
            treeView: { enabled: false },
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
