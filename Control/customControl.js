/**
 * Custom Dropdown Control
 * -----------------------
 */

export const CustomControl = {
    /**
     * Helper functions to manage name attributes like classList:
     */

    /**
     * Create DOM element with common properties (reduces duplication).
     * @param {string} tagName - HTML tag name (div, input, button, span, etc.)
     * @param {string} nameAttr - Value for name attribute
     * @param {Object} options - Optional properties {id, innerText, type, dataset, className, etc.}
     * @returns {HTMLElement} Created element
     */
    createElement: function(tagName, nameAttr, options = {}) {
        const element = document.createElement(tagName);
        element.setAttribute('name', nameAttr);
        
        // Apply optional properties
        if (options.id) element.id = options.id;
        if (options.innerText) element.innerText = options.innerText;
        if (options.innerHTML) element.innerHTML = options.innerHTML;
        if (options.type) element.type = options.type; // for inputs
        if (options.placeholder) element.placeholder = options.placeholder;
        if (options.title) element.title = options.title;
        if (options.className) element.className = options.className;
        
        // Apply dataset properties
        if (options.dataset) {
            Object.keys(options.dataset).forEach(key => {
                element.dataset[key] = options.dataset[key];
            });
        }
        
        return element;
    },

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
     ** getByName(): Gets elements' that has the name attribute by searching in its parent using querySelectorAll and checking if the name attribute value is in the array by using nameListContains(), if true, return the element, otherwise return null
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
        // return null;
    },

    /**
     ** getAllByName(): Gets elements' that has the name attribute by using querySelectorAll and checking if the name attribute value is in the array by using nameListContains(), if true, return the element, otherwise return an empty array
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
                CustomControl.nameListAdd(placeholderOption, 'ddl-hidden');
                CustomControl.nameListRemove(placeholderOption, 'ddl-visible');
            }
            
            if (!noResultsMsg) {
                // Create the no results message element
                noResultsMsg = document.createElement('div');
                noResultsMsg.setAttribute('name', 'ddl-no-results');
                noResultsMsg.innerText = 'لا يوجد نتائج للبحث';
                
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
            CustomControl.nameListRemove(noResultsMsg, 'ddl-hidden');
            CustomControl.nameListAdd(noResultsMsg, 'ddl-visible');
        } else {
            // Show placeholder option when hiding no results message
            if (placeholderOption) {
                CustomControl.nameListRemove(placeholderOption, 'ddl-hidden');
                CustomControl.nameListAdd(placeholderOption, 'ddl-visible');
            }
            
            if (noResultsMsg) {
                CustomControl.nameListAdd(noResultsMsg, 'ddl-hidden');
                CustomControl.nameListRemove(noResultsMsg, 'ddl-visible');
            }
        }
    },
    /**
     * Initialize the dropdown inside a container.
     * This method is considered as API for the user to initialize the dropdown.
     * @param {Object} params - Configuration object
     * @param {string} params.containerId - ID of the container element where dropdown will be rendered
     * @param {string} [params.placeholder="اختر..."] - Placeholder text shown before selection
     * @param {Array}  params.data - Hierarchical JSON data [{id, name, children:[]}]
     * @param {Object} [params.flags] - Optional feature toggles (STRICT boolean values only)
     *        Example: {
     *           hasSearch: true,        // ONLY literal true or false
     *           hasMultiSelect: false,  // ONLY literal true or false
     *           hasTreeView: true,      // ONLY literal true or false
     *           hasSelectAllBtn: false, // ONLY literal true or false
     *           hasClearAllBtn: true    // ONLY literal true or false
     *        }
     *        STRICT TYPE SAFETY:
     *        Valid: true, false, undefined (defaults to false)
     *        Invalid: 1, 0, "yes", "", [], {}, null, etc. (all default to false with warning)
     */
    initialize: function (params) {
        //* Validation: Ensure container exists
        const container = document.getElementById(params.containerId);
        if (!container) {
            console.error(`[CustomControl] Container with ID '${params.containerId}' not found.`);
            return;
        }

        //* Validate flag types for better developer experience - STRICT boolean validation
        if (params.flags) {
            const flagNames = ['hasSearch', 'hasMultiSelect', 'hasTreeView', 'hasSelectAllBtn', 'hasClearAllBtn'];
            flagNames.forEach(flagName => {
                const flagValue = params.flags[flagName];
                if (flagValue !== undefined && flagValue !== true && flagValue !== false) {
                    console.warn(`[CustomControl] Flag '${flagName}' must be literal true or false, received: ${typeof flagValue} (${JSON.stringify(flagValue)}). Defaulting to false.`);
                }
            });
        }

        //* Helper function for strict boolean validation
        const getStrictBoolean = (value) => {
            if (value === true) return true;
            if (value === false) return false;
            return false; // Default for any non-boolean value (including undefined)
        };

        //* Prepare settings for this instance (no global on the object level so every drop down will have its own settings)
        const settings = {
            containerId: params.containerId,
            placeholder: params.placeholder || "اختر...",
            data: params.data || [],
            flags: {
                hasSearch: getStrictBoolean(params.flags?.hasSearch),
                hasMultiSelect: getStrictBoolean(params.flags?.hasMultiSelect),
                hasTreeView: getStrictBoolean(params.flags?.hasTreeView),
                hasSelectAllBtn: getStrictBoolean(params.flags?.hasSelectAllBtn),
                hasClearAllBtn: getStrictBoolean(params.flags?.hasClearAllBtn)
                //! Only literal true/false accepted - all other values default to false
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
     * Create main dropdown wrapper element.
     * @param {string} containerId - Container ID for this instance
     * @returns {HTMLElement} Dropdown wrapper element
     */
    createDropdownWrapper: function (containerId) {
        return CustomControl.createElement('div', 'custom-ddl', {
            id: `${containerId}_ddl`
        });
    },

    /**
     * Create dropdown header with placeholder text.
     * @param {string} placeholder - Placeholder text to display
     * @returns {HTMLElement} Header element
     */
    createHeader: function (placeholder) {
        return CustomControl.createElement('div', 'ddl-header', {
            innerText: placeholder
        });
    },

    /**
     * Create options container element.
     * @returns {HTMLElement} Options container element
     */
    createOptionsContainer: function () {
        return CustomControl.createElement('div', 'ddl-options hidden');
    },

    /**
     * Create multi-select navigation icon.
     * @param {string} containerId - Container ID for this instance
     * @returns {HTMLElement} Navigation icon element
     */
    createMultiNavIcon: function (containerId) {
        const navIcon = CustomControl.createElement('div', 'ddl-multi-nav-icon', {
            innerHTML: "↓",
            title: "الانتقال إلى التحديد التالي",
            dataset: { containerId: containerId }
        });
        
        // Add click event listener
        navIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            const containerId = e.currentTarget.dataset.containerId;
            CustomControl.navigateToNextSelection(containerId);
        });
        
        return navIcon;
    },

    /**
     * Create Select All button if enabled.
     * @param {boolean} hasSelectAllBtn - Whether to create the button
     * @param {string} containerId - Container ID for this instance
     * @returns {HTMLElement|null} Select All button element or null
     */
    createSelectAllButton: function (hasSelectAllBtn, containerId) {
        if (!hasSelectAllBtn) {
            return null;
        }
        
        const btnSelectAll = CustomControl.createElement('button', 'ddl-btn select-all', {
            innerText: "تحديد الكل",
            dataset: { containerId: containerId }
        });
        
        // Add event listener for Select All functionality
        btnSelectAll.addEventListener('click', function(e) {
            e.stopPropagation();
            const containerId = e.currentTarget.dataset.containerId;
            CustomControl.toggleAllSelections(containerId, true);
        });
        
        return btnSelectAll;
    },

    /**
     * Create Clear All button if enabled.
     * @param {boolean} hasClearAllBtn - Whether to create the button
     * @param {string} containerId - Container ID for this instance
     * @returns {HTMLElement|null} Clear All button element or null
     */
    createClearAllButton: function (hasClearAllBtn, containerId) {
        if (!hasClearAllBtn) {
            return null;
        }
        
        const btnClearAll = CustomControl.createElement('button', 'ddl-btn clear-all', {
            innerText: "مسح الكل",
            dataset: { containerId: containerId }
        });
        
        // Add event listener for Clear All functionality
        btnClearAll.addEventListener('click', function(e) {
            e.stopPropagation();
            const containerId = e.currentTarget.dataset.containerId;
            CustomControl.toggleAllSelections(containerId, false);
        });
        
        return btnClearAll;
    },

    /**
     * Create search input box if enabled.
     * @param {boolean} hasSearch - Whether to create the search box
     * @param {string} containerId - Container ID for this instance
     * @returns {HTMLElement|null} Search input element or null
     */
        createSearchBox: function (hasSearch, containerId) {
        if (!hasSearch) {
            return null;
        }
        
        const searchBox = CustomControl.createElement('input', 'ddl-search', {
            type: 'text',
            placeholder: "بحث...",
            dataset: { containerId: containerId }
        });
        
        // Add event listener for search functionality
        searchBox.addEventListener('input', function(e) {
            const containerId = e.currentTarget.dataset.containerId;
            const searchTerm = e.currentTarget.value.trim();
            CustomControl.handleSearch(containerId, searchTerm);
        });
        
        return searchBox;
    },

    /**
     * Create button container for action buttons.
     * @param {boolean} hasMultiSelect - Whether multi-select is enabled
     * @param {boolean} hasSelectAllBtn - Whether to show select all button
     * @param {boolean} hasClearAllBtn - Whether to show clear all button
     * @param {string} containerId - Container ID for this instance
     * @returns {HTMLElement|null} Button container element or null
     */
    createButtonContainer: function (hasMultiSelect, hasSelectAllBtn, hasClearAllBtn, containerId) {
        const showSelectAll = hasMultiSelect && hasSelectAllBtn;
        const showClearAll = hasMultiSelect && hasClearAllBtn;

        // Only create container if at least one button should be shown
        if (!showSelectAll && !showClearAll) {
            return null;
        }

        const buttonContainer = document.createElement("div");
        buttonContainer.setAttribute('name', 'ddl-button-container');

        if (showSelectAll) {
            const selectAllBtn = CustomControl.createSelectAllButton(hasSelectAllBtn, containerId);
            buttonContainer.appendChild(selectAllBtn);
        }

        if (showClearAll) {
            const clearAllBtn = CustomControl.createClearAllButton(hasClearAllBtn, containerId);
            buttonContainer.appendChild(clearAllBtn);
        }

        return buttonContainer;
    },

    /**
     * Add action buttons and search box to options container.
     * @param {HTMLElement} optionsContainer - Options container element
     * @param {boolean} hasMultiSelect - Whether multi-select is enabled
     * @param {boolean} hasSelectAllBtn - Whether to show select all button
     * @param {boolean} hasClearAllBtn - Whether to show clear all button
     * @param {boolean} hasSearch - Whether to show search box
     * @param {string} containerId - Container ID for this instance
     */
    populateOptionsContainer: function (optionsContainer, hasMultiSelect, hasSelectAllBtn, hasClearAllBtn, hasSearch, containerId) {
        // Only show buttons if multiSelect is enabled
        const showSelectAll = hasMultiSelect && hasSelectAllBtn;
        const showClearAll = hasMultiSelect && hasClearAllBtn;
        
        if (showSelectAll || showClearAll) {
            const buttonContainer = CustomControl.createButtonContainer(hasMultiSelect, hasSelectAllBtn, hasClearAllBtn, containerId);
            optionsContainer.appendChild(buttonContainer);
        }

        // Add search box if enabled
        if (hasSearch) {
            const searchBox = CustomControl.createSearchBox(hasSearch, containerId);
            optionsContainer.appendChild(searchBox);
        }
    },

    /**
     * Generate element ID.
     * Format: containerId-parentId[-childId]
     * 
     * @param {string} containerId - The control's container ID
     * @param {string|number} parentId - Parent ID from JSON
     * @param {string|number} [childId] - Child ID from JSON (optional)
     * @returns {string} Element ID
     */
    generateId: function (containerId, parentId, childId) {
        return childId 
            ? `${containerId}-${parentId}-${childId}`
            : `${containerId}-${parentId}`;
    },

    /**
     * Add placeholder option that clears all selections when clicked.
     * If Clear All button exists, placeholder is visible but disabled to avoid redundancy.
     * @param {HTMLElement} optionsContainer - Options container element
     * @param {boolean} hasMultiSelect - Whether multi-select is enabled
     * @param {boolean} hasClearAllBtn - Whether clear all button is enabled
     * @param {string} placeholder - Placeholder text
     * @param {string} containerId - Container ID for this instance
     */
    addPlaceholderOption: function (optionsContainer, hasMultiSelect, hasClearAllBtn, placeholder, containerId) {
        // Check if Clear All button is enabled - if so, make placeholder disabled
        const shouldDisable = hasMultiSelect && hasClearAllBtn;
        
        const placeholderDiv = CustomControl.createElement('div', 'ddl-placeholder-option', {
            innerText: placeholder,
            dataset: { containerId: containerId }
        });
        
        if (shouldDisable) {
            // Disable placeholder when Clear All button exists
            CustomControl.nameListAdd(placeholderDiv, 'ddl-disabled');
        } else {
            // Enable placeholder with click functionality
            placeholderDiv.addEventListener('click', function(e) {
                e.stopPropagation();
                const containerId = e.currentTarget.dataset.containerId;
                CustomControl.clearAllSelections(containerId);
                
                // Close dropdown after clearing
                const dropdownContainer = document.getElementById(`${containerId}_ddl`);
                const optionsContainer = CustomControl.getByName(dropdownContainer, 'ddl-options');
                if (dropdownContainer && optionsContainer) {
                    CustomControl.closeDropdown(dropdownContainer, optionsContainer);
                }
            });
        }
        
        optionsContainer.appendChild(placeholderDiv);
    },


    /**
     * Create parent element structure with unique ID.
     * @param {Object} parent - Parent data object
     * @param {string} containerId - Container ID for this instance
     * @returns {Object} Object containing parentDiv and parentLabel
     */
    createParentElement: function(parent, containerId) {
        const parentDiv = CustomControl.createElement('div', 'ddl-parent');
        const parentLabel = CustomControl.createElement('div', 'ddl-parent-label', {
            id: CustomControl.generateId(containerId, parent.id),
            dataset: { id: parent.id }
        });

        return { parentDiv, parentLabel };
    },

    /**
     * Setup parent content (checkbox + text or just text).
     * @param {HTMLElement} parentLabel - Parent label element
     * @param {Object} parent - Parent data object
     * @param {boolean} hasMultiSelect - Whether multi-select is enabled
     */
    setupParentContent: function(parentLabel, parent, hasMultiSelect) {
        if (hasMultiSelect) {
            const parentCheckbox = CustomControl.createElement('input', 'ddl-checkbox parent-checkbox', {
                type: 'checkbox',
                id: `${parentLabel.id}-checkbox`,
                dataset: { parentId: parent.id }
            });

            const parentText = CustomControl.createElement('span', 'ddl-label-text', {
                innerText: parent.name
            });

            parentLabel.appendChild(parentCheckbox);
            parentLabel.appendChild(parentText);
        } else {
            // Single selection - use consistent span structure
            const parentText = CustomControl.createElement('span', 'ddl-label-text', {
                innerText: parent.name
            });
            parentLabel.appendChild(parentText);
        }
    },

    /**
     * Create a single child element with proper setup.
     * @param {Object} child - Child data object
     * @param {Object} parent - Parent data object
     * @param {string} containerId - Container ID for this instance
     * @param {boolean} hasMultiSelect - Whether multi-select is enabled
     * @returns {HTMLElement} Child element
     */
    createChildElement: function(child, parent, containerId, hasMultiSelect) {
        const childDiv = CustomControl.createElement('div', 'ddl-child', {
            id: CustomControl.generateId(containerId, parent.id, child.id),
            dataset: { 
                id: child.id, 
                parentId: parent.id 
            }
        });

        CustomControl.setupChildContent(childDiv, child, parent, hasMultiSelect);
        
        return childDiv;
    },

    /**
     * Setup child content (checkbox + text or just text with click handler).
     * @param {HTMLElement} childDiv - Child element
     * @param {Object} child - Child data object
     * @param {Object} parent - Parent data object
     * @param {boolean} hasMultiSelect - Whether multi-select is enabled
     */
    setupChildContent: function(childDiv, child, parent, hasMultiSelect) {
        if (hasMultiSelect) {
            const childCheckbox = CustomControl.createElement('input', 'ddl-checkbox child-checkbox', {
                type: 'checkbox',
                id: `${childDiv.id}-checkbox`,
                dataset: { 
                    childId: child.id,
                    parentId: parent.id 
                }
            });

            const childText = CustomControl.createElement('span', 'ddl-label-text', {
                innerText: child.name
            });

            childDiv.appendChild(childCheckbox);
            childDiv.appendChild(childText);
        } else {
            // Single selection - use consistent span structure
            const childText = CustomControl.createElement('span', 'ddl-label-text', {
                innerText: child.name
            });
            childDiv.appendChild(childText);
            
            CustomControl.nameListAdd(childDiv, "ddl-option");
            childDiv.addEventListener("click", function(e) {
                e.stopPropagation();
                const dropdownContainer = e.currentTarget.closest('[name~="custom-ddl"]');
                const containerId = dropdownContainer ? dropdownContainer.id.replace('_ddl', '') : null;
                if (containerId) {
                    CustomControl.handleSingleSelection(e.currentTarget, containerId);
                }
            });
        }
    },

    /**
     * Create children container and populate with child elements.
     * @param {Object} parent - Parent data object
     * @param {string} containerId - Container ID for this instance
     * @param {boolean} hasMultiSelect - Whether multi-select is enabled
     * @returns {HTMLElement} Children container element
     */
    createChildrenSection: function(parent, containerId, hasMultiSelect) {
        const childrenContainer = CustomControl.createElement('div', 'ddl-children');

        parent.children.forEach(child => {
            const childDiv = CustomControl.createChildElement(child, parent, containerId, hasMultiSelect);
            childrenContainer.appendChild(childDiv);
        });

        return childrenContainer;
    },

    /**
     * Add expand/collapse behavior to tree view parents.
     * @param {HTMLElement} parentLabel - Parent label element
     * @param {HTMLElement} childrenContainer - Children container element
     * @param {boolean} hasMultiSelect - Whether multi-select is enabled
     */
    addTreeViewBehavior: function(parentLabel, childrenContainer, hasMultiSelect) {
        const toggleChildren = function () {
            CustomControl.nameListToggle(childrenContainer, "hidden");
            const isNowVisible = !CustomControl.nameListContains(childrenContainer, "hidden");
            
            if (isNowVisible) {
                CustomControl.nameListAdd(parentLabel, "expanded");    // Arrow UP ▲
            } else {
                CustomControl.nameListRemove(parentLabel, "expanded"); // Arrow DOWN ▼
            }
        };

        if (hasMultiSelect) {
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
    },

    /**
     * Add single selection handlers to parent elements.
     * @param {HTMLElement} parentLabel - Parent label element
     * @param {Object} parent - Parent data object
     * @param {boolean} hasTreeView - Whether tree view is enabled
     */
    addSingleSelectionHandlers: function(parentLabel, parent, hasTreeView) {
        const hasChildren = parent.children && parent.children.length > 0;
        
        // In single selection:
        // - Tree view with children: Parents are NOT selectable (only for organization)
        // - Tree view without children OR no tree view: Parents ARE selectable
        if (!hasTreeView || !hasChildren) {
            CustomControl.nameListAdd(parentLabel, "ddl-option");
            
            parentLabel.addEventListener("click", function(e) {
                e.stopPropagation();
                const dropdownContainer = e.currentTarget.closest('[name~="custom-ddl"]');
                const containerId = dropdownContainer ? dropdownContainer.id.replace('_ddl', '') : null;
                if (containerId) {
                    CustomControl.handleSingleSelection(e.currentTarget, containerId);
                }
            });
        }
    },

    /**
     * Render dropdown options (orchestrator method).
     * @param {Array} data - Hierarchical data [{id, name, children:[]}]
     * @param {HTMLElement} optionsContainer - Target options container
     * @param {boolean} hasMultiSelect - Whether multi-select is enabled
     * @param {boolean} hasTreeView - Whether tree view is enabled
     * @param {boolean} hasClearAllBtn - Whether clear all button is enabled
     * @param {string} placeholder - Placeholder text
     * @param {string} containerId - Container ID for this instance
     */
    renderOptions: function (data, optionsContainer, hasMultiSelect, hasTreeView, hasClearAllBtn, placeholder, containerId) {
        // Add placeholder option
        CustomControl.addPlaceholderOption(optionsContainer, hasMultiSelect, hasClearAllBtn, placeholder, containerId);

        // Process each parent
        data.forEach(parent => {
            // Create parent structure
            const { parentDiv, parentLabel } = CustomControl.createParentElement(parent, containerId);
            CustomControl.setupParentContent(parentLabel, parent, hasMultiSelect);
            parentDiv.appendChild(parentLabel);

            // Handle tree view children
            if (hasTreeView && parent.children && parent.children.length > 0) {
                // Mark parent as having children for arrow styling and set as expanded by default
                CustomControl.nameListAdd(parentLabel, "has-children");
                CustomControl.nameListAdd(parentLabel, "expanded"); // expanded by default
                
                // Create children section
                const childrenContainer = CustomControl.createChildrenSection(parent, containerId, hasMultiSelect);
                parentDiv.appendChild(childrenContainer);

                // Add expand/collapse behavior
                CustomControl.addTreeViewBehavior(parentLabel, childrenContainer, hasMultiSelect);
            }

            // Add single selection handlers if needed
            if (!hasMultiSelect) {
                CustomControl.addSingleSelectionHandlers(parentLabel, parent, hasTreeView);
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

        // Clear all previous selections in this dropdown instance
        const allOptions = CustomControl.getAllByName(dropdownContainer, 'ddl-option');
        allOptions.forEach(option => {
            CustomControl.nameListRemove(option, 'ddl-selected');
        });

        // Select the clicked option
        CustomControl.nameListAdd(selectedElement, 'ddl-selected');

        // Update dropdown header
        CustomControl.updateDropdownHeader(containerId);

        // Close dropdown after selection
        const optionsContainer = CustomControl.getByName(dropdownContainer, 'ddl-options');
        if (optionsContainer) {
            CustomControl.closeDropdown(dropdownContainer, optionsContainer);
        }
    },

    /**
     * Get selected data from a dropdown by container ID.
     * This method is considered as API for the user to get the selected data from the dropdown.
     * @param {string} containerId - The specific dropdown container ID
     * @returns {Object} Object containing selected data and metadata
     */
    getDDLData: function (containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) {
            console.warn(`[CustomControl] Container with ID '${containerId}' not found.`);
            return { selected: [], hasData: false, selectionType: null };
        }

        // Determine dropdown configuration
        const checkboxElement = CustomControl.getByName(dropdownContainer, 'ddl-checkbox');
        const childrenElement = CustomControl.getByName(dropdownContainer, 'ddl-children');
        const hasMultiSelect = !!checkboxElement;
        const hasTreeView = !!childrenElement;
        const data = CustomControl.extractDataFromDOM(dropdownContainer);

        let selectedData = [];
        let selectionType = 'single';

        if (hasMultiSelect) {
            selectionType = hasTreeView ? 'multi-tree' : 'multi-flat';
            
            if (hasTreeView) {
                // Multi-select tree view: get detailed parent-child relationships
                selectedData = CustomControl.getTreeViewSelectedData(dropdownContainer, data);
            } else {
                // Multi-select flat view: get selected parent items
                selectedData = CustomControl.getFlatSelectedData(dropdownContainer, data);
            }
        } else {
            // Single selection: get the selected item
            selectionType = hasTreeView ? 'single-tree' : 'single-flat';
            const selectedItem = CustomControl.getSingleSelectedData(dropdownContainer, data);
            if (selectedItem) {
                selectedData = [selectedItem];
            }
        }

        return {
            selected: selectedData,
            hasData: selectedData.length > 0,
            selectionType: selectionType,
            containerId: containerId
        };
    },

    /**
     * Set selected data for a dropdown by container ID.
     * @param {string} containerId - The specific dropdown container ID
     * @param {Object} selections - Object containing parents and children arrays
     * @param {Array<string|number>} [selections.parents] - Array of parent IDs to select
     * @param {Array<string|number>} [selections.children] - Array of child IDs to select
     * @returns {boolean} True if selections were set successfully, false otherwise
     * 
     * @example
     * // Multi-select tree view
     * CustomControl.setDDLData("DDLcontainer0004", {
     *   parents: ["1", "3"],
     *   children: ["301", "302", "501"]
     * });
     * 
     * // Single-select (only first parent or first child will be selected)
     * CustomControl.setDDLData("DDLcontainer0001", {
     *   parents: ["3"]
     * });
     */
    setDDLData: function (containerId, selections = {}) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) {
            console.warn(`[CustomControl] Container with ID '${containerId}' not found.`);
            return false;
        }

        // Determine dropdown configuration
        const checkboxElement = CustomControl.getByName(dropdownContainer, 'ddl-checkbox');
        const childrenElement = CustomControl.getByName(dropdownContainer, 'ddl-children');
        const hasMultiSelect = !!checkboxElement;
        const hasTreeView = !!childrenElement;

        // Convert all IDs to strings for consistent comparison
        const parentIds = (selections.parents || []).map(id => String(id));
        const childIds = (selections.children || []).map(id => String(id));

        if (hasMultiSelect) {
            // Multi-select mode: set checkboxes
            if (hasTreeView) {
                CustomControl.setTreeViewMultiSelections(dropdownContainer, parentIds, childIds);
            } else {
                CustomControl.setFlatMultiSelections(dropdownContainer, parentIds);
            }
        } else {
            // Single-select mode: set single selection (prefer parent over child)
            const targetId = parentIds[0] || childIds[0];
            CustomControl.setSingleSelection(dropdownContainer, targetId, hasTreeView);
        }

        // Update dropdown header
        CustomControl.updateDropdownHeader(containerId);

        console.log(`[CustomControl] setDDLData executed for ${containerId} with selections:`, selections);
        return true;
    },

    /**
     * Update navigation icon visibility based on multi-select selections.
     * @param {string} containerId - Container ID for this dropdown instance
     */
    updateMultiNavIconVisibility: function (containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        const optionsContainer = CustomControl.getByName(dropdownContainer, 'ddl-options');
        const navIcon = CustomControl.getByName(optionsContainer, 'ddl-multi-nav-icon');
        if (!navIcon) return;

        // Check if this is multi-select mode
        const checkboxes = CustomControl.getAllByName(dropdownContainer, 'ddl-checkbox');
        const hasMultiSelect = checkboxes.length > 0;
        
        // Check if dropdown is open
        const isDropdownOpen = CustomControl.nameListContains(dropdownContainer, 'open');
        
        if (!hasMultiSelect || !isDropdownOpen) {
            CustomControl.nameListRemove(navIcon, 'ddl-visible');
            return;
        }

        // Count selections
        const selectedCount = CustomControl.getMultiSelectSelectionCount(containerId);
        
        // Show icon if there are multiple selections (2 or more) AND dropdown is open
        if (selectedCount >= 2) {
            CustomControl.nameListAdd(navIcon, 'ddl-visible');
        } else {
            CustomControl.nameListRemove(navIcon, 'ddl-visible');
        }
    },

    /**
     * Get the count of selected items in multi-select mode.
     * @param {string} containerId - Container ID for this dropdown instance
     * @returns {number} Number of selected items
     */
    getMultiSelectSelectionCount: function (containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return 0;

        const checkboxes = CustomControl.getAllByName(dropdownContainer, 'ddl-checkbox');
        const checkedCheckboxes = checkboxes.filter(checkbox => checkbox.checked);
        
        return checkedCheckboxes.length;
    },

    /**
     * Navigate to the next selected element in multi-select mode.
     * @param {string} containerId - Container ID for this dropdown instance
     */
    navigateToNextSelection: function (containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        const optionsContainer = CustomControl.getByName(dropdownContainer, 'ddl-options');
        if (!optionsContainer) return;

        // Check if this is tree view mode
        const hasTreeView = CustomControl.getByName(dropdownContainer, 'ddl-children') !== null;
        
        if (hasTreeView) {
            CustomControl.navigateToNextTreeViewSelection(containerId, optionsContainer);
        } else {
            CustomControl.navigateToNextFlatSelection(containerId, optionsContainer);
        }
    },

    /**
     * Navigate to next selection in tree view mode (optimized for parents with selected children).
     * @param {string} containerId - Container ID for this dropdown instance
     * @param {HTMLElement} optionsContainer - Options container element
     */
    navigateToNextTreeViewSelection: function (containerId, optionsContainer) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // Get parents with selected children (optimization for tree view)
        const parentsWithSelectedChildren = CustomControl.getParentsWithSelectedChildren(containerId);
        
        if (parentsWithSelectedChildren.length === 0) return;

        // Get current scroll position
        const currentScrollTop = optionsContainer.scrollTop;
        const optionsRect = optionsContainer.getBoundingClientRect();
        
        // Find the next selected parent below current scroll position
        let nextTarget = null;
        
        for (let parent of parentsWithSelectedChildren) {
            const parentRect = parent.getBoundingClientRect();
            // Check if parent is below the current visible area
            if (parentRect.top > optionsRect.bottom) {
                nextTarget = parent;
                break;
            }
        }
        
        // If no parent is below, wrap to the first one
        if (!nextTarget && parentsWithSelectedChildren.length > 0) {
            nextTarget = parentsWithSelectedChildren[0];
        }
        
        if (nextTarget) {
            CustomControl.scrollToElement(nextTarget);
            CustomControl.highlightNavigationTarget(nextTarget);
        }
    },

    /**
     * Navigate to next selection in flat view mode.
     * @param {string} containerId - Container ID for this dropdown instance
     * @param {HTMLElement} optionsContainer - Options container element
     */
    navigateToNextFlatSelection: function (containerId, optionsContainer) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        const checkedCheckboxes = CustomControl.getAllByName(dropdownContainer, 'ddl-checkbox').filter(cb => cb.checked);
        
        if (checkedCheckboxes.length === 0) return;

        // Get current scroll position
        const optionsRect = optionsContainer.getBoundingClientRect();
        
        // Find the next selected element below current scroll position
        let nextTarget = null;
        
        for (let checkbox of checkedCheckboxes) {
            const targetElement = checkbox.closest('[name~="ddl-parent-label"]');
            if (targetElement) {
                const elementRect = targetElement.getBoundingClientRect();
                // Check if element is below the current visible area
                if (elementRect.top > optionsRect.bottom) {
                    nextTarget = targetElement;
                    break;
                }
            }
        }
        
        // If no element is below, wrap to the first selected one
        if (!nextTarget && checkedCheckboxes.length > 0) {
            nextTarget = checkedCheckboxes[0].closest('[name~="ddl-parent-label"]');
        }
        
        if (nextTarget) {
            CustomControl.scrollToElement(nextTarget);
            CustomControl.highlightNavigationTarget(nextTarget);
        }
    },

    /**
     * Get parents that have selected children (for tree view navigation optimization).
     * @param {string} containerId - Container ID for this dropdown instance
     * @returns {Array} Array of parent elements with selected children
     */
    getParentsWithSelectedChildren: function (containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return [];

        const parentElements = CustomControl.getAllByName(dropdownContainer, 'ddl-parent');
        const parentsWithSelectedChildren = [];
        
        parentElements.forEach(parentElement => {
            const parentLabel = CustomControl.getByName(parentElement, 'ddl-parent-label');
            if (!parentLabel) return;

            const parentId = parentLabel.dataset.id;
            
            // Check if parent is selected OR has selected children
            const parentCheckbox = dropdownContainer.querySelector(`[name*="parent-checkbox"][data-parent-id="${parentId}"]`);
            const childCheckboxes = dropdownContainer.querySelectorAll(`[name*="child-checkbox"][data-parent-id="${parentId}"]`);
            
            const parentSelected = parentCheckbox && parentCheckbox.checked;
            const hasSelectedChildren = Array.from(childCheckboxes).some(cb => cb.checked);
            
            if (parentSelected || hasSelectedChildren) {
                parentsWithSelectedChildren.push(parentLabel);
            }
        });
        
        return parentsWithSelectedChildren;
    },

    /**
     * Scroll to a specific element smoothly.
     * @param {HTMLElement} element - Element to scroll to
     */
    scrollToElement: function (element) {
        if (!element) return;
        
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
    },

    /**
     * Add visual highlighting to navigation target.
     * @param {HTMLElement} element - Element to highlight
     */
    highlightNavigationTarget: function (element) {
        if (!element) return;
        
        // Remove existing highlights
        const allHighlighted = document.querySelectorAll('[name*="ddl-nav-highlight"]');
        allHighlighted.forEach(el => {
            CustomControl.nameListRemove(el, 'ddl-nav-highlight');
        });
        
        // Add highlight to current target
        CustomControl.nameListAdd(element, 'ddl-nav-highlight');
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
            CustomControl.nameListRemove(element, 'ddl-nav-highlight');
        }, 2000);
    },

    /**
     * Update dropdown header to show selected items based on current selections.
     * @param {string} containerId - The specific dropdown container ID
     */
    updateDropdownHeader: function (containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        const header = CustomControl.getByName(dropdownContainer, 'ddl-header');
        if (!header) return;

        // Get selected data
        const ddlData = CustomControl.getDDLData(containerId);
        let displayText = "";

        if (ddlData.hasData) {
            if (ddlData.selectionType === 'multi-tree') {
                // Tree view format: Parent ← child1, child2
                displayText = ddlData.selected.map(item => {
                    if (item.children && item.children.length > 0) {
                        const childNames = item.children.map(child => child.name).join(", ");
                        return `${item.name} ← ${childNames}`;
                    } else {
                        return item.name;
                    }
                }).join("\n");
            } else if (ddlData.selectionType === 'multi-flat') {
                // Flat multi-select format: option1, option2, option3
                displayText = ddlData.selected.map(item => item.name).join(", ");
            } else if (ddlData.selectionType === 'single-tree') {
                // Single tree selection: Parent ← Child or just Parent
                const item = ddlData.selected[0];
                if (item.parent && item.parent.name) {
                    displayText = `${item.parent.name} ← ${item.name}`;
                } else {
                    displayText = item.name;
                }
            } else {
                // Single flat selection: option1
                displayText = ddlData.selected[0].name;
            }
        }

        // Get the original placeholder from data attribute (stored during creation)
        const originalPlaceholder = header.dataset.placeholder;
        if (!originalPlaceholder) {
            // Store original placeholder on first use
            header.dataset.placeholder = header.innerText;
        }

        // Show selected items if any, otherwise show placeholder
        if (displayText && displayText.trim() !== "") {
            // Convert newlines to commas for better header display and ellipsis behavior
            const headerText = displayText.replace(/\n/g, ', ');
            header.innerText = headerText;
            CustomControl.nameListAdd(header, 'has-selections');
        } else {
            header.innerText = header.dataset.placeholder;
            CustomControl.nameListRemove(header, 'has-selections');
        }
        
        // Update navigation icon visibility after header update
        CustomControl.updateMultiNavIconVisibility(containerId);
    },

    /**
     * Set selections for tree view multi-select dropdowns.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {Array<string>} parentIds - Array of parent IDs to select
     * @param {Array<string>} childIds - Array of child IDs to select
     */
    setTreeViewMultiSelections: function (dropdownContainer, parentIds, childIds) {
        // Clear all existing selections
        const allCheckboxes = CustomControl.getAllByName(dropdownContainer, 'ddl-checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.indeterminate = false;
        });

        // Set parent selections
        parentIds.forEach(parentId => {
            const parentCheckbox = dropdownContainer.querySelector(`[name*="parent-checkbox"][data-parent-id="${parentId}"]`);
            if (parentCheckbox) {
                parentCheckbox.checked = true;
                // Trigger change event to update parent-child relationships
                parentCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Set child selections
        childIds.forEach(childId => {
            const childCheckbox = dropdownContainer.querySelector(`[name*="child-checkbox"][data-child-id="${childId}"]`);
            if (childCheckbox) {
                childCheckbox.checked = true;
                // Trigger change event to update parent-child relationships
                childCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    },

    /**
     * Set selections for flat multi-select dropdowns.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {Array<string>} parentIds - Array of parent IDs to select (child IDs are ignored in flat mode)
     */
    setFlatMultiSelections: function (dropdownContainer, parentIds) {
        // Clear all existing selections
        const allCheckboxes = CustomControl.getAllByName(dropdownContainer, 'parent-checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            // Update highlighting for parent element
            const parentElement = checkbox.closest('[name~="ddl-parent-label"]');
            if (parentElement) {
                CustomControl.updateCheckboxHighlight(parentElement, false);
            }
        });

        // Set selections based on parent IDs (only parent IDs are valid in flat mode)
        parentIds.forEach(parentId => {
            const parentCheckbox = dropdownContainer.querySelector(`[name*="parent-checkbox"][data-parent-id="${parentId}"]`);
            if (parentCheckbox) {
                parentCheckbox.checked = true;
                // Update highlighting for parent element
                const parentElement = parentCheckbox.closest('[name~="ddl-parent-label"]');
                if (parentElement) {
                    CustomControl.updateCheckboxHighlight(parentElement, true);
                }
            }
        });
    },

    /**
     * Set selection for single-select dropdowns.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {string} targetId - ID to select
     * @param {boolean} hasTreeView - Whether dropdown has tree view
     */
    setSingleSelection: function (dropdownContainer, targetId, hasTreeView) {
        if (!targetId) return;

        // Clear all existing selections
        const allOptions = CustomControl.getAllByName(dropdownContainer, 'ddl-option');
        allOptions.forEach(option => {
            CustomControl.nameListRemove(option, 'ddl-selected');
        });

        // Try to find target element by ID
        let targetElement = null;

        // First try parent elements
        const parentElements = dropdownContainer.querySelectorAll(`[name*="ddl-parent-label"][data-id="${targetId}"]`);
        if (parentElements.length > 0) {
            targetElement = Array.from(parentElements).find(el => 
                CustomControl.nameListContains(el, 'ddl-option')
            );
        }

        // If not found in parents, try children
        if (!targetElement) {
            const childElements = dropdownContainer.querySelectorAll(`[name*="ddl-child"][data-id="${targetId}"]`);
            if (childElements.length > 0) {
                targetElement = Array.from(childElements).find(el => 
                    CustomControl.nameListContains(el, 'ddl-option')
                );
            }
        }

        // Set selection if target found
        if (targetElement) {
            CustomControl.nameListAdd(targetElement, 'ddl-selected');
        } else {
            console.warn(`[CustomControl] Could not find selectable element with ID '${targetId}' in single-select dropdown`);
        }
    },

    /**
     ** Extract data structure from DOM elements.
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
            // Check if multiSelect mode (has ddl-label-text span) or single select mode (direct text)
            const parentTextSpan = CustomControl.getByName(parentLabel, 'ddl-label-text');
            const parentName = parentTextSpan ? parentTextSpan.textContent.trim() : parentLabel.textContent.trim();

            const parent = {
                id: parentId,
                name: parentName,
                children: []
            };

            const childElements = CustomControl.getAllByName(parentElement, 'ddl-child');
            childElements.forEach(childElement => {
                const childId = childElement.dataset.id;
                // Check if multiSelect mode (has ddl-label-text span) or single select mode (direct text)
                const childTextSpan = CustomControl.getByName(childElement, 'ddl-label-text');
                const childName = childTextSpan ? childTextSpan.textContent.trim() : childElement.textContent.trim();

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
     ** Get selected data for tree view multi-select dropdowns.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {Array} data - Hierarchical data for this dropdown
     * @returns {Array} Array of selected parent objects with their selected children
     */
    getTreeViewSelectedData: function (dropdownContainer, data) {
        const selectedData = [];

        data.forEach(parent => {
            const parentCheckbox = dropdownContainer.querySelector(`[name*="parent-checkbox"][data-parent-id="${parent.id}"]`);
            const childCheckboxes = dropdownContainer.querySelectorAll(`[name*="child-checkbox"][data-parent-id="${parent.id}"]`);
            
            const checkedChildren = Array.from(childCheckboxes).filter(cb => cb.checked);
            const hasChildren = parent.children && parent.children.length > 0;

            if (parentCheckbox && parentCheckbox.checked) {
                // Parent is checked
                const parentData = {
                    id: parent.id,
                    name: parent.name,
                    children: []
                };

                if (hasChildren && checkedChildren.length > 0) {
                    // Add selected children
                    checkedChildren.forEach(cb => {
                        const childId = cb.dataset.childId;
                        const child = parent.children.find(c => c.id == childId);
                        if (child) {
                            parentData.children.push({
                                id: child.id,
                                name: child.name
                            });
                        }
                    });
                }

                selectedData.push(parentData);
            } else if (checkedChildren.length > 0) {
                // Parent not checked, but some children are checked
                const parentData = {
                    id: parent.id,
                    name: parent.name,
                    children: []
                };

                checkedChildren.forEach(cb => {
                    const childId = cb.dataset.childId;
                    const child = parent.children.find(c => c.id == childId);
                    if (child) {
                        parentData.children.push({
                            id: child.id,
                            name: child.name
                        });
                    }
                });

                selectedData.push(parentData);
            }
        });

        return selectedData;
    },

    /**
     ** Get selected data for flat multi-select dropdowns.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {Array} data - Hierarchical data for this dropdown
     * @returns {Array} Array of selected parent objects
     */
    getFlatSelectedData: function (dropdownContainer, data) {
        const selectedData = [];
        const parentCheckboxes = dropdownContainer.querySelectorAll('[name*="parent-checkbox"]:checked');
        
        parentCheckboxes.forEach(checkbox => {
            const parentId = checkbox.dataset.parentId;
            const parent = data.find(p => p.id == parentId);
            if (parent) {
                selectedData.push({
                    id: parent.id,
                    name: parent.name
                });
            }
        });

        return selectedData;
    },

    /**
     ** Get selected data for single selection dropdowns.
     * @param {HTMLElement} dropdownContainer - Dropdown container element
     * @param {Array} data - Hierarchical data for this dropdown
     * @returns {Object|null} Selected item object or null if nothing selected
     */
    getSingleSelectedData: function (dropdownContainer, data) {
        // For single selection, find selected option (using ddl-selected class)
        const allOptions = CustomControl.getAllByName(dropdownContainer, 'ddl-option');
        const selectedOption = allOptions.find(option => 
            CustomControl.nameListContains(option, 'ddl-selected')
        );
        
        if (selectedOption) {
            if (CustomControl.nameListContains(selectedOption, 'ddl-parent-label')) {
                // Selected parent option - extract name directly from DOM
                const parentId = selectedOption.dataset.id;
                const parentTextSpan = CustomControl.getByName(selectedOption, 'ddl-label-text');
                const parentName = parentTextSpan ? parentTextSpan.textContent.trim() : selectedOption.textContent.trim();
                
                return {
                    id: parentId,
                    name: parentName,
                    type: 'parent'
                };
            } else if (CustomControl.nameListContains(selectedOption, 'ddl-child')) {
                // Selected child option - extract names directly from DOM
                const childId = selectedOption.dataset.id;
                const parentId = selectedOption.dataset.parentId;
                const childTextSpan = CustomControl.getByName(selectedOption, 'ddl-label-text');
                const childName = childTextSpan ? childTextSpan.textContent.trim() : selectedOption.textContent.trim();
                
                // Get parent name from DOM
                const parentElement = dropdownContainer.querySelector(`[name*="ddl-parent-label"][data-id="${parentId}"]`);
                let parentName = "";
                if (parentElement) {
                    const parentTextSpan = CustomControl.getByName(parentElement, 'ddl-label-text');
                    parentName = parentTextSpan ? parentTextSpan.textContent.trim() : parentElement.textContent.trim();
                }
                
                return {
                    id: childId,
                    name: childName,
                    type: 'child',
                    parent: {
                        id: parentId,
                        name: parentName
                    }
                };
            }
        }

        return null;
    },

    /**
     ** Extract container ID from a DOM element (checkbox, etc.).
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
     ** Update visual highlighting for checkbox selections in multi-select mode.
     * @param {HTMLElement} element - The parent label or child element to highlight
     * @param {boolean} isChecked - Whether the checkbox is checked
     */
    updateCheckboxHighlight: function(element, isChecked) {
        if (isChecked) {
            CustomControl.nameListAdd(element, 'ddl-checked');
        } else {
            CustomControl.nameListRemove(element, 'ddl-checked');
        }
    },

    /**
     ** Clear all selections (works for both single and multi-select modes).
     * @param {string} containerId - Container ID for this dropdown instance
     */
    clearAllSelections: function(containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // Check if this is multi-select mode (has checkboxes in this specific dropdown)
        const checkboxes = CustomControl.getAllByName(dropdownContainer, 'ddl-checkbox');
        const hasCheckboxes = checkboxes.length > 0;

        if (hasCheckboxes) {
            // Multi-select mode: clear all checkboxes
            CustomControl.toggleAllSelections(containerId, false);
        } else {
            // Single-select mode: clear selected options
            const allOptions = CustomControl.getAllByName(dropdownContainer, 'ddl-option');
            
            allOptions.forEach(option => {
                CustomControl.nameListRemove(option, 'ddl-selected');
            });
            
            // Update dropdown header to show placeholder
            const header = CustomControl.getByName(dropdownContainer, 'ddl-header');
            if (header && header.dataset.placeholder) {
                header.innerText = header.dataset.placeholder;
                CustomControl.nameListRemove(header, 'has-selections');
            }
        }
    },

    /**
     ** Handle parent checkbox change - check/uncheck all children.
     * @param {HTMLInputElement} parentCheckbox - Parent checkbox element
     * @param {string} parentId - Parent ID
     */
    handleParentCheckboxChange: function (parentCheckbox, parentId) {
        const isChecked = parentCheckbox.checked;
        
        // Extract container ID from checkbox element to ensure correct dropdown instance
        const containerId = CustomControl.extractContainerIdFromElement(parentCheckbox);
        if (!containerId) return;
        
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;
        
        // Check if there's an active search
        const searchBox = CustomControl.getByName(dropdownContainer, 'ddl-search');
        const hasActiveSearch = searchBox && searchBox.value.trim() !== '';
        
        const allChildCheckboxes = dropdownContainer.querySelectorAll(
            `[name*="child-checkbox"][data-parent-id="${parentId}"]`
        );
        
        let childrenToUpdate;
        
        if (hasActiveSearch) {
            // During search: Only update VISIBLE children
            childrenToUpdate = Array.from(allChildCheckboxes).filter(cb => {
                const childElement = cb.closest('[name~="ddl-child"]');
                return childElement && !CustomControl.nameListContains(childElement, 'ddl-hidden');
            });
        } else {
            // No search: Update ALL children (normal behavior)
            childrenToUpdate = Array.from(allChildCheckboxes);
        }
        
        // Set selected children to same state as parent
        childrenToUpdate.forEach(childCheckbox => {
            childCheckbox.checked = isChecked;
            // Update highlighting for child elements
            const childElement = childCheckbox.closest('[name~="ddl-child"]');
            if (childElement) {
                CustomControl.updateCheckboxHighlight(childElement, isChecked);
            }
        });
        
        // Update highlighting for parent element
        const parentElement = parentCheckbox.closest('[name~="ddl-parent-label"]');
        if (parentElement) {
            CustomControl.updateCheckboxHighlight(parentElement, isChecked);
        }
        
        console.log(`[CustomControl] Parent ${parentId} ${isChecked ? 'checked' : 'unchecked'}, updated ${childrenToUpdate.length}${hasActiveSearch ? ' visible' : ''} children out of ${allChildCheckboxes.length} total`);
        
        // Update dropdown header for this specific dropdown
        CustomControl.updateDropdownHeader(containerId);
    },

    /**
     ** Handle child checkbox change - update parent state accordingly.
     * @param {HTMLInputElement} childCheckbox - Child checkbox element
     * @param {string} parentId - Parent ID
     */
    handleChildCheckboxChange: function (childCheckbox, parentId) {
        // Extract container ID from checkbox element to ensure correct dropdown instance
        const containerId = CustomControl.extractContainerIdFromElement(childCheckbox);
        if (!containerId) return;
        
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;
        
        const parentCheckbox = dropdownContainer.querySelector(
            `[name*="parent-checkbox"][data-parent-id="${parentId}"]`
        );
        
        if (!parentCheckbox) return;
        
        // Check if there's an active search
        const searchBox = CustomControl.getByName(dropdownContainer, 'ddl-search');
        const hasActiveSearch = searchBox && searchBox.value.trim() !== '';
        
        if (hasActiveSearch) {
            // During search: Only consider visible children for parent state
            const childCheckboxes = Array.from(dropdownContainer.querySelectorAll(
                `[name*="child-checkbox"][data-parent-id="${parentId}"]`
            ));
            
            // Get only VISIBLE child checkboxes
            const visibleChildCheckboxes = childCheckboxes.filter(cb => {
                const childElement = cb.closest('[name~="ddl-child"]');
                return childElement && !CustomControl.nameListContains(childElement, 'ddl-hidden');
            });
            
            if (visibleChildCheckboxes.length > 0) {
                const visibleCheckedChildren = visibleChildCheckboxes.filter(cb => cb.checked);
                const totalVisibleChildren = visibleChildCheckboxes.length;
                
                if (visibleCheckedChildren.length === 0) {
                    // No visible children checked - check if ANY children are checked
                    const anyChildrenChecked = childCheckboxes.some(cb => cb.checked);
                    if (!anyChildrenChecked) {
                        parentCheckbox.checked = false;
                        parentCheckbox.indeterminate = false;
                    }
                } else if (visibleCheckedChildren.length === totalVisibleChildren) {
                    // All visible children checked - check parent
                    parentCheckbox.checked = true;
                    parentCheckbox.indeterminate = false;
                } else {
                    // Some visible children checked - set parent to indeterminate
                    parentCheckbox.checked = false;
                    parentCheckbox.indeterminate = true;
                }
            }
        } else {
            // No active search: Use normal logic - consider ALL children
            const childCheckboxes = dropdownContainer.querySelectorAll(
                `[name*="child-checkbox"][data-parent-id="${parentId}"]`
            );
            
            const checkedChildren = Array.from(childCheckboxes).filter(cb => cb.checked);
            const totalChildren = childCheckboxes.length;
            
            if (checkedChildren.length === 0) {
                // No children checked - uncheck parent
                parentCheckbox.checked = false;
                parentCheckbox.indeterminate = false;
            } else if (checkedChildren.length === totalChildren) {
                // All children checked - check parent (no indeterminate)
                parentCheckbox.checked = true;
                parentCheckbox.indeterminate = false;
            } else {
                // Some children checked - uncheck parent but set indeterminate
                parentCheckbox.checked = false;
                parentCheckbox.indeterminate = true;
            }
        }
        
        // Update highlighting for the changed child element
        const childElement = childCheckbox.closest('[name~="ddl-child"]');
        if (childElement) {
            CustomControl.updateCheckboxHighlight(childElement, childCheckbox.checked);
        }
        
        // Update highlighting for parent element
        const parentElement = parentCheckbox.closest('[name~="ddl-parent-label"]');
        if (parentElement) {
            CustomControl.updateCheckboxHighlight(parentElement, parentCheckbox.checked || parentCheckbox.indeterminate);
        }
        
        // Log current state for debugging
        const allChildCheckboxes = Array.from(dropdownContainer.querySelectorAll(
            `[name*="child-checkbox"][data-parent-id="${parentId}"]`
        ));
        const allCheckedChildren = allChildCheckboxes.filter(cb => cb.checked);
        console.log(`[CustomControl] Parent ${parentId}: ${allCheckedChildren.length}/${allChildCheckboxes.length} children checked`);
        
        // Update dropdown header for this specific dropdown
        CustomControl.updateDropdownHeader(containerId);
    },

    /**
     ** Recalculate parent checkbox states based on visible children during search.
     * @param {string} containerId - Container ID for this dropdown instance
     */
    recalculateParentStatesForSearch: function(containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // Only process if this dropdown has checkboxes (multiSelect enabled)
        const hasCheckboxes = CustomControl.getAllByName(dropdownContainer, 'ddl-checkbox').length > 0;
        if (!hasCheckboxes) return;

        const parentElements = CustomControl.getAllByName(dropdownContainer, 'ddl-parent');
        
        parentElements.forEach(parentElement => {
            const parentLabel = CustomControl.getByName(parentElement, 'ddl-parent-label');
            if (!parentLabel) return;

            const parentId = parentLabel.dataset.id;
            const parentCheckbox = dropdownContainer.querySelector(
                `[name*="parent-checkbox"][data-parent-id="${parentId}"]`
            );
            if (!parentCheckbox) return;

            // Get all child checkboxes for this parent
            const childCheckboxes = Array.from(dropdownContainer.querySelectorAll(
                `[name*="child-checkbox"][data-parent-id="${parentId}"]`
            ));
            
            // Get only VISIBLE child checkboxes
            const visibleChildCheckboxes = childCheckboxes.filter(cb => {
                const childElement = cb.closest('[name~="ddl-child"]');
                return childElement && !CustomControl.nameListContains(childElement, 'ddl-hidden');
            });
            
            if (visibleChildCheckboxes.length === 0) {
                // No visible children - maintain current parent state (don't change it)
                return;
            }

            const visibleCheckedChildren = visibleChildCheckboxes.filter(cb => cb.checked);
            const totalVisibleChildren = visibleChildCheckboxes.length;
            
            if (visibleCheckedChildren.length === 0) {
                // No visible children checked - uncheck parent only if NO children are checked at all
                const allChildrenChecked = childCheckboxes.filter(cb => cb.checked);
                if (allChildrenChecked.length === 0) {
                    parentCheckbox.checked = false;
                    parentCheckbox.indeterminate = false;
                    // Update parent highlighting
                    CustomControl.updateCheckboxHighlight(parentLabel, false);
                }
            } else if (visibleCheckedChildren.length === totalVisibleChildren) {
                // All visible children checked - check parent
                parentCheckbox.checked = true;
                parentCheckbox.indeterminate = false;
                // Update parent highlighting
                CustomControl.updateCheckboxHighlight(parentLabel, true);
            } else {
                // Some visible children checked - set parent to indeterminate
                parentCheckbox.checked = false;
                parentCheckbox.indeterminate = true;
                // Update parent highlighting based on whether any children are checked
                const anyChildrenChecked = childCheckboxes.some(cb => cb.checked);
                CustomControl.updateCheckboxHighlight(parentLabel, anyChildrenChecked);
            }
        });
    },

    /**
     ** Recalculate parent checkbox states based on ALL children (used when search is cleared).
     * @param {string} containerId - Container ID for this dropdown instance
     */
    recalculateParentStatesForAllChildren: function(containerId) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // Only process if this dropdown has checkboxes (multiSelect enabled)
        const hasCheckboxes = CustomControl.getAllByName(dropdownContainer, 'ddl-checkbox').length > 0;
        if (!hasCheckboxes) return;

        const parentElements = CustomControl.getAllByName(dropdownContainer, 'ddl-parent');
        
        parentElements.forEach(parentElement => {
            const parentLabel = CustomControl.getByName(parentElement, 'ddl-parent-label');
            if (!parentLabel) return;

            const parentId = parentLabel.dataset.id;
            const parentCheckbox = dropdownContainer.querySelector(
                `[name*="parent-checkbox"][data-parent-id="${parentId}"]`
            );
            if (!parentCheckbox) return;

            // Get ALL child checkboxes for this parent (regardless of visibility)
            const childCheckboxes = Array.from(dropdownContainer.querySelectorAll(
                `[name*="child-checkbox"][data-parent-id="${parentId}"]`
            ));
            
            if (childCheckboxes.length === 0) return;

            const checkedChildren = childCheckboxes.filter(cb => cb.checked);
            const totalChildren = childCheckboxes.length;
            
            if (checkedChildren.length === 0) {
                // No children checked - uncheck parent
                parentCheckbox.checked = false;
                parentCheckbox.indeterminate = false;
                CustomControl.updateCheckboxHighlight(parentLabel, false);
            } else if (checkedChildren.length === totalChildren) {
                // All children checked - check parent
                parentCheckbox.checked = true;
                parentCheckbox.indeterminate = false;
                CustomControl.updateCheckboxHighlight(parentLabel, true);
            } else {
                // Some children checked - set parent to indeterminate
                parentCheckbox.checked = false;
                parentCheckbox.indeterminate = true;
                CustomControl.updateCheckboxHighlight(parentLabel, true);
            }
        });
    },


    /**
     ** Universal method to toggle all selections (replaces duplicate Select All / Clear All logic).
     * @param {string} containerId - Container ID for this dropdown instance
     * @param {boolean} shouldSelect - True to select all, false to clear all
     * @param {boolean} respectSearch - Whether to respect active search filter (default: true)
     * @param {boolean} hasTreeView - Whether dropdown has tree view (auto-detected if not provided)
     */
    toggleAllSelections: function (containerId, shouldSelect, respectSearch = true, hasTreeView = null) {
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // Auto-detect search state
        const searchBox = CustomControl.getByName(dropdownContainer, 'ddl-search');
        const hasActiveSearch = respectSearch && searchBox && searchBox.value.trim() !== '';
        
        // Auto-detect tree view if not provided
        if (hasTreeView === null) {
            hasTreeView = CustomControl.getByName(dropdownContainer, 'ddl-children') !== null;
        }

        if (hasTreeView) {
            // Tree view: handle parent and child checkboxes
            const parentCheckboxes = CustomControl.getAllByName(dropdownContainer, 'parent-checkbox');
            const childCheckboxes = CustomControl.getAllByName(dropdownContainer, 'child-checkbox');
            
            let checkboxesToProcess;
            
            if (hasActiveSearch) {
                // During search: Only process visible checkboxes
                const visibleParentCheckboxes = parentCheckboxes.filter(cb => {
                    const parentElement = cb.closest('[name~="ddl-parent"]');
                    return parentElement && !CustomControl.nameListContains(parentElement, 'ddl-hidden');
                });
                
                const visibleChildCheckboxes = childCheckboxes.filter(cb => {
                    const childElement = cb.closest('[name~="ddl-child"]');
                    return childElement && !CustomControl.nameListContains(childElement, 'ddl-hidden');
                });
                
                checkboxesToProcess = [...visibleParentCheckboxes, ...visibleChildCheckboxes];
            } else {
                // No search: Process all checkboxes
                checkboxesToProcess = [...parentCheckboxes, ...childCheckboxes];
            }
            
            checkboxesToProcess.forEach(checkbox => {
                const needsUpdate = shouldSelect ? !checkbox.checked : (checkbox.checked || checkbox.indeterminate);
                
                if (needsUpdate) {
                    checkbox.checked = shouldSelect;
                    if (!shouldSelect) {
                        checkbox.indeterminate = false;
                    }
                    // Trigger change event to update parent-child relationships
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        } else {
            // Flat view: handle parent checkboxes only
            const parentCheckboxes = CustomControl.getAllByName(dropdownContainer, 'parent-checkbox');
            
            let checkboxesToProcess;
            
            if (hasActiveSearch) {
                // During search: Only process visible parent checkboxes
                checkboxesToProcess = parentCheckboxes.filter(cb => {
                    const parentElement = cb.closest('[name~="ddl-parent"]');
                    return parentElement && !CustomControl.nameListContains(parentElement, 'ddl-hidden');
                });
            } else {
                // No search: Process all parent checkboxes
                checkboxesToProcess = parentCheckboxes;
            }
            
            checkboxesToProcess.forEach(checkbox => {
                const needsUpdate = shouldSelect ? !checkbox.checked : checkbox.checked;
                
                if (needsUpdate) {
                    checkbox.checked = shouldSelect;
                    if (!shouldSelect) {
                        checkbox.indeterminate = false;
                    }
                    
                    // Update highlighting for parent element
                    const parentElement = checkbox.closest('[name~="ddl-parent-label"]');
                    if (parentElement) {
                        CustomControl.updateCheckboxHighlight(parentElement, shouldSelect);
                    }
                }
            });
        }

        // Update dropdown header
        CustomControl.updateDropdownHeader(containerId);
        
        const action = shouldSelect ? 'Select All' : 'Clear All';
        const scope = hasActiveSearch ? 'visible items only' : 'all items';
        console.log(`[CustomControl] ${action} executed for ${containerId} - ${scope}`);
    },

    /**
     ** Handle search functionality - filter options based on search term.
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
                CustomControl.nameListRemove(parentElement, 'ddl-hidden');
                CustomControl.nameListAdd(parentElement, 'ddl-visible');
                // Show all children if tree view
                if (hasTreeView) {
                    const childrenContainer = CustomControl.getByName(parentElement, 'ddl-children');
                    if (childrenContainer) {
                        const childElements = CustomControl.getAllByName(childrenContainer, 'ddl-child');
                        childElements.forEach(child => {
                            CustomControl.nameListRemove(child, 'ddl-hidden');
                            CustomControl.nameListAdd(child, 'ddl-visible');
                        });
                    }
                }
            });
            
            // Hide no results message
            CustomControl.handleNoSearchResults(optionsContainer, false);
            
            // Recalculate parent states based on ALL children when search is cleared
            CustomControl.recalculateParentStatesForAllChildren(containerId);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        let visibleParentsCount = 0;

        parentElements.forEach(parentElement => {
            const parentLabel = CustomControl.getByName(parentElement, 'ddl-parent-label'); //* 'ddl-parent-label' will have the parent name in case there was no checkboxes (multiSelect is false)
            if (!parentLabel) return;

            // Get parent name (handle both checkbox and plain text scenarios)
            let parentName = '';
            const parentTextSpan = CustomControl.getByName(parentLabel, 'ddl-label-text'); //* 'ddl-label-text' will have the parent name in case there was checkboxes (multiSelect is true)
            if (parentTextSpan) {
                parentName = parentTextSpan.innerText.toLowerCase(); //* if it's checkbox, it will have the parent name in the 'ddl-label-text'
            } else {
                parentName = parentLabel.innerText.toLowerCase(); //* if it's not checkbox, it will have the parent name in the 'ddl-parent-label'
            }

            let showParent = false;

            // Check if parent matches search term
            const parentMatches = parentName.includes(searchLower);

            if (hasTreeView) {
                // Tree view: search in both parents and children
                const childrenContainer = CustomControl.getByName(parentElement, 'ddl-children');
                let hasMatchingChild = false;

                if (childrenContainer) {
                    const childElements = CustomControl.getAllByName(childrenContainer, 'ddl-child'); //* 'ddl-child' will have the child name in case there was no checkboxes (multiSelect is false)
                    childElements.forEach(childElement => {
                        // Get child name (handle both checkbox and plain text scenarios)
                        let childName = '';
                        const childTextSpan = CustomControl.getByName(childElement, 'ddl-label-text'); //* 'ddl-label-text' will have the child name in case there was checkboxes (multiSelect is true)
                        if (childTextSpan) {
                            childName = childTextSpan.innerText.toLowerCase(); //* if it's checkbox, it will have the child name in the 'ddl-label-text'
                        } else {
                            childName = childElement.innerText.toLowerCase(); //* if it's not checkbox, it will have the child name in the 'ddl-child'
                        }

                        const childMatches = childName.includes(searchLower);

                        if (childMatches) {
                            CustomControl.nameListRemove(childElement, 'ddl-hidden');
                            CustomControl.nameListAdd(childElement, 'ddl-visible');
                            hasMatchingChild = true;
                        } else {
                            CustomControl.nameListAdd(childElement, 'ddl-hidden');
                            CustomControl.nameListRemove(childElement, 'ddl-visible');
                        }
                    });
                }

                // Show parent if parent matches OR if any child matches
                showParent = parentMatches || hasMatchingChild;

                // If parent matches, show all children
                if (parentMatches && childrenContainer) {
                    const childElements = CustomControl.getAllByName(childrenContainer, 'ddl-child');
                    childElements.forEach(child => {
                        CustomControl.nameListRemove(child, 'ddl-hidden');
                        CustomControl.nameListAdd(child, 'ddl-visible');
                    });
                }
            } else {
                // Flat view: search in parents only (when there is no tree view)
                showParent = parentMatches;
            }

            // Show or hide the entire parent element
            if (showParent) {
                CustomControl.nameListRemove(parentElement, 'ddl-hidden');
                CustomControl.nameListAdd(parentElement, 'ddl-visible');
            } else {
                CustomControl.nameListAdd(parentElement, 'ddl-hidden');
                CustomControl.nameListRemove(parentElement, 'ddl-visible');
            }
            
            // Count visible parents
            if (showParent) {
                visibleParentsCount++;
            }
        });

        // Show or hide no results message based on visible count
        const hasNoResults = visibleParentsCount === 0;
        CustomControl.handleNoSearchResults(optionsContainer, hasNoResults);

        // Recalculate parent states based on visible children during search
        CustomControl.recalculateParentStatesForSearch(containerId);

        console.log(`[CustomControl] Search executed for "${searchTerm}" in ${containerId}`);
    },

    /**
     ** Add checkbox event listeners to parent and child checkboxes.
     * @param {HTMLElement} optionsContainer - Options container element
     */
    addCheckboxEventListeners: function (optionsContainer) {
        // Parent checkbox event listeners
        const parentCheckboxes = CustomControl.getAllByName(optionsContainer, 'parent-checkbox');
        parentCheckboxes.forEach(parentCheckbox => {
            parentCheckbox.addEventListener('change', function(e) {
                e.stopPropagation(); // Prevent interference with other events
                const parentId = e.currentTarget.dataset.parentId;
                CustomControl.handleParentCheckboxChange(e.currentTarget, parentId);
            });
            
            // Also prevent click from bubbling
            parentCheckbox.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        // Child checkbox event listeners
        const childCheckboxes = CustomControl.getAllByName(optionsContainer, 'child-checkbox');

        childCheckboxes.forEach(childCheckbox => {
            childCheckbox.addEventListener('change', function(e) {
                e.stopPropagation(); // Prevent interference with other events
                const parentId = e.currentTarget.dataset.parentId;
        
                CustomControl.handleChildCheckboxChange(e.currentTarget, parentId);
            });
            
            // Also prevent click from bubbling
            childCheckbox.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });


    },

    /**
     ** Add event listeners for dropdown functionality.
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
     ** Toggle dropdown open/close state.
     * @param {HTMLElement} ddlWrapper - Dropdown wrapper element
     * @param {HTMLElement} optionsContainer - Options container element
     */
    /**
     ** Close all other dropdowns except the current one.
     * @param {HTMLElement} currentWrapper - Current dropdown wrapper to keep open
     */
    closeAllOtherDropdowns: function (currentWrapper) {
        const allDropdowns = CustomControl.getAllByName(document, 'custom-ddl');
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
            // Close all other dropdowns before opening this one
            CustomControl.closeAllOtherDropdowns(ddlWrapper);
            CustomControl.openDropdown(ddlWrapper, optionsContainer);
        } else {
            CustomControl.closeDropdown(ddlWrapper, optionsContainer);
        }
    },

    /**
     ** Scroll to the selected option in the dropdown.
     * @param {HTMLElement} optionsContainer - Options container element
     * @param {HTMLElement} ddlWrapper - Dropdown wrapper element
     */
    scrollToSelectedOption: function(optionsContainer, ddlWrapper) {
        // Get container ID from wrapper
        const containerId = ddlWrapper.id.replace('_ddl', '');
        const dropdownContainer = document.getElementById(`${containerId}_ddl`);
        if (!dropdownContainer) return;

        // Check if this is multi-select or single-select
        const checkboxes = CustomControl.getAllByName(dropdownContainer, 'ddl-checkbox');
        const hasCheckboxes = checkboxes.length > 0;

        let selectedElement = null;

        if (hasCheckboxes) {
            // Multi-select: find first checked checkbox and its parent element
            const checkedCheckbox = checkboxes.find(checkbox => checkbox.checked);
            if (checkedCheckbox) {
                // Find the parent option element (either ddl-parent-label or ddl-child)
                selectedElement = checkedCheckbox.closest('[name~="ddl-parent-label"], [name~="ddl-child"]');
            }
        } else {
            // Single-select: find element with ddl-selected
            const allOptions = CustomControl.getAllByName(dropdownContainer, 'ddl-option');
            selectedElement = allOptions.find(option => 
                CustomControl.nameListContains(option, 'ddl-selected')
            );
        }

        // Scroll to the selected element if found
        if (selectedElement) {
            // Use setTimeout to ensure the dropdown is fully opened before scrolling
            setTimeout(() => {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }, 50);
        }
    },

    /**
     ** Open the dropdown.
     * @param {HTMLElement} ddlWrapper - Dropdown wrapper element
     * @param {HTMLElement} optionsContainer - Options container element
     */
    openDropdown: function (ddlWrapper, optionsContainer) {
        CustomControl.nameListRemove(optionsContainer, 'hidden');
        CustomControl.nameListAdd(ddlWrapper, 'open');
        
        // Update navigation icon visibility when dropdown opens
        const containerId = ddlWrapper.id.replace('_ddl', '');
        CustomControl.updateMultiNavIconVisibility(containerId);
        
        // Scroll to selected option after opening
        CustomControl.scrollToSelectedOption(optionsContainer, ddlWrapper);
    },

    /**
     ** Close the dropdown.
     * @param {HTMLElement} ddlWrapper - Dropdown wrapper element
     * @param {HTMLElement} optionsContainer - Options container element
     */
    closeDropdown: function (ddlWrapper, optionsContainer) {
        CustomControl.nameListAdd(optionsContainer, 'hidden');
        CustomControl.nameListRemove(ddlWrapper, 'open');
        
        // Hide navigation icon when dropdown closes
        const containerId = ddlWrapper.id.replace('_ddl', '');
        CustomControl.updateMultiNavIconVisibility(containerId);
    },

    /**
     ** Render base container (label + ddl header + placeholder).
     * @param {HTMLElement} container - Target container
     */
    renderBase: function (container, settings) {
        // Clear container (but preserve any existing labels in HTML)
        CustomControl.clearContainer(container);

        // Create dropdown components
        const ddlWrapper = CustomControl.createDropdownWrapper(settings.containerId);
        const header = CustomControl.createHeader(settings.placeholder);
        const optionsContainer = CustomControl.createOptionsContainer();

        // Populate options container with buttons and search box
        const { hasMultiSelect, hasSelectAllBtn, hasClearAllBtn, hasSearch } = settings.flags;
        CustomControl.populateOptionsContainer(optionsContainer, hasMultiSelect, hasSelectAllBtn, hasClearAllBtn, hasSearch, settings.containerId);

        // Render JSON options into dropdown
        CustomControl.renderOptions(settings.data, optionsContainer, hasMultiSelect, settings.flags.hasTreeView, hasClearAllBtn, settings.placeholder, settings.containerId);

        // Add multi-select navigation icon if multi-select is enabled
        if (hasMultiSelect) {
            const navIcon = CustomControl.createMultiNavIcon(settings.containerId);
            optionsContainer.appendChild(navIcon);
        }

        // Assemble dropdown structure
        ddlWrapper.appendChild(header);
        ddlWrapper.appendChild(optionsContainer);
        container.appendChild(ddlWrapper);

        // Add event listeners for interactivity
        CustomControl.addEventListeners(ddlWrapper, header, optionsContainer);

        // Add checkbox event listeners if multiSelect is enabled
        if (hasMultiSelect) {
            CustomControl.addCheckboxEventListeners(optionsContainer);
        }

        // Initialize dropdown header with current selections
        CustomControl.updateDropdownHeader(settings.containerId);
    }
};