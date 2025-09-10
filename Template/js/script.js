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
        data: data
    })

    //* Second dropdown - Single selection with search
    CustomControl.initialize({
        containerId: "DDLcontainer0001",
        placeholder: "اختر المنطقة...",
        data: data,
        flags: {
            search: { enabled: "true" }
        }
    })

    //* Third dropdown - Single selection with search and tree view
    CustomControl.initialize({
        containerId: "DDLcontainer0002",
        placeholder: "اختر المدينة...",
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

window.CustomControl = CustomControl;
