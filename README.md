
# The Unalterable Ledger

## Overview

The Unalterable Ledger is a read-only web application designed to display directives and their statuses. It operates within a Dominant/submissive dynamic, where tasks are assigned and tracked. The core principle is that **data cannot be modified through the web interface.** All changes to tasks, including creation, reporting compliance, and appraisal, are made by manually editing a `database.json` file stored in a Git repository.

The application is hosted on a static hosting service. Its UI is intentionally brutalist, monochrome, and clinical, emphasizing its role as a "view-only" ledger.

## Workflow

### 1. Viewing Directives

Simply open the web application in your browser. The application will fetch the latest directives from the `database.json` file in the repository and display them.
- **Pending Directives:** Tasks that are currently active and awaiting completion or reporting.
- **The Archives:** Tasks that are 'Completed' or 'Failed'.

A prominent digital clock is always displayed to maintain temporal awareness.

### 2. Adding a New Directive

To add a new task or directive:

1.  **Clone/Pull Repository:** Ensure you have the latest version of the Git repository containing the `database.json` file.
2.  **Edit `database.json`:** Open the `public/database.json` file in a text editor.
3.  **Add New Task Object:** Locate the `directives` array. Add a new JSON object for the task. Each task object must have the following structure:
    ```json
    {
      "id": "unique-task-identifier",
      "title": "Title of the Directive",
      "type": "Category/Type of Task (e.g., Service, Discipline, Study)",
      "assignedDate": "YYYY-MM-DDTHH:MM:SSZ", // ISO 8601 format (UTC)
      "dueDate": "YYYY-MM-DDTHH:MM:SSZ",     // ISO 8601 format (UTC)
      "status": "Pending", // Initially "Pending", "Completed", or "Failed"
      "userReport": null,  // Initially null, or text of the report
      "mistressAppraisal": null // Initially null, or text of the appraisal
    }
    ```
    **Important:** The `id` field **must be unique** for each directive.
4.  **Save Changes:** Save the `database.json` file.
5.  **Commit and Push:** Commit the changes to the Git repository and push them to the remote (e.g., GitHub, GitLab).

The web application will automatically reflect the new directive once the changes are deployed (if auto-deployment is configured) or on the next manual deployment/data refresh.

### 3. Reporting on a Task (User)

To report compliance or failure for a task:

1.  **Clone/Pull Repository:** Ensure you have the latest version of the repository.
2.  **Edit `database.json`:** Open `public/database.json`.
3.  **Find the Task:** Locate the specific task object within the `directives` array using its `id`.
4.  **Update Fields:**
    *   Modify the `status` field to `Completed` or `Failed`.
    *   Update the `userReport` field with your textual report. This can be a multi-line string if needed (use `\n` for newlines within the JSON string).
    ```json
    // Example of an updated task:
    {
      "id": "task-001",
      "title": "Morning Meditation Protocol",
      "type": "Discipline",
      "assignedDate": "2024-07-28T08:00:00Z",
      "dueDate": "2024-07-28T09:00:00Z",
      "status": "Completed", // Changed from "Pending"
      "userReport": "Meditation completed as instructed. Duration: 20 minutes. Focus maintained.", // Report added
      "mistressAppraisal": null // Remains null until appraised
    }
    ```
5.  **Save Changes:** Save `database.json`.
6.  **Commit and Push:** Commit and push your changes.

### 4. Appraising a Task (Mistress)

To appraise a user's report:

1.  **Clone/Pull Repository:** Ensure you have the latest version.
2.  **Edit `database.json`:** Open `public/database.json`.
3.  **Find the Task:** Locate the task object by `id`.
4.  **Update `mistressAppraisal`:** Add your appraisal text to the `mistressAppraisal` field.
    ```json
    // Example of an appraised task:
    {
      "id": "task-001",
      // ... other fields ...
      "status": "Completed",
      "userReport": "Meditation completed as instructed. Duration: 20 minutes. Focus maintained.",
      "mistressAppraisal": "Report acknowledged. Compliance is noted. Good focus." // Appraisal added
    }
    ```
5.  **Save Changes:** Save `database.json`.
6.  **Commit and Push:** Commit and push changes.

## JSON Structure for a Directive

Each directive in the `directives` array within `database.json` must follow this structure:

```json
{
  "id": "string",                // Unique identifier for the task (e.g., "task-001", "project-alpha-phase1")
  "title": "string",             // A concise title for the directive.
  "type": "string",              // Category or type of the directive (e.g., "Chore", "Study", "Service", "Personal Growth").
  "assignedDate": "string",      // ISO 8601 date-time string when the task was assigned (e.g., "2023-10-26T10:00:00Z").
  "dueDate": "string",           // ISO 8601 date-time string when the task is due (e.g., "2023-10-27T17:00:00Z").
  "status": "Pending" | "Completed" | "Failed", // Current status of the task.
  "userReport": "string" | null, // Text report from the user upon completion or failure. Null if no report yet.
  "mistressAppraisal": "string" | null // Text appraisal from the Mistress regarding the user's report/performance. Null if not yet appraised.
}
```

## Technology

*   React 18+ with TypeScript
*   Tailwind CSS for styling
*   Data stored in `public/database.json`
*   Hosted on a static web hosting service (e.g., Netlify, Vercel, GitHub Pages).

## Philosophy

This application enforces discipline and explicitness in data management. By requiring manual Git operations for all changes, it underscores the deliberation and permanence associated with each entry in the ledger. The interface is merely a window, not a workspace.
