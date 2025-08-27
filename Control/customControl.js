/**
 * Custom Dropdown Control
 * -----------------------
 * Encapsulates logic for rendering a customizable dropdown (with search, multi-select, tree view, etc.)
 * No global variables. Uses literal object `CustomControl`.
 */

const CustomControl = {
    /**
     * Initialize the dropdown inside a container.
     * 
     * @param {Object} params - Configuration object
     * @param {string} params.containerId - ID of the container element where dropdown will be rendered
     * @param {string} [params.placeholder="اختر..."] - Placeholder text shown before selection
     * @param {string} [params.label="القائمة"] - Label text for dropdown
     * @param {Array}  params.data - Hierarchical JSON data [{id, name, children:[]}]
     * @param {Object} [params.flags] - Optional feature toggles
     *        Example: {
     *           search: { enabled: true },
     *           multiSelect: { enabled: true },
     *           treeView: { enabled: true },
     *           treeSingle: { enabled: false },
     *           selectAllBtn: { enabled: true },
     *           clearAllBtn: { enabled: true }
     *        }
     */
    initialize: function (params) {
        //* Validation: Ensure container exists
        const container = document.getElementById(params.containerId);
        if (!container) {
            console.error(`[CustomControl] Container with ID '${params.containerId}' not found.`);
            return;
        }

        //* Save settings internally (per control instance)
        CustomControl.settings = {
            containerId: params.containerId,
            placeholder: params.placeholder || "اختر...",
            label: params.label || "القائمة",
            data: params.data || [],
            flags: {
                search: params.flags?.search || { enabled: false },
                multiSelect: params.flags?.multiSelect || { enabled: false },
                treeView: params.flags?.treeView || { enabled: false },
                treeSingle: params.flags?.treeSingle || { enabled: false },
                selectAllBtn: params.flags?.selectAllBtn || { enabled: false },
                clearAllBtn: params.flags?.clearAllBtn || { enabled: false }
            }
        };

        //* Create base DOM structure
        CustomControl.renderBase(container);
    },

    /**
     * Clear container content.
     * @param {HTMLElement} container - Target container
     */
    clearContainer: function (container) {
        container.innerHTML = "";
    },

    /**
     * Create label element for the dropdown.
     * @returns {HTMLElement} Label element
     */
    createLabel: function () {
        const label = document.createElement("label");
        label.setAttribute("for", `${CustomControl.settings.containerId}_ddl`);
        label.innerText = CustomControl.settings.label;
        return label;
    },

    /**
     * Create main dropdown wrapper element.
     * @returns {HTMLElement} Dropdown wrapper element
     */
    createDropdownWrapper: function () {
        const ddlWrapper = document.createElement("div");
        ddlWrapper.className = "custom-ddl";
        ddlWrapper.id = `${CustomControl.settings.containerId}_ddl`;
        return ddlWrapper;
    },

    /**
     * Create dropdown header with placeholder text.
     * @returns {HTMLElement} Header element
     */
    createHeader: function () {
        const header = document.createElement("div");
        header.className = "ddl-header";
        header.innerText = CustomControl.settings.placeholder;
        return header;
    },

    /**
     * Create options container element.
     * @returns {HTMLElement} Options container element
     */
    createOptionsContainer: function () {
        const optionsContainer = document.createElement("div");
        optionsContainer.className = "ddl-options hidden"; //+ hidden until click
        return optionsContainer;
    },

    /**
     * Create Select All button if enabled.
     * @returns {HTMLElement|null} Select All button element or null
     */
    createSelectAllButton: function () {
        if (!CustomControl.settings.flags.selectAllBtn.enabled) {
            return null;
        }
        
            const btnSelectAll = document.createElement("button");
            btnSelectAll.innerText = "تحديد الكل";
            btnSelectAll.className = "ddl-btn select-all";
        return btnSelectAll;
    },

    /**
     * Create Clear All button if enabled.
     * @returns {HTMLElement|null} Clear All button element or null
     */
    createClearAllButton: function () {
        if (!CustomControl.settings.flags.clearAllBtn.enabled) {
            return null;
        }
        
            const btnClearAll = document.createElement("button");
            btnClearAll.innerText = "مسح الكل";
            btnClearAll.className = "ddl-btn clear-all";
        return btnClearAll;
    },

    /**
     * Create search input box if enabled.
     * @returns {HTMLElement|null} Search input element or null
     */
    createSearchBox: function () {
        if (!CustomControl.settings.flags.search.enabled) {
            return null;
        }
        
            const searchBox = document.createElement("input");
            searchBox.type = "text";
            searchBox.placeholder = "بحث...";
            searchBox.className = "ddl-search";
        return searchBox;
    },

    /**
     * Create button container for action buttons.
     * @returns {HTMLElement|null} Button container element or null
     */
    createButtonContainer: function () {
        const selectAllBtn = CustomControl.createSelectAllButton();
        const clearAllBtn = CustomControl.createClearAllButton();

        // Only create container if at least one button exists
        if (!selectAllBtn && !clearAllBtn) {
            return null;
        }

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "ddl-button-container";

        if (selectAllBtn) {
            buttonContainer.appendChild(selectAllBtn);
        }

        if (clearAllBtn) {
            buttonContainer.appendChild(clearAllBtn);
        }

        return buttonContainer;
    },

    /**
     * Add action buttons and search box to options container.
     * @param {HTMLElement} optionsContainer - Options container element
     */
    populateOptionsContainer: function (optionsContainer) {
        const buttonContainer = CustomControl.createButtonContainer();
        const searchBox = CustomControl.createSearchBox();

        if (buttonContainer) {
            optionsContainer.appendChild(buttonContainer);
        }

        if (searchBox) {
            optionsContainer.appendChild(searchBox);
        }
    },

    /**
     * Set to track used IDs and prevent duplicates , better for performance too O(1)
     */
    usedIds: new Set(),

    /**
     * Reset used IDs tracker (call before rendering)
     */
    resetIdTracker: function () {
        CustomControl.usedIds.clear();
    },

    /**
     * Validate and track ID for duplicates.
     * ✅ Validation: Checks for duplicate IDs and logs warnings
     * 
     * @param {string} generatedId - The generated ID to validate
     * @param {string|number} parentId - Parent ID from JSON
     * @param {string|number} [childId] - Child ID from JSON (optional)
     * @returns {boolean} True if ID is valid (not duplicate)
     */
    validateId: function (generatedId, parentId, childId) {
        // Check for duplicate IDs
        if (CustomControl.usedIds.has(generatedId)) {
            const elementType = childId ? 'Child' : 'Parent';
            const dataInfo = childId 
                ? `parentId: ${parentId}, childId: ${childId}`
                : `parentId: ${parentId}`;
            
            console.warn(`[CustomControl] ⚠️ Duplicate ID detected!`);
            console.warn(`Generated ID: "${generatedId}"`);
            console.warn(`Element Type: ${elementType}`);
            console.warn(`Data: ${dataInfo}`);
            console.warn(`This may cause unexpected behavior. Please check your JSON data for duplicate IDs.`);
            
            return false; // Invalid (duplicate)
        } else {
            // Track this ID as used
            CustomControl.usedIds.add(generatedId);
            return true; // Valid (unique)
        }
    },

    /**
     * Generate unique element ID.
     * Format: containerId-parentId[-childId]
     * 
     * @param {string} containerId - The control's container ID
     * @param {string|number} parentId - Parent ID from JSON
     * @param {string|number} [childId] - Child ID from JSON (optional)
     * @returns {string} Unique element ID
     */
    generateId: function (containerId, parentId, childId) {
        const generatedId = childId 
            ? `${containerId}-${parentId}-${childId}`
            : `${containerId}-${parentId}`;

        // ✅ Validate the generated ID
        CustomControl.validateId(generatedId, parentId, childId);

        return generatedId;
    },

    /**
     * Render dropdown options (parent -> children).
     * @param {Array} data - Hierarchical data [{id, name, children:[]}]
     * @param {HTMLElement} optionsContainer - Target options container
     */
    renderOptions: function (data, optionsContainer) {
        // ✅ Reset ID tracker before rendering to ensure clean validation
        CustomControl.resetIdTracker();

        data.forEach(parent => {
            // Parent container
            const parentDiv = document.createElement("div");
            parentDiv.className = "ddl-parent";

            // Parent label (clickable if treeView enabled)
            const parentLabel = document.createElement("div");
            parentLabel.className = "ddl-parent-label";
            parentLabel.innerText = parent.name;
            parentLabel.dataset.id = parent.id;

            // ✅ Generate unique ID for parent
            parentLabel.id = CustomControl.generateId(
                CustomControl.settings.containerId,
                parent.id
            );

            parentDiv.appendChild(parentLabel);

            // Children list
            if (CustomControl.settings.flags.treeView.enabled && parent.children && parent.children.length > 0) {
                const childrenContainer = document.createElement("div");
                childrenContainer.className = "ddl-children hidden"; // collapsed by default

                parent.children.forEach(child => {
                    const childDiv = document.createElement("div");
                    childDiv.className = "ddl-child";
                    childDiv.innerText = child.name;
                    childDiv.dataset.id = child.id;
                    childDiv.dataset.parentId = parent.id;

                    // ✅ Generate unique ID for child
                    childDiv.id = CustomControl.generateId(
                        CustomControl.settings.containerId,
                        parent.id,
                        child.id
                    );

                    childrenContainer.appendChild(childDiv);
                });

                parentDiv.appendChild(childrenContainer);

                // Expand/Collapse logic
                parentLabel.addEventListener("click", function () {
                    childrenContainer.classList.toggle("hidden");
                });
            }

            optionsContainer.appendChild(parentDiv);
        });
    },

    /**
     * Add event listeners for dropdown functionality.
     * @param {HTMLElement} ddlWrapper - Dropdown wrapper element
     * @param {HTMLElement} header - Header element
     * @param {HTMLElement} optionsContainer - Options container element
     */
    addEventListeners: function (ddlWrapper, header, optionsContainer) {
        // Toggle dropdown on header click
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            CustomControl.toggleDropdown(ddlWrapper, optionsContainer);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!ddlWrapper.contains(e.target)) {
                CustomControl.closeDropdown(ddlWrapper, optionsContainer);
            }
        });

        // Prevent dropdown from closing when clicking inside options
        optionsContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    },

    /**
     * Toggle dropdown open/close state.
     * @param {HTMLElement} ddlWrapper - Dropdown wrapper element
     * @param {HTMLElement} optionsContainer - Options container element
     */
    toggleDropdown: function (ddlWrapper, optionsContainer) {
        const isHidden = optionsContainer.classList.contains('hidden');
        
        if (isHidden) {
            CustomControl.openDropdown(ddlWrapper, optionsContainer);
        } else {
            CustomControl.closeDropdown(ddlWrapper, optionsContainer);
        }
    },

    /**
     * Open the dropdown.
     * @param {HTMLElement} ddlWrapper - Dropdown wrapper element
     * @param {HTMLElement} optionsContainer - Options container element
     */
    openDropdown: function (ddlWrapper, optionsContainer) {
        optionsContainer.classList.remove('hidden');
        ddlWrapper.classList.add('open');
        console.log('[CustomControl] Dropdown opened');
    },

    /**
     * Close the dropdown.
     * @param {HTMLElement} ddlWrapper - Dropdown wrapper element
     * @param {HTMLElement} optionsContainer - Options container element
     */
    closeDropdown: function (ddlWrapper, optionsContainer) {
        optionsContainer.classList.add('hidden');
        ddlWrapper.classList.remove('open');
        console.log('[CustomControl] Dropdown closed');
    },

    /**
     * Render base container (label + ddl header + placeholder).
     * @param {HTMLElement} container - Target container
     */
    renderBase: function (container) {
        // Clear container
        CustomControl.clearContainer(container);

        // Create and append label
        const label = CustomControl.createLabel();
        container.appendChild(label);

        // Create dropdown components
        const ddlWrapper = CustomControl.createDropdownWrapper();
        const header = CustomControl.createHeader();
        const optionsContainer = CustomControl.createOptionsContainer();

        // Populate options container with buttons and search box
        CustomControl.populateOptionsContainer(optionsContainer);

        // ✅ Render JSON options into dropdown
        CustomControl.renderOptions(CustomControl.settings.data, optionsContainer);

        // Assemble dropdown structure
        ddlWrapper.appendChild(header);
        ddlWrapper.appendChild(optionsContainer);
        container.appendChild(ddlWrapper);

        // Add event listeners for interactivity
        CustomControl.addEventListeners(ddlWrapper, header, optionsContainer);
    }
};
