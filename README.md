# Custom Dropdown Control

A powerful and customizable dropdown control library with hierarchical data support, multi-selection, search functionality, and Arabic/RTL support.

## Features

- 🔍 **Search Functionality** - Filter options with live search
- ✅ **Multi-Selection** - Select multiple options with checkboxes
- 🌳 **Tree View** - Expandable/collapsible parent-child structure
- 🎯 **Single Selection** - Traditional dropdown behavior
- 🔘 **Bulk Actions** - Select All / Clear All buttons

## Quick Start

### 1. Include Required Files

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="Template/css/styles.css">
</head>
<body>
    <div id="myDropdown"></div>
    
    <script src="Control/customControl.js"></script>
</body>
</html>
```

### 2. Prepare Your Data

```javascript
const data = [
    {
        "id": 1,
        "name": "منطقة الرياض",
        "children": [
            { "id": 101, "name": "الرياض" },
            { "id": 102, "name": "الدرعية" }
        ]
    },
    {
        "id": 2,
        "name": "منطقة مكة المكرمة",
        "children": [
            { "id": 201, "name": "مكة المكرمة" },
            { "id": 202, "name": "جدة" }
        ]
    }
];
```

### 3. Initialize the Control

```javascript
CustomControl.initialize({
    containerId: "myDropdown",
    placeholder: "اختر المنطقة...",
    label: "المناطق",
    data: data,
    flags: {
        search: { enabled: true },
        multiSelect: { enabled: false },
        treeView: { enabled: true }
    }
});
```

## API Reference

### CustomControl.initialize(params)

Main function to create and configure a dropdown control.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `containerId` | string | ✅ Yes | - | ID of the HTML container element where dropdown will be rendered |
| `placeholder` | string | ❌ No | `"اختر..."` | Placeholder text shown before selection |
| `label` | string | ❌ No | `"القائمة"` | Label text displayed above the dropdown |
| `data` | Array | ✅ Yes | `[]` | Hierarchical JSON data structure |
| `flags` | Object | ❌ No | `{}` | Feature configuration flags |

#### Data Structure

Each data item should follow this structure:

```javascript
{
    "id": 1,           // Unique identifier (string or number)
    "name": "Display Name",  // Text to show in dropdown
    "children": [      // Optional array of child items
        {
            "id": 101,
            "name": "Child Name"
        }
    ]
}
```

#### Flags Configuration

```javascript
{
    search: { 
        enabled: true/false      // Enable search functionality
    },
    multiSelect: { 
        enabled: true/false      // Enable multiple selection with checkboxes
    },
    treeView: { 
        enabled: true/false      // Enable hierarchical tree structure with expand/collapse
    },
    selectAllBtn: { 
        enabled: true/false      // Show "Select All" button (requires multiSelect)
    },
    clearAllBtn: { 
        enabled: true/false      // Show "Clear All" button (requires multiSelect)
    }
}
```

## Usage Examples

### Example 1: Basic Single Selection

```javascript
CustomControl.initialize({
    containerId: "dropdown1",
    placeholder: "اختر المنطقة...",
    label: "المناطق (اختيار واحد)",
    data: data,
    flags: {
        search: { enabled: false },
        multiSelect: { enabled: false },
        treeView: { enabled: false }
    }
});
```

### Example 2: Single Selection with Search

```javascript
CustomControl.initialize({
    containerId: "dropdown2",
    placeholder: "اختر المنطقة...",
    label: "المناطق (اختيار واحد - بحث)",
    data: data,
    flags: {
        search: { enabled: true },
        multiSelect: { enabled: false },
        treeView: { enabled: false }
    }
});
```

### Example 3: Tree View with Single Selection

```javascript
CustomControl.initialize({
    containerId: "dropdown3",
    placeholder: "اختر المدينة...",
    label: "المناطق والمدن (شجري - اختيار واحد)",
    data: data,
    flags: {
        search: { enabled: true },
        multiSelect: { enabled: false },
        treeView: { enabled: true }
    }
});
```

### Example 4: Multi-Selection with Bulk Actions

```javascript
CustomControl.initialize({
    containerId: "dropdown4",
    placeholder: "اختر المناطق...",
    label: "المناطق (اختيار متعدد - أزرار الكل)",
    data: data,
    flags: {
        search: { enabled: true },
        multiSelect: { enabled: true },
        treeView: { enabled: false },
        selectAllBtn: { enabled: true },
        clearAllBtn: { enabled: true }
    }
});
```

### Example 5: Full Featured Dropdown

```javascript
CustomControl.initialize({
    containerId: "dropdown5",
    placeholder: "اختر المدن...",
    label: "المناطق والمدن (جميع الميزات)",
    data: data,
    flags: {
        search: { enabled: true },
        multiSelect: { enabled: true },
        treeView: { enabled: true },
        selectAllBtn: { enabled: true },
        clearAllBtn: { enabled: true }
    }
});
```

## Behavior Notes

### Single Selection Mode
- **Without Tree View**: Parents only are selectable
- **With Tree View**: Only leaf nodes (children) or parents are selectable

### Multi-Selection Mode
- **Parent Selection**: Automatically selects/deselects all children
- **Child Selection**: Updates parent state (checked when any child selected)

## File Structure

```
Control/
├── customControl.js    # Main library file
Data/
├── data.json          # Sample hierarchical data
Template/
├── index.html         # Example implementation
├── css/
│   └── styles.css     # Styling
└── js/
    └── script.js      # Usage examples
```

## Error Handling

The control includes built-in error handling:

- **Missing Container**: Logs error if container element not found
- **Invalid Data**: Gracefully handles malformed data structures
- **Duplicate IDs**: Warns about duplicate IDs in console
- **Network Errors**: Handles failed data loading attempts

## Contributing

This project uses a name-based attribute system instead of classes for better flexibility and avoiding CSS conflicts. When adding new features.
