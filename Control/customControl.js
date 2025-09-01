/**
 * Custom Dropdown Control
 * -----------------------
 */

export const CustomControl = {
    /**
     * Helper functions to manage name attributes like classList:
     */

    /**
     ** nameListAdd(): Gets elements' name attribute and split its parts by spaces, store them in array, if the nameValue is not in the array, add it to the array, and set the name attribute to the array joined by spaces
     * @param {HTMLElement} element - The element to add
     * @param {string} nameValue - The name attribute value to add
     */
    nameListAdd: function(element, nameValue) {
        const current = element.getAttribute('name') || '';
        const classes = current.split(' ').filter(c => c.length > 0);
        if (!classes.includes(nameValue)) {
            classes.push(nameValue);
            element.setAttribute('name', classes.join(' '));
        }
    },

    /**
     ** nameListRemove(): Gets elements' name attribute and split its parts by spaces, filter the array to remove the nameValue, and set the name attribute to the array joined by spaces
     * @param {HTMLElement} element - The element to remove
     * @param {string} nameValue - The name attribute value to remove
     */
    nameListRemove: function(element, nameValue) {
        const current = element.getAttribute('name') || '';
        const classes = current.split(' ').filter(c => c.length > 0 && c !== nameValue);
        element.setAttribute('name', classes.join(' '));
    },

    /**
     ** nameListToggle(): Gets elements' name attribute and split its parts by spaces, if the nameValue is in the array, remove it from the array, and set the name attribute to the array joined by spaces, otherwise add it to the array and set the name attribute to the array joined by spaces
     *+ Usage: For dropdown open/close states
     * @param {HTMLElement} element - The element to toggle
     * @param {string} nameValue - The name attribute value to toggle
     */
    nameListToggle: function(element, nameValue) {
        const current = element.getAttribute('name') || '';
        const classes = current.split(' ').filter(c => c.length > 0);
        if (classes.includes(nameValue)) {
            CustomControl.nameListRemove(element, nameValue);
        } else {
            CustomControl.nameListAdd(element, nameValue);
        }
    },

    /**
     ** nameListContains(): Gets elements' name attribute and split its parts by spaces, and return true if the nameValue is in the array, otherwise return false
     * @param {HTMLElement} element - The element to check
     * @param {string} nameValue - The name attribute value to check for
     * @returns {boolean} True if the element has the name attribute value, false otherwise
     */
    nameListContains: function(element, nameValue) {
        const current = element.getAttribute('name') || '';
        const classes = current.split(' ').filter(c => c.length > 0);
        return classes.includes(nameValue);
    },

    /**
     ** getByName(): Gets elements' name attribute by using querySelectorAll and checking if the name attribute value is in the array by using nameListContains(), if true, return the element, otherwise return null
     * @param {HTMLElement} parent - The parent element to search within
     * @param {string} nameValue - The name attribute value to search for
     * @returns {HTMLElement|null} The first element with the name attribute value, or null if not found
     */
    getByName: function(parent, nameValue) {
        if (!parent) parent = document;
        const elements = parent.querySelectorAll(`[name*="${nameValue}"]`);
        for (let element of elements) {
            if (CustomControl.nameListContains(element, nameValue)) {
                return element;
            }
        }
        return null;
    },

    /**
     ** getAllByName(): Gets elements' name attribute by using querySelectorAll and checking if the name attribute value is in the array by using nameListContains(), if true, return the element, otherwise return an empty array
     * @param {HTMLElement} parent - The parent element to search within
     * @param {string} nameValue - The name attribute value to search for
     * @returns {HTMLElement[]} An array of elements with the name attribute value
     */
    getAllByName: function(parent, nameValue) {
        if (!parent) parent = document;
        const elements = parent.querySelectorAll(`[name*="${nameValue}"]`);
        return Array.from(elements).filter(element => 
            CustomControl.nameListContains(element, nameValue)
        );
    },

    /**
     * Create or update no search results message
     ** handleNoSearchResults(): Takes Container Element and a flag to show or hide the element of no results message, if the flag is true, create the element if not exists already (known by getByName()) and hide placeholder option if exists, and set the display to block, otherwise set the display to none
     * @param {HTMLElement} optionsContainer - Options container element
     * @param {boolean} show - Whether to show or hide the message
     */
    handleNoSearchResults: function(optionsContainer, show) {
        let noResultsMsg = CustomControl.getByName(optionsContainer, 'ddl-no-results');
        const placeholderOption = CustomControl.getByName(optionsContainer, 'ddl-placeholder-option');
        
        if (show) {
            // Hide placeholder option when showing no results message
            if (placeholderOption) {
                placeholderOption.style.display = 'none';
            }
            
            if (!noResultsMsg) {
                // Create the no results message element
                noResultsMsg = document.createElement('div');
                noResultsMsg.setAttribute('name', 'ddl-no-results');
                noResultsMsg.innerText = 'لا يوجد نتائج للبحث';
                noResultsMsg.style.padding = '12px 16px';
                noResultsMsg.style.textAlign = 'center';
                noResultsMsg.style.color = '#95a5a6';
                noResultsMsg.style.backgroundColor = '#f8f9fa';
                noResultsMsg.style.borderBottom = '1px solid #ecf0f1';
                
                // Insert after search box and buttons, before options
                const searchBox = CustomControl.getByName(optionsContainer, 'ddl-search');
                const buttonContainer = CustomControl.getByName(optionsContainer, 'ddl-button-container');
                
                if (searchBox && searchBox.nextSibling) {
                    optionsContainer.insertBefore(noResultsMsg, searchBox.nextSibling); // insert the no results message after the search box
                } else if (buttonContainer && buttonContainer.nextSibling) {
                    optionsContainer.insertBefore(noResultsMsg, buttonContainer.nextSibling); // insert the no results message after the button container , that's because buttons container itself comes after the search box
                } else {
                    optionsContainer.appendChild(noResultsMsg); // insert the no results message at the end of the options container
                }
            }
            noResultsMsg.style.display = ''; // set the display to block to show the no results message
        } else {
            // Show placeholder option when hiding no results message
            if (placeholderOption) {
                placeholderOption.style.display = ''; // set the display to block to show the placeholder option
            }
            
            if (noResultsMsg) {
                noResultsMsg.style.display = 'none'; // set the display to none to hide the no results message
            }
        }
    },
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

        //* Prepare settings for this instance (no global on the object level so every drop down will have its own settings)
        const settings = {
            containerId: params.containerId,
            placeholder: params.placeholder || "اختر...",
            label: params.label || "القائمة",
            data: params.data || [],
            flags: {
                search: params.flags?.search || { enabled: false },
                multiSelect: params.flags?.multiSelect || { enabled: false },
                treeView: params.flags?.treeView || { enabled: false },
                selectAllBtn: params.flags?.selectAllBtn || { enabled: false },
                clearAllBtn: params.flags?.clearAllBtn || { enabled: false }
                //! Flags Are False By Default
            }
        };

        //* Create base DOM structure
        CustomControl.renderBase(container, settings);
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
    createLabel: function (settings) {
        const label = document.createElement("label");
        label.setAttribute("for", `${settings.containerId}_ddl`);
        label.innerText = settings.label;
        return label;
    },

    /**
     * Create main dropdown wrapper element.
     * @param {Object} settings - Settings object for this instance
     * @returns {HTMLElement} Dropdown wrapper element
     */
    createDropdownWrapper: function (settings) {
        const ddlWrapper = document.createElement("div");
        ddlWrapper.setAttribute('name', 'custom-ddl');
        ddlWrapper.id = `${settings.containerId}_ddl`;
        return ddlWrapper;
    },

    /**
     * Create dropdown header with placeholder text.
     * @returns {HTMLElement} Header element
     */
    createHeader: function (settings) {
        const header = document.createElement("div");
        header.setAttribute('name', 'ddl-header');
        header.innerText = settings.placeholder;
        return header;
    },

    /**
     * Create options container element.
     * @returns {HTMLElement} Options container element
     */
    createOptionsContainer: function () {
        const optionsContainer = document.createElement("div");
        optionsContainer.setAttribute('name', 'ddl-options hidden'); //+ hidden until click
        return optionsContainer;
    },

    /**
     * Create Select All button if enabled.
     * @returns {HTMLElement|null} Select All button element or null
     */
    createSelectAllButton: function (settings) {
        if (!settings.flags.selectAllBtn.enabled) {
            return null;
        }
        
            const btnSelectAll = document.createElement("button");
            btnSelectAll.innerText = "تحديد الكل";
            btnSelectAll.setAttribute('name', 'ddl-btn select-all');
        
        // Store container ID in button for reliable access
        btnSelectAll.dataset.containerId = settings.containerId;
        
        // Add event listener for Select All functionality
        btnSelectAll.addEventListener('click', function(e) {
            e.stopPropagation();
            const containerId = e.target.dataset.containerId;
            CustomControl.handleSelectAll(containerId);
        });
        
        return btnSelectAll;
    },

    /**
     * Create Clear All button if enabled.
     * @returns {HTMLElement|null} Clear All button element or null
     */
    createClearAllButton: function (settings) {
        if (!settings.flags.clearAllBtn.enabled) {
            return null;
        }
        
            const btnClearAll = document.createElement("button");
            btnClearAll.innerText = "مسح الكل";
            btnClearAll.setAttribute('name', 'ddl-btn clear-all');
        
        // Store container ID in button for reliable access
        btnClearAll.dataset.containerId = settings.containerId;
        
        // Add event listener for Clear All functionality
        btnClearAll.addEventListener('click', function(e) {
            e.stopPropagation();
            const containerId = e.target.dataset.containerId;
            CustomControl.handleClearAll(containerId);
        });
        
        return btnClearAll;
    },

    /**
     * Create search input box if enabled.
     * @returns {HTMLElement|null} Search input element or null
     */
        createSearchBox: function (settings) {
        if (!settings.flags.search.enabled) {
            return null;
        }
        
            const searchBox = document.createElement("input");
            searchBox.type = "text";
            searchBox.placeholder = "بحث...";
            searchBox.setAttribute('name', 'ddl-search');
        
        // Store container ID in search box for reliable access
        searchBox.dataset.containerId = settings.containerId;
        
        // Add event listener for search functionality
        searchBox.addEventListener('input', function(e) {
            const containerId = e.target.dataset.containerId;
            const searchTerm = e.target.value.trim();
            CustomControl.handleSearch(containerId, searchTerm);
        });
        
        return searchBox;
    },

    /**
     * Create button container for action buttons.
     * @returns {HTMLElement|null} Button container element or null
     */
    createButtonContainer: function (settings) {
        const isMultiSelect = settings.flags.multiSelect.enabled;
        const showSelectAll = isMultiSelect && settings.flags.selectAllBtn.enabled;
        const showClearAll = isMultiSelect && settings.flags.clearAllBtn.enabled;

        // Only create container if at least one button should be shown
        if (!showSelectAll && !showClearAll) {
            return null;
        }

        const buttonContainer = document.createElement("div");
        buttonContainer.setAttribute('name', 'ddl-button-container');

        if (showSelectAll) {
            const selectAllBtn = CustomControl.createSelectAllButton(settings);
            buttonContainer.appendChild(selectAllBtn);
        }

        if (showClearAll) {
            const clearAllBtn = CustomControl.createClearAllButton(settings);
            buttonContainer.appendChild(clearAllBtn);
        }

        return buttonContainer;
    },

    /**
     * Add action buttons and search box to options container.
     * @param {HTMLElement} optionsContainer - Options container element
     */
    populateOptionsContainer: function (optionsContainer, settings) {
        // Only show buttons if multiSelect is enabled
        const isMultiSelect = settings.flags.multiSelect.enabled;
        const showSelectAll = isMultiSelect && settings.flags.selectAllBtn.enabled;
        const showClearAll = isMultiSelect && settings.flags.clearAllBtn.enabled;
        
        if (showSelectAll || showClearAll) {
            const buttonContainer = CustomControl.createButtonContainer(settings);
            optionsContainer.appendChild(buttonContainer);
        }

        // Add search box if enabled
        if (settings.flags.search.enabled) {
            const searchBox = CustomControl.createSearchBox(settings);
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
     * Add disabled placeholder option as the first item in the dropdown.
     * @param {HTMLElement} optionsContainer - Options container element
     * @param {Object} settings - Settings object for this instance
     */
    addPlaceholderOption: function (optionsContainer, settings) {
        const placeholderDiv = document.createElement("div");
        placeholderDiv.setAttribute('name', 'ddl-placeholder-option ddl-option-disabled');
        placeholderDiv.innerText = settings.placeholder;
        
        // Make it non-selectable
        placeholderDiv.style.pointerEvents = "none";
        placeholderDiv.style.opacity = "0.6";
        placeholderDiv.style.color = "#454949ff";
        placeholderDiv.style.padding = "12px 16px";
        placeholderDiv.style.borderBottom = "1px solid #ecf0f1";
        placeholderDiv.style.backgroundColor = "#f8f9fa";
        
        // Add disabled attribute to prevent any interaction
        placeholderDiv.setAttribute('disabled', 'true');
        
        optionsContainer.appendChild(placeholderDiv);
    },

    /**
     * Render dropdown options (parent -> children).
     * @param {Array} data - Hierarchical data [{id, name, children:[]}]
     * @param {HTMLElement} optionsContainer - Target options container
     */
    renderOptions: function (data, optionsContainer, settings) {
        // ✅ Reset ID tracker before rendering to ensure clean validation
        CustomControl.resetIdTracker();

        // ✅ Add disabled placeholder option as first option
        CustomControl.addPlaceholderOption(optionsContainer, settings);

        data.forEach(parent => {
            // Parent container
            const parentDiv = document.createElement("div");
            parentDiv.setAttribute('name', 'ddl-parent');

            // Parent label with checkbox
            const parentLabel = document.createElement("div");
            parentLabel.setAttribute('name', 'ddl-parent-label');
            parentLabel.dataset.id = parent.id;

            // ✅ Generate unique ID for parent
            parentLabel.id = CustomControl.generateId(
                settings.containerId,
                parent.id
            );

            // ✅ Add checkbox for parent if multiSelect is enabled
            if (settings.flags.multiSelect.enabled) {
                const parentCheckbox = document.createElement("input");
                parentCheckbox.type = "checkbox";
                parentCheckbox.setAttribute('name', 'ddl-checkbox parent-checkbox');
                parentCheckbox.id = `${parentLabel.id}-checkbox`;
                parentCheckbox.dataset.parentId = parent.id;

                const parentText = document.createElement("span");
                parentText.setAttribute('name', 'ddl-label-text');
                parentText.innerText = parent.name;

                parentLabel.appendChild(parentCheckbox);
                parentLabel.appendChild(parentText);
            } else {
                parentLabel.innerText = parent.name;
            }

            parentDiv.appendChild(parentLabel);

            // Children list
            if (settings.flags.treeView.enabled && parent.children && parent.children.length > 0) {
                // ✅ Add "has-children" class for arrow styling
                CustomControl.nameListAdd(parentLabel, "has-children");

                const childrenContainer = document.createElement("div");
                childrenContainer.setAttribute('name', 'ddl-children hidden'); // collapsed by default

                parent.children.forEach(child => {
                    const childDiv = document.createElement("div");
                    childDiv.setAttribute('name', 'ddl-child');
                    childDiv.dataset.id = child.id;
                    childDiv.dataset.parentId = parent.id;

                    // ✅ Generate unique ID for child
                    childDiv.id = CustomControl.generateId(
                        settings.containerId,
                        parent.id,
                        child.id
                    );

                    // ✅ Add checkbox for child if multiSelect is enabled
                    if (settings.flags.multiSelect.enabled) {
                        const childCheckbox = document.createElement("input");
                        childCheckbox.type = "checkbox";
                        childCheckbox.setAttribute('name', 'ddl-checkbox child-checkbox');
                        childCheckbox.id = `${childDiv.id}-checkbox`;
                        childCheckbox.dataset.childId = child.id;
                        childCheckbox.dataset.parentId = parent.id;

                        const childText = document.createElement("span");
                        childText.setAttribute('name', 'ddl-label-text');
                        childText.innerText = child.name;

                        childDiv.appendChild(childCheckbox);
                        childDiv.appendChild(childText);
                    } else {
                        // Single selection - add click handler
                        childDiv.innerText = child.name;
                        CustomControl.nameListAdd(childDiv, "ddl-option");
                        childDiv.addEventListener("click", function(e) {
                            e.stopPropagation();
                            // Extract container ID from the dropdown structure
                            const dropdownContainer = e.target.closest('[name~="custom-ddl"]');
                            const containerId = dropdownContainer ? dropdownContainer.id.replace('_ddl', '') : null;
                            if (containerId) {
                                CustomControl.handleSingleSelection(e.target, containerId);
                            }
                        });
                    }

                    childrenContainer.appendChild(childDiv);
                });

                parentDiv.appendChild(childrenContainer);

                // ✅ Expand/Collapse logic with arrow rotation
                const toggleChildren = function () {
                    // Toggle visibility first
                    CustomControl.nameListToggle(childrenContainer, "hidden");
                    
                    // Check if children are now visible (not hidden)
                    const isNowVisible = !CustomControl.nameListContains(childrenContainer, "hidden");
                    
                    // Set expanded class based on current visibility
                    if (isNowVisible) {
                        CustomControl.nameListAdd(parentLabel, "expanded");    // Arrow UP ▲
                    } else {
                        CustomControl.nameListRemove(parentLabel, "expanded"); // Arrow DOWN ▼
                    }
                };

                if (settings.flags.multiSelect.enabled) {
                    // When checkboxes exist, only text should expand/collapse
                    const parentTextElement = CustomControl.getByName(parentLabel, 'ddl-label-text');
                    if (parentTextElement) {
                        parentTextElement.addEventListener("click", function (e) {
                            e.stopPropagation(); // Prevent checkbox events
                            toggleChildren();
                        });
                    }
                } else {
                    // When no checkboxes, whole label can be clicked
                    parentLabel.addEventListener("click", function () {
                        toggleChildren();
                    });
                }
            }

            // ✅ Add single selection handler for parent (if no multiSelect)
            if (!settings.flags.multiSelect.enabled) {
                const hasTreeView = settings.flags.treeView.enabled;
                const hasChildren = parent.children && parent.children.length > 0;
                
                // In single selection:
                // - Tree view with children: Parents are NOT selectable (only for organization)
                // - Tree view without children OR no tree view: Parents ARE selectable
                if (!hasTreeView || !hasChildren) {
                    // Make parent selectable only if it has no children or no tree view
                    CustomControl.nameListAdd(parentLabel, "ddl-option");
                    
                    // Add click handler for selection
                    parentLabel.addEventListener("click", function(e) {
                        e.stopPropagation();
                        // Extract container ID from the dropdown structure
                        const dropdownContainer = e.target.closest('[name~="custom-ddl"]');
                        const containerId = dropdownContainer ? dropdownContainer.id.replace('_ddl', '') : null;
                        if (containerId) {
                            CustomControl.handleSingleSelection(e.target, containerId);
                        }
                    });
                }
            }

            optionsContainer.appendChild(parentDiv);
        });
    },

    /**
     * Handle single selection - clear previous selections and select clicked option.
     * @param {HTMLElement} selectedElement - The clicked element to select
     * @param {string} containerId - Container ID for this dropdown instance
     */
    handleSingleSelection: function (selectedElement, containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // ✅ Clear all previous selections in this dropdown instance
        const allOptions = CustomControl.getAllByName(dropdownContainer, 'ddl-option');
        allOptions.forEach(option => {
            CustomControl.nameListRemove(option, 'ddl-selected');
        });

        // ✅ Select the clicked option
        CustomControl.nameListAdd(selectedElement, 'ddl-selected');

        // ✅ Update selected display
        CustomControl.updateSelectedDisplay(containerId);

        // ✅ Close dropdown after selection
        const optionsContainer = CustomControl.getByName(dropdownContainer, 'ddl-options');
        if (optionsContainer) {
            CustomControl.closeDropdown(dropdownContainer, optionsContainer);
        }
    },

    /**
     * Create selected options display area.
     * @returns {HTMLElement} Selected display container element
     */
        createSelectedDisplay: function (settings) {
        const selectedContainer = document.createElement("div");
        selectedContainer.setAttribute('name', 'ddl-selected-container');
        selectedContainer.id = `${settings.containerId}_selected`;

        const selectedLabel = document.createElement("div");
        selectedLabel.setAttribute('name', 'ddl-selected-label');
        selectedLabel.innerText = "العناصر المختارة:";
        
        const selectedContent = document.createElement("div");
        selectedContent.setAttribute('name', 'ddl-selected-content');
        selectedContent.id = `${settings.containerId}_selected_content`;
        selectedContent.innerText = "لا يوجد عناصر مختارة";

        selectedContainer.appendChild(selectedLabel);
        selectedContainer.appendChild(selectedContent);

        return selectedContainer;
    },

    /**
     * Update selected options display based on current selections.
     * @param {string} containerId - The specific dropdown container ID
     */
    updateSelectedDisplay: function (containerId) {
        const selectedContent = document.getElementById(`${containerId}_selected_content`);
        if (!selectedContent) return;

        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // ✅ Extract settings and data from DOM structure for this specific dropdown
        const hasMultiSelect = CustomControl.getByName(dropdownContainer, 'ddl-checkbox') !== null;
        const hasTreeView = CustomControl.getByName(dropdownContainer, 'ddl-children') !== null;
        const data = CustomControl.extractDataFromDOM(dropdownContainer);

        let displayText = "";

        if (hasMultiSelect) {
            if (hasTreeView) {
                // Tree view format: Parent ← child1, child2
                displayText = CustomControl.getTreeViewSelections(dropdownContainer, data);
            } else {
                // Flat multi-select format: option1, option2, option3
                displayText = CustomControl.getFlatSelections(dropdownContainer, data);
            }
        } else {
            // Single selection format: option1
            displayText = CustomControl.getSingleSelection(dropdownContainer, data);
        }

        // ✅ Update selected container display
        selectedContent.innerText = displayText || "لا يوجد عناصر مختارة";

        // ✅ Update dropdown header with selected items (new feature)
        CustomControl.updateDropdownHeader(dropdownContainer, displayText);
    },

    /**
     * Update dropdown header to show selected items instead of placeholder.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {string} displayText - The selected items text to show
     */
    updateDropdownHeader: function (dropdownContainer, displayText) {
        const header = CustomControl.getByName(dropdownContainer, 'ddl-header');
        if (!header) return;

        // Get the original placeholder from data attribute (stored during creation)
        const originalPlaceholder = header.dataset.placeholder;
        if (!originalPlaceholder) {
            // Store original placeholder on first use
            header.dataset.placeholder = header.innerText;
        }

        // Show selected items if any, otherwise show placeholder
        if (displayText && displayText.trim() !== "" && displayText !== "لا يوجد عناصر مختارة") {
            // ✅ Convert newlines to commas for better header display and ellipsis behavior
            const headerText = displayText.replace(/\n/g, ', ');
            header.innerText = headerText;
            CustomControl.nameListAdd(header, 'has-selections');
        } else {
            header.innerText = header.dataset.placeholder;
            CustomControl.nameListRemove(header, 'has-selections');
        }
    },

    /**
     * Extract data structure from DOM elements.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @returns {Array} Data structure reconstructed from DOM
     */
    extractDataFromDOM: function (dropdownContainer) {
        const data = [];
        const parentElements = CustomControl.getAllByName(dropdownContainer, 'ddl-parent');

        parentElements.forEach(parentElement => {
            const parentLabel = CustomControl.getByName(parentElement, 'ddl-parent-label');
            if (!parentLabel) return;

            const parentId = parentLabel.dataset.id;
            const parentName = parentLabel.innerText || (CustomControl.getByName(parentLabel, 'ddl-label-text') ? CustomControl.getByName(parentLabel, 'ddl-label-text').innerText : '');

            const parent = {
                id: parentId,
                name: parentName,
                children: []
            };

            const childElements = CustomControl.getAllByName(parentElement, 'ddl-child');
            childElements.forEach(childElement => {
                const childId = childElement.dataset.id;
                const childName = childElement.innerText || (CustomControl.getByName(childElement, 'ddl-label-text') ? CustomControl.getByName(childElement, 'ddl-label-text').innerText : '');

                parent.children.push({
                    id: childId,
                    name: childName
                });
            });

            data.push(parent);
        });

        return data;
    },

    /**
     * Extract container ID from a DOM element (checkbox, etc.).
     * @param {HTMLElement} element - DOM element with ID containing container info
     * @returns {string|null} Container ID or null if not extractable
     */
    extractContainerIdFromElement: function (element) {
        if (!element || !element.id) {
                return null;
        }
        
        // Extract containerId from IDs like: 
        // "DDLcontainer0000-1-checkbox" (parent) 
        // "DDLcontainer0000-1-101-checkbox" (child)
        if (element.id.endsWith('-checkbox')) {
            const withoutCheckbox = element.id.replace('-checkbox', '');
            const parts = withoutCheckbox.split('-');
            
            if (parts.length >= 2) {
                // For parent: DDLcontainer0000-1 → DDLcontainer0000 (remove 1 part)
                // For child: DDLcontainer0000-1-101 → DDLcontainer0000 (remove 2 parts)
                
                let containerId;
                if (parts.length === 2) {
                    // Parent checkbox: DDLcontainer0000-1
                    containerId = parts[0];
                } else if (parts.length === 3) {
                    // Child checkbox: DDLcontainer0000-1-101
                    containerId = parts[0];
                } else {
                    // Fallback: take all parts except the last one
                    containerId = parts.slice(0, -1).join('-');
                }
                
                return containerId;
            }
        }
        
        return null;
    },

    /**
     * Get tree view selections in "Parent ← child1, child2" format.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {Array} data - Hierarchical data for this specific dropdown
     * @returns {string} Formatted selection text
     */
    getTreeViewSelections: function (dropdownContainer, data) {
        const results = [];

        data.forEach(parent => {
            const parentCheckbox = dropdownContainer.querySelector(`[name*="parent-checkbox"][data-parent-id="${parent.id}"]`);
            const childCheckboxes = dropdownContainer.querySelectorAll(`[name*="child-checkbox"][data-parent-id="${parent.id}"]`);
            
            const checkedChildren = Array.from(childCheckboxes).filter(cb => cb.checked);

            // Check if parent has children
            const hasChildren = parent.children && parent.children.length > 0;

            if (parentCheckbox && parentCheckbox.checked) {
                if (!hasChildren) {
                    // Parent has no children - show just parent name (no arrow)
                    results.push(parent.name);
                } else {
                    // Parent checked with children - show parent ← checked children (regardless of count)
                    const selectedChildNames = checkedChildren.map(cb => {
                        const childId = cb.dataset.childId;
                        const child = parent.children.find(c => c.id == childId);
                        return child ? child.name : '';
                    }).filter(name => name).join(", ");
                    
                    if (selectedChildNames) {
                        results.push(`${parent.name} ← ${selectedChildNames}`);
                    }
                }
            } else if (checkedChildren.length > 0) {
                // Some children selected (parent not checked) - show parent ← selected children
                const selectedChildNames = checkedChildren.map(cb => {
                    const childId = cb.dataset.childId;
                    const child = parent.children.find(c => c.id == childId);
                    return child ? child.name : '';
                }).filter(name => name).join(", ");
                
                if (selectedChildNames) {
                    results.push(`${parent.name} ← ${selectedChildNames}`);
                }
            }
        });

        return results.join("\n");
    },

    /**
     * Get flat selections in "option1, option2, option3" format.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {Array} data - Hierarchical data for this specific dropdown
     * @returns {string} Formatted selection text
     */
    getFlatSelections: function (dropdownContainer, data) {
        const selectedOptions = [];
        const parentCheckboxes = dropdownContainer.querySelectorAll('[name*="parent-checkbox"]:checked');
        
        parentCheckboxes.forEach(checkbox => {
            const parentId = checkbox.dataset.parentId;
            const parent = data.find(p => p.id == parentId);
            if (parent) {
                selectedOptions.push(parent.name);
            }
        });

        return selectedOptions.join(", ");
    },

    /**
     * Get single selection in "option1" format.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {Array} data - Hierarchical data for this specific dropdown
     * @returns {string} Selected option text
     */
    getSingleSelection: function (dropdownContainer, data) {
        // For single selection, find selected option (using ddl-selected class)
        const selectedOption = dropdownContainer.querySelector('[name*="ddl-option"][name*="ddl-selected"]');
        
        if (selectedOption) {
            // Check if tree view is enabled by looking for .ddl-children elements
            const hasTreeView = CustomControl.getByName(dropdownContainer, 'ddl-children') !== null;
            
            if (CustomControl.nameListContains(selectedOption, 'ddl-parent-label')) {
                // Selected parent option
                const parentId = selectedOption.dataset.id;
                const parent = data.find(p => p.id == parentId);
                return parent ? parent.name : '';
            } else if (CustomControl.nameListContains(selectedOption, 'ddl-child')) {
                // Selected child option
                const childId = selectedOption.dataset.id;
                const parentId = selectedOption.dataset.parentId;
                const parent = data.find(p => p.id == parentId);
                const child = parent ? parent.children.find(c => c.id == childId) : null;
                
                if (child) {
                    if (hasTreeView) {
                        // Tree view enabled - show Parent ← Child format
                        return `${parent.name} ← ${child.name}`;
                    } else {
                        // No tree view - show just child name
                        return child.name;
                    }
                }
            }
        }

        return "";
    },

    /**
     * Handle parent checkbox change - check/uncheck all children.
     * @param {HTMLInputElement} parentCheckbox - Parent checkbox element
     * @param {string} parentId - Parent ID
     */
    handleParentCheckboxChange: function (parentCheckbox, parentId) {
        const isChecked = parentCheckbox.checked;
        
        // ✅ Extract container ID from checkbox element to ensure correct dropdown instance
        const containerId = CustomControl.extractContainerIdFromElement(parentCheckbox);
        if (!containerId) return;
        
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;
        
        const childCheckboxes = dropdownContainer.querySelectorAll(
            `[name*="child-checkbox"][data-parent-id="${parentId}"]`
        );
        
        // Set all children to same state as parent
        childCheckboxes.forEach(childCheckbox => {
            childCheckbox.checked = isChecked;
        });
        
        console.log(`[CustomControl] Parent ${parentId} ${isChecked ? 'checked' : 'unchecked'}, updated ${childCheckboxes.length} children`);
        
        // ✅ Update selected display for this specific dropdown
        CustomControl.updateSelectedDisplay(containerId);
    },

    /**
     * Handle child checkbox change - update parent state accordingly.
     * @param {HTMLInputElement} childCheckbox - Child checkbox element
     * @param {string} parentId - Parent ID
     */
    handleChildCheckboxChange: function (childCheckbox, parentId) {
        // ✅ Extract container ID from checkbox element to ensure correct dropdown instance
        const containerId = CustomControl.extractContainerIdFromElement(childCheckbox);
        if (!containerId) return;
        
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;
        
        const parentCheckbox = dropdownContainer.querySelector(
            `[name*="parent-checkbox"][data-parent-id="${parentId}"]`
        );
        
        if (!parentCheckbox) return;
        
        // ✅ Find only child checkboxes for this specific parent IN THIS DROPDOWN INSTANCE
        const childCheckboxes = dropdownContainer.querySelectorAll(
            `[name*="child-checkbox"][data-parent-id="${parentId}"]`
        );
        
        const checkedChildren = Array.from(childCheckboxes).filter(cb => cb.checked);
        const totalChildren = childCheckboxes.length;
        
        if (checkedChildren.length === 0) {
            // No children checked - uncheck parent
            parentCheckbox.checked = false;
            parentCheckbox.indeterminate = false;
        } else {
            // Any children checked - check parent
            parentCheckbox.checked = true;
            parentCheckbox.indeterminate = false;
        }
        
        console.log(`[CustomControl] Parent ${parentId}: ${checkedChildren.length}/${totalChildren} children checked`);
        
        // ✅ Update selected display for this specific dropdown
        CustomControl.updateSelectedDisplay(containerId);
    },

    /**
     * Handle Select All button click - select all options.
     * @param {string} containerId - Container ID for this dropdown instance
     */
    handleSelectAll: function (containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // Check if this is tree view or flat view
        const hasTreeView = CustomControl.getByName(dropdownContainer, 'ddl-children') !== null;

        if (hasTreeView) {
            // Tree view: select all parent and child checkboxes
            const allCheckboxes = dropdownContainer.querySelectorAll('[name*="parent-checkbox"], [name*="child-checkbox"]');
            allCheckboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                    // Trigger change event to update parent-child relationships
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        } else {
            // Flat view: select all parent checkboxes only
            const allCheckboxes = dropdownContainer.querySelectorAll('[name*="parent-checkbox"]');
            allCheckboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                }
            });
        }

        // Update selected display
        CustomControl.updateSelectedDisplay(containerId);
        console.log(`[CustomControl] Select All executed for ${containerId}`);
    },

    /**
     * Handle Clear All button click - clear all options.
     * @param {string} containerId - Container ID for this dropdown instance
     */
    handleClearAll: function (containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // Check if this is tree view or flat view
        const hasTreeView = CustomControl.getByName(dropdownContainer, 'ddl-children') !== null;

        if (hasTreeView) {
            // Tree view: clear all parent and child checkboxes
            const allCheckboxes = dropdownContainer.querySelectorAll('[name*="parent-checkbox"], [name*="child-checkbox"]');
            allCheckboxes.forEach(checkbox => {
                if (checkbox.checked || checkbox.indeterminate) {
                    checkbox.checked = false;
                    checkbox.indeterminate = false;
                    // Trigger change event to update parent-child relationships
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        } else {
            // Flat view: clear all parent checkboxes only
            const allCheckboxes = dropdownContainer.querySelectorAll('[name*="parent-checkbox"]');
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.indeterminate = false;
            });
        }

        // Update selected display
        CustomControl.updateSelectedDisplay(containerId);
        console.log(`[CustomControl] Clear All executed for ${containerId}`);
    },

    /**
     * Handle search functionality - filter options based on search term.
     * @param {string} containerId - Container ID for this dropdown instance
     * @param {string} searchTerm - The search term to filter by
     */
    handleSearch: function (containerId, searchTerm) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        const hasTreeView = CustomControl.getByName(dropdownContainer, 'ddl-children') !== null;
        const parentElements = CustomControl.getAllByName(dropdownContainer, 'ddl-parent');
        const optionsContainer = CustomControl.getByName(dropdownContainer, 'ddl-options');

        // If search term is empty, show all elements and hide no results message
        if (searchTerm === '') {
            parentElements.forEach(parentElement => {
                parentElement.style.display = '';
                // Show all children if tree view
                if (hasTreeView) {
                    const childrenContainer = CustomControl.getByName(parentElement, 'ddl-children');
                    if (childrenContainer) {
                        const childElements = CustomControl.getAllByName(childrenContainer, 'ddl-child');
                        childElements.forEach(child => {
                            child.style.display = '';
                        });
                    }
                }
            });
            
            // Hide no results message
            CustomControl.handleNoSearchResults(optionsContainer, false);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        let visibleParentsCount = 0;

        parentElements.forEach(parentElement => {
            const parentLabel = CustomControl.getByName(parentElement, 'ddl-parent-label');
            if (!parentLabel) return;

            // Get parent name (handle both checkbox and plain text scenarios)
            let parentName = '';
            const parentTextSpan = CustomControl.getByName(parentLabel, 'ddl-label-text');
            if (parentTextSpan) {
                parentName = parentTextSpan.innerText.toLowerCase();
            } else {
                parentName = parentLabel.innerText.toLowerCase();
            }

            let showParent = false;

            // Check if parent matches search term
            const parentMatches = parentName.includes(searchLower);

            if (hasTreeView) {
                // Tree view: search in both parents and children
                const childrenContainer = CustomControl.getByName(parentElement, 'ddl-children');
                let hasMatchingChild = false;

                if (childrenContainer) {
                    const childElements = CustomControl.getAllByName(childrenContainer, 'ddl-child');
                    childElements.forEach(childElement => {
                        // Get child name (handle both checkbox and plain text scenarios)
                        let childName = '';
                        const childTextSpan = CustomControl.getByName(childElement, 'ddl-label-text');
                        if (childTextSpan) {
                            childName = childTextSpan.innerText.toLowerCase();
                        } else {
                            childName = childElement.innerText.toLowerCase();
                        }

                        const childMatches = childName.includes(searchLower);

                        if (childMatches) {
                            childElement.style.display = '';
                            hasMatchingChild = true;
                        } else {
                            childElement.style.display = 'none';
                        }
                    });
                }

                // Show parent if parent matches OR if any child matches
                showParent = parentMatches || hasMatchingChild;

                // If parent matches, show all children
                if (parentMatches && childrenContainer) {
                    const childElements = CustomControl.getAllByName(childrenContainer, 'ddl-child');
                    childElements.forEach(child => {
                        child.style.display = '';
                    });
                }
            } else {
                // Flat view: search in parents only
                showParent = parentMatches;
            }

            // Show or hide the entire parent element
            parentElement.style.display = showParent ? '' : 'none';
            
            // Count visible parents
            if (showParent) {
                visibleParentsCount++;
            }
        });

        // Show or hide no results message based on visible count
        const hasNoResults = visibleParentsCount === 0;
        CustomControl.handleNoSearchResults(optionsContainer, hasNoResults);

        console.log(`[CustomControl] Search executed for "${searchTerm}" in ${containerId}`);
    },

    /**
     * Add checkbox event listeners to parent and child checkboxes.
     * @param {HTMLElement} optionsContainer - Options container element
     */
    addCheckboxEventListeners: function (optionsContainer) {
        // Parent checkbox event listeners
        const parentCheckboxes = optionsContainer.querySelectorAll('[name*="parent-checkbox"]');
        parentCheckboxes.forEach(parentCheckbox => {
            parentCheckbox.addEventListener('change', function(e) {
                e.stopPropagation(); // Prevent interference with other events
                const parentId = e.target.dataset.parentId;
                CustomControl.handleParentCheckboxChange(e.target, parentId);
            });
            
            // Also prevent click from bubbling
            parentCheckbox.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        // Child checkbox event listeners
        const childCheckboxes = optionsContainer.querySelectorAll('[name*="child-checkbox"]');

        childCheckboxes.forEach(childCheckbox => {
            childCheckbox.addEventListener('change', function(e) {
                e.stopPropagation(); // Prevent interference with other events
                const parentId = e.target.dataset.parentId;
        
                CustomControl.handleChildCheckboxChange(e.target, parentId);
            });
            
            // Also prevent click from bubbling
            childCheckbox.addEventListener('click', function(e) {
                e.stopPropagation();
            });
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
    /**
     * Close all other dropdowns except the current one.
     * @param {HTMLElement} currentWrapper - Current dropdown wrapper to keep open
     */
    closeAllOtherDropdowns: function (currentWrapper) {
        const allDropdowns = document.querySelectorAll('[name*="custom-ddl"]');
        allDropdowns.forEach(dropdown => {
            if (dropdown !== currentWrapper && CustomControl.nameListContains(dropdown, 'open')) {
                const optionsContainer = CustomControl.getByName(dropdown, 'ddl-options');
                if (optionsContainer) {
                    CustomControl.closeDropdown(dropdown, optionsContainer);
                }
            }
        });
    },

    toggleDropdown: function (ddlWrapper, optionsContainer) {
        const isHidden = CustomControl.nameListContains(optionsContainer, 'hidden');
        
        if (isHidden) {
            // ✅ Close all other dropdowns before opening this one
            CustomControl.closeAllOtherDropdowns(ddlWrapper);
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
        CustomControl.nameListRemove(optionsContainer, 'hidden');
        CustomControl.nameListAdd(ddlWrapper, 'open');
        console.log('[CustomControl] Dropdown opened');
    },

    /**
     * Close the dropdown.
     * @param {HTMLElement} ddlWrapper - Dropdown wrapper element
     * @param {HTMLElement} optionsContainer - Options container element
     */
    closeDropdown: function (ddlWrapper, optionsContainer) {
        CustomControl.nameListAdd(optionsContainer, 'hidden');
        CustomControl.nameListRemove(ddlWrapper, 'open');
        console.log('[CustomControl] Dropdown closed');
    },

    /**
     * Render base container (label + ddl header + placeholder).
     * @param {HTMLElement} container - Target container
     */
    renderBase: function (container, settings) {
        // Clear container
        CustomControl.clearContainer(container);

        // Create and append label
        const label = CustomControl.createLabel(settings);
        container.appendChild(label);

        // Create dropdown components
        const ddlWrapper = CustomControl.createDropdownWrapper(settings);
        const header = CustomControl.createHeader(settings);
        const optionsContainer = CustomControl.createOptionsContainer();

        // Populate options container with buttons and search box
        CustomControl.populateOptionsContainer(optionsContainer, settings);

        // ✅ Render JSON options into dropdown
        CustomControl.renderOptions(settings.data, optionsContainer, settings);

        // ✅ Create selected options display area
        const selectedDisplay = CustomControl.createSelectedDisplay(settings);

        // Assemble dropdown structure
        ddlWrapper.appendChild(header);
        ddlWrapper.appendChild(optionsContainer);
        container.appendChild(ddlWrapper);
        container.appendChild(selectedDisplay);

        // Add event listeners for interactivity
        CustomControl.addEventListeners(ddlWrapper, header, optionsContainer);

        // ✅ Add checkbox event listeners if multiSelect is enabled
        if (settings.flags.multiSelect.enabled) {
            CustomControl.addCheckboxEventListeners(optionsContainer);
        }

        // ✅ Initialize selected display for this specific dropdown
        CustomControl.updateSelectedDisplay(settings.containerId);
    }
};
