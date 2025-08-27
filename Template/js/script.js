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

    CustomControl.initialize({
        containerId: "DDLcontainer0000",
        placeholder: "اختر الحكومة أو المدينة...",
        label: "الحكومات والمدن",
        data: data,
        flags: {
            search: { enabled: true },
            multiSelect: { enabled: true },
            treeView: { enabled: true },
            treeSingle: { enabled: false },
            selectAllBtn: { enabled: true },
            clearAllBtn: { enabled: true }
        }
    });
}

document.addEventListener("DOMContentLoaded", init);
