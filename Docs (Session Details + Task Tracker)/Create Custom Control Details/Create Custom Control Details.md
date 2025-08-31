# Session 2 (Create Custom Control) Details:

- **Tasks - Estimation Time - Progress:**
    
    [Create Control Task Tracker](https://www.notion.so/25b79482a7ac80589945da463f708160?pvs=21)
    
    - Important Guidelines:
        1. Avoid using the "this" keyword (Instead, refer to the current object by its name).
        2. Use getElementById/ByName instead of querySelector (reserve classes for UI developers' styling purposes).
        3. Only use addEventListener when necessary (such as for runtime JavaScript rendering).
        4. Avoid global variables.
        5. Use native CSS instead of Bootstrap.
        6. Disregard any coloring feature in the task tracker.

---

## **Relatable Info:**

- **What is Custom Control?**
    - Also called a "Package," a custom control is a reusable component that can be used repeatedly in common scenarios, such as:
        - Partial ViewsPartial Views
        - Tables/GridsTables/Grids
        - Drop Down List (DDL)Drop Down List (DDL)
        - Pop UpsPop Ups
        - Files Upload & File ViewFiles Upload & File View
    - We'll use literal objects to create these custom controls (since older JavaScript didn't have classes), treating the literal object as our class.
    - We'll create a method that initializes elements and renders them in an HTML container. The rendered content depends on:
    1- ContainerID,
    2- Data,
    3- Flags (optional parameters that determine whether additional elements appear in the control)
    - Why use this approach instead of server-side rendering with asp- prefix?
        - Server-side controls (like buttons) have their own lifecycle with at least 8 events, which consumes significant resources.
        - Client-side rendered custom controls improve performance (reducing TTFR — Time To First Response).
        - Custom controls work best when overriding .NET or database primitives.
        - Custom controls offer flexibility:Custom controls offer flexibility:
            - A single grid control can contain all needed properties and elements, with specific features enabled through initialization flags.
            - Controls can be extended by creating objects that inherit from them.
        - Custom controls typically reside in common/shared folders.
- **How To Implement Custom Control?**
    1. **First, define purpose and audience**: What am I implementing and for whom?
    2. **Study all use cases** thoroughly:
        - Business: What are the needs for this control?Business: What are the needs for this control?
        - Development: How will developers use this control?Development: How will developers use this control?
        - Consider functional aspects like performance, complexity, bottlenecks, and callback conditions/validations.
    3. **Plan and measure** each task and sub-task. Develop an ATOMIC implementation strategy. (Ensure all tasks are "SMART" — Specific, Measurable, Achievable, Relevant, Time-bound)
    4. **Apply generalization**: Make each object separate and independent. Avoid tight coupling.
    5. **Ensure uniqueness**: Create unique identifiers (IDs) for each element. Consider combining IDs with prefixes to prevent collisions.
    6. **Avoid global variables**: They can override existing variables and complicate problem tracking.
    7. **Create small, focused functions**: Follow Single Responsibility Principle. Keep logic contained within appropriate objects. For complex functions, document with comments and @param annotations.
    8. **Use functions for data retrieval**: Implement callbacks for data fetching and search functionality.
    9. **Maintain data within objects**: Each object should manage its own data, making it easily accessible via unique identifiers.

---

## **Side Info → (Teams - Tasks Board - etc..):**

meetings and tasks assignment info , to be entered later..