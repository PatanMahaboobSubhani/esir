# EISR Portal - Editorial Workflow Demonstration Flow

This diagram illustrates the step-by-step process of a manuscript's journey through the EISR Academic Publishing Portal, from initial submission by the Author to final evaluation by the Reviewer.

```mermaid
sequenceDiagram
    participant A as 👨‍🔬 Author
    participant S as 💻 EISR Portal
    participant E as 🕵️ Editor
    participant R as 🔍 Reviewer

    %% Author Submission Phase
    Note over A, S: Phase 1: Manuscript Submission
    A->>S: Logs in / Registers
    A->>S: Completes 5-Step Submission Wizard
    S-->>A: Shows "Submission Successful" Screen
    S-->>A: Sends Confirmation Email (SMTP)
    
    %% Editor Assignment Phase
    Note over S, E: Phase 2: Editorial Review & Assignment
    E->>S: Logs into Editorial Dashboard
    S-->>E: Displays New Submissions List
    E->>S: Opens Manuscript Details
    E->>S: Assigns New Reviewer (Enters Email)
    
    %% System Automations
    Note over S, R: Phase 3: System Automations
    S->>S: Auto-creates secure User Account (bcrypt)
    S->>S: Generates JWT Token for secure links
    S-->>R: Sends Formal Invitation Email

    %% Reviewer Evaluation Phase
    Note over R, S: Phase 4: Peer Review Evaluation
    R->>R: Opens Email & Reads Invitation
    R->>S: Clicks Secure [Accept Review] Link
    S->>S: Updates Assignment Status -> "Accepted"
    R->>S: Logs in with Reviewer Credentials
    R->>S: Opens Assigned Manuscript
    R->>S: Completes 4-Step Review Form
    R->>S: Submits Rating & Recommendation
    
    %% Loop Closure
    Note over S, E: Phase 5: Loop Closure
    S->>S: Updates Assignment Status -> "Completed"
    S-->>E: Editor Dashboard shows Review Data
```

## Detailed Flowchart

```mermaid
graph TD
    %% Styling
    classDef author fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef editor fill:#f3e8ff,stroke:#9333ea,stroke-width:2px;
    classDef reviewer fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    classDef system fill:#f1f5f9,stroke:#64748b,stroke-width:2px,stroke-dasharray: 5 5;

    %% Nodes
    A[Author Logs In]:::author --> B[Completes 5-Step Form]:::author
    B --> C[Confirmation Email Sent]:::system
    C --> D[Editor Logs In]:::editor
    D --> E[Opens Dashboard & Views New Manuscript]:::editor
    E --> F[Assigns Reviewer via Email]:::editor
    F --> G[System Auto-Creates Account & Tokens]:::system
    G --> H[Invitation Email Sent to Reviewer]:::system
    H --> I[Reviewer Clicks 'Accept' in Email]:::reviewer
    I --> J[Status Changes to 'Accepted']:::system
    J --> K[Reviewer Logs In]:::reviewer
    K --> L[Completes 4-Step Evaluation Form]:::reviewer
    L --> M[Submits Rating & Recommendations]:::reviewer
    M --> N[Status Changes to 'Completed']:::system
    N --> O[Editor Views Final Review Data]:::editor

```
