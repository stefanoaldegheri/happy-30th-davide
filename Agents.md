Of course. As the Specification Architect, I will now synthesize our entire collaborative process into the final, complete `Agent.md` document. This document is the definitive operational protocol for the autonomous agent, incorporating every decision, refinement, and critical review finding we have established.
---
# Agent.md: The Autonomous Agent Operational Protocol
This document defines the complete and non-negotiable operational protocol for the LLM agent. Its purpose is to ensure the creation of secure, maintainable, and high-quality software through a standardized, auditable, and automated process. Adherence to these rules is mandatory.
## 1. Project Structure
The project MUST follow a standardized structure that separates concerns, ensures environmental consistency, and facilitates both human and agent understanding.
### 1.1. Top-Level Structure
The project root MUST contain the following directories:
```
/
├── .devcontainer/    # Environment Definition
├── backend/          # Flask API Server
├── docs/             # Documentation & Task Logs
└── frontend/         # React SPA
```
### 1.2. Development Environment
1.  **Mandated Containerization:** All agent operations (installation, coding, testing, commits) MUST be executed from within a Docker container defined by the `./.devcontainer` configuration. The agent MUST verify it is operating in this container before starting any task.
2.  **Environment Composition:** The environment MUST be orchestrated by a `docker-compose.yml` file within the `.devcontainer` directory. This file will define, at a minimum, the application service and a persistent PostgreSQL database service for local development and manual testing.
### 1.3. Backend Structure (`/backend`)
The backend MUST follow a Hybrid Slicing (Feature-First) architecture.
1.  **Application Factory:** The `create_app()` function MUST be defined in `/app/__init__.py`. The `/app/main.py` file is a minimal development server entry point, and a root `wsgi.py` MUST serve as the production entry point.
2.  **Package Initializers:** All directories intended as Python packages (e.g., `/app`, `/app/core`, all feature directories) MUST contain an `__init__.py` file.
3.  **Directory Roles:**
    -   `/app/core`: For foundational, cross-feature code (e.g., models, services, `security.py`).
    -   `/app/features`: Contains all feature-specific logic as self-contained Flask Blueprints.
### 1.4. Frontend Structure (`/frontend`)
The frontend MUST follow a Feature-Based (Vertical Slicing) architecture.
1.  **Routing:** All client-side routes MUST be defined using **`react-router-dom`** in a single, top-level file at `/src/router.jsx`.
2.  **Directory Roles:**
    -   `/public`: For static assets that are not processed by the build tool (e.g., `favicon.ico`).
    -   `/src/features`: The primary location for feature modules. Each feature folder contains all components, API logic, and hooks specific to that feature.
    -   `/src/components`: For **SHARED**, generic, presentation-only UI components used across multiple features.
    -   `/src/lib`: For **SHARED**, application-wide logic (e.g., API client instance, global state store).
    -   `/src/hooks`: For **SHARED**, generic custom hooks used across multiple features.
3.  **Feature API:** Each feature directory (`/src/features/*`) MUST contain an `index.js` file that serves as its public API, exporting the primary view components for use in the router.
4.  **Refactoring to Shared:** A component, hook, or utility MUST remain within its feature directory until it is required by a **second** feature. A task to refactor the shared code into `/components` or `/lib` MUST then be added to `PLAN.md` and executed.
### 1.5. Documentation Structure (`/docs`)
The `/docs` directory serves multiple purposes:
1.  **Task History Logs:** The directory structure mirrors the source code (`/backend/app`, `/frontend/src`) to contain the agent-generated history logs for each task.
2.  **Architectural Records:** A special, reserved subdirectory named `/_architecture` MUST be used for high-level documentation. This includes `/_architecture/index.md` for the main overview and `/_architecture/adr/` for Architectural Decision Records.
3.  **Tool Invocations:** A special subdirectory `/_invocations` is for machine-readable logs of all significant tool calls.
4.  **Human Interactions:** A special subdirectory `/_interactions` is for storing transcripts of human-agent review sessions.
## 2. Coding Style and Conventions
All code MUST be automatically formatted and linted with zero tolerance for violations.
1.  **Enforcement:** Style is enforced by **pre-commit hooks** (primary gate) and **CI pipeline checks** (final gate).
2.  **Configuration:** Tooling configuration MUST be defined in the respective application root (`/backend` or `/frontend`). This includes `pyproject.toml` for backend tools and `.eslintrc.js` and `.prettierrc` for frontend tools.
3.  **Backend Tooling (Python):**
    -   **Formatter:** **Black** (default configuration).
    -   **Linter:** **Flake8** (with `flake8-bandit` and `flake8-isort` plugins).
    -   **Type Checking:** **Mypy** MUST be used. The configuration (defined in `pyproject.toml`) MUST be set to a strict level, including `--disallow-untyped-defs`. The use of the `Any` type is forbidden except in cases where it is explicitly required for interoperability with untyped libraries.
4.  **Frontend Tooling (JS/JSX/CSS):**
    -   **Formatter:** **Prettier** (default configuration).
    -   **Linter:** **ESLint** configured with the **`eslint-config-airbnb`** ruleset.
## 3. Testing Rules and Guidelines
A multi-layered, automated testing strategy is mandatory to ensure application quality.
### 3.1. Core Philosophy
1.  **Requirement-Coupled Testing:** Application code and its corresponding tests MUST be created in the same task and committed together.
2.  **Database Management:** All database-dependent tests MUST use a dedicated, ephemeral database. The **`testcontainers`** library MUST be used to programmatically start and stop a PostgreSQL Docker container for each test session.
3.  **State Isolation:** Individual test functions **MUST** use transaction rollbacks for state isolation between tests.
4.  **Mocking:** The **`pytest-mock`** plugin and its `mocker` fixture MUST be used for all backend mocking.
5.  **Test Helpers:**
    -   Shared `pytest` fixtures MUST be defined in `/backend/tests/conftest.py`.
    -   **`factory-boy`** definitions MUST be located in `/backend/tests/factories.py`.
    -   Static test data files (JSON, CSV, etc.) MUST be located in `/backend/tests/fixtures/`.
### 3.2. Backend Testing: The Testing Pyramid
1.  **Unit Tests:** Mandatory for all business logic. Located in `/backend/tests/unit/`.
2.  **API Tests:** Mandatory for all API endpoints. Located in `/backend/tests/e2e/`.
### 3.3. Frontend Testing
1.  **Unit/Component Tests:**
    -   **Framework:** **Vitest** and **React Testing Library** MUST be used.
    -   **Location:** Test files (`.spec.jsx`) MUST be co-located with the component source file.
2.  **End-to-End (E2E) Tests:**
    -   **Framework:** **Playwright** MUST be used for user-story-driven E2E tests.
    -   **Architecture:** The **Page Object Model (POM)** pattern is mandatory. All Page Object Model class files **MUST** be located in a dedicated directory at `/backend/tests/e2e/page_objects/`.
    -   **Authentication:** E2E tests requiring an authenticated state MUST use a programmatic login strategy. They MUST NOT perform a full UI login for every test.
### 3.4. Test Execution and Reporting
1.  **Debug Loop Strategy:** During the internal debugging loop (`VALIDATION` -> `IMPLEMENTATION`), the agent MUST run the entire **unit test suite** for a fast feedback cycle.
2.  **Final Validation:** The transition to `DOCUMENTATION_UPDATE` is only permitted after a final pass of the **entire project test suite** (backend unit, API, E2E, and frontend component tests).
3.  **Result Logging:** Test results are logged in the task's history file using the "Hybrid Summary/Detail" approach.
    -   **On `SUCCESS`:** A compact, single-line summary of pass counts and coverage is logged.
    -   **On `FAILURE`:** A detailed, multi-line block is logged, including the summary and full error output for *only the tests that failed*.
4.  **Code Coverage:**
    -   Code coverage is defined as **line and branch coverage**.
    -   The `VALIDATION` state fails if either metric for the backend, as reported by **Pytest**, drops below **90%**.
    -   The `VALIDATION` state fails if either metric for the frontend, as reported by **Vitest**, drops below **85%**.
## 4. Documentation and Project Management
A structured, auditable system for project management is enforced through a set of markdown files.
### 4.1. The "Plan & Log" System
1.  **`PLAN.md`:** The single source of truth for the project's work breakdown.
    -   **Structure:** It MUST use a YAML frontmatter for overall status and a markdown list for tasks.
    -   **Task IDs:** Tasks MUST use a **Semantic ID** (e.g., `TASK-create-auth-endpoints`) that is permanent and conforms to the regex `TASK-[a-z0-9-]+`.
    -   **Prioritization:** The execution order is determined by the top-to-bottom order of `[TODO]` tasks in the file. Reprioritization is achieved by moving a task's entire line.
2.  **Task History Logs:** For each task, a detailed history log MUST be created in the `/docs` directory, mirroring the source code structure.
### 4.2. README.md
A root `README.md` file is mandatory and MUST be structured as a "Project Dashboard" for human developers. It MUST contain the following sections:

1.  **Project Title and Description:** A top-level heading and a single paragraph summarizing the project's purpose.
2.  **Quickstart:** The exact commands required to build the dev container, install dependencies, and run the application for the first time.
3.  **Project Navigation:** A list of links to key documents, including `PLAN.md` and `/_architecture/index.md`.
### 4.3. "Session Zero" Protocol
For a new project, the agent's first task (Task Zero) MUST be to read the `PRD.md` file and generate the initial `PLAN.md`, breaking down the requirements into a structured set of phases and tasks. This initial planning session requires human review and approval before the agent can begin the first implementation task. A full transcript of this review session, including the final human approval, MUST be saved as a markdown file in the `/docs/_interactions/` directory.
### 4.4. History Log Format
To ensure clarity and auditability, the "Actions" section within each task history log (`/docs/**/*.md`) MUST follow a strict, file-centric format. Actions MUST be grouped by the file they modify, prefixed with a status keyword.

1.  **Reasoning Section:** Every log MUST begin with a level-2 markdown heading titled `## Reasoning`. In this section, the agent MUST write a concise, high-level summary of its plan to accomplish the task's objective before listing its actions.
2.  **Actions Section:** The log MUST contain an `**Actions:**` block that follows a strict, file-centric format. Actions MUST be grouped by the file they modify, prefixed with a status keyword.
    -   **Mandated Keywords:** `CREATE`, `MODIFY`, `DELETE`, `RENAME`, `ADD DEPENDENCY`.
    -   **Structure:** The file path or dependency name MUST be the top-level item. Specific changes MUST be listed as sub-bullets.

**Example:**
```markdown
## Reasoning
To implement the user registration feature, my plan is to first create the core service logic for user creation, including password hashing. Then, I will expose this logic via a new `/register` endpoint in the authentication feature's routes file.

**Actions:**
- **CREATE** `/app/core/services/auth_service.py`
  - Implemented `create_user()` function with password hashing.
- **MODIFY** `/app/features/auth/routes.py`
  - Imported `auth_service`.
  - Wired the `create_user` service call into the `/register` endpoint.
```
This format is non-negotiable. Free-form text is not permitted in the Actions list.
## 5. LLM Agent Directives
The agent MUST follow a formal state machine for every task.
### 5.1. The Task Execution State Machine
1.  `ENVIRONMENT_CHECK`: Verify running in Docker, check tool configurations, and perform the bi-directional plan/history integrity check.
2.  `PLANNING`: Select the next task, update its status, and create the history log entry.
3.  `IMPLEMENTATION`: Write application code.
4.  `TEST_WRITING`: Write corresponding tests and create the initial `feat` or `fix` commit as per the Granular Commit Strategy.
5.  `VALIDATION`: Run tests according to the two-tiered strategy. If failures occur, loop back to `IMPLEMENTATION`, creating `fix` commits for each attempt.
6.  `DOCUMENTATION_UPDATE`: Update all relevant human-facing documentation and create the final `docs` commit.
7.  `FINALIZE_TASK`: The final state. Update `PLAN.md` with the task's completion, and create and trigger the automated merge of the Pull Request.
8.  `REPLANNING`: A special state to decompose an overly complex task. Upon entering this state, the agent MUST finalize the history log of the original parent task. This final log entry MUST state the reason for decomposition and explicitly list the new child Task IDs that will be created in `PLAN.md`.
9.  `HALT_AND_REPORT`: A terminal state for irrecoverable errors. Upon entering this state, the agent's final action **MUST** be to revert the status of the `current_focus_task` in `PLAN.md` from `[IN_PROGRESS]` to `[BLOCKED]`. After this action is successfully committed, the agent **MUST terminate its execution entirely**.
### 5.2. Failure Handling: Replanning and Halting
The agent MUST use a two-stage failure handling model to balance autonomous problem-solving with a definitive safety net.

1.  **Reactive Replanning Trigger:**
    -   **Trigger:** If the agent fails the `VALIDATION` state for the same task **twice** (i.e., it is about to enter the debugging loop for a third attempt), it is forbidden from attempting another fix.
    -   **Action:** The agent MUST immediately cease the debugging loop and transition to the `REPLANNING` state to decompose the task into smaller, more manageable units.

2.  **Circuit Breaker and Halt Condition:**
    -   **Trigger:** A separate `max_task_retries` parameter (default: **3**) governs the total number of validation failures allowed for a single parent task and all of its children. If this global counter is exceeded, it indicates the problem is intractable for the agent.
    -   **Action:** The agent MUST transition to the `HALT_AND_REPORT` state. This action is final and signals that the task requires human intervention.
### 5.3. Definition of Done (DoD)
A task is DONE only when: code is written, all tests are written and passing, documentation is updated, the plan and logs are finalized, and all artifacts are committed.
### 5.4. Application Observability
1.  **Logging:** All application logs MUST be structured JSON.
2.  **Tracing:** The application MUST be instrumented with **OpenTelemetry**.
3.  **API Format:** All API responses MUST adhere to the **JSON:API** specification.
4.  **[PLACEHOLDER] Custom Library:** The implementation of logging, tracing, and **the compliant JSON:API response formatting** will be facilitated by a custom, in-house library. The agent will be provided with the name and usage documentation for this library at a later stage.

### 5.5. Real-Time Status Reporting
To provide high-level, real-time visibility for human observers, the agent MUST maintain a status file at the project root.

1.  **File:** A file named `status.md` MUST be present at the project root. This file is for temporary status information and MUST be included in `.gitignore`.
2.  **Update Trigger:** The agent MUST update the content of this file at the beginning of every state transition during the Task Execution Cycle.
3.  **Content:** The file's content should be a single, human-readable line describing the current task and action.
    -   **Example during `IMPLEMENTATION`:** `Status: [IN_PROGRESS] - Implementing feature for TASK-create-auth-endpoints.`
    -   **Example during `VALIDATION`:** `Status: [IN_PROGRESS] - Running validation suite for TASK-create-auth-endpoints.`

### 5.6. Tool Invocation Logging
To ensure full auditability and traceability of the agent's actions, every significant tool execution MUST be logged in a structured, machine-readable format.

1.  **Location:** All invocation logs for a task MUST be placed in a subdirectory named after the Task ID within `/docs/_invocations/`. For example: `/docs/_invocations/TASK-create-auth-endpoints/`.
2.  **File Naming:** Each log file MUST be named `<timestamp>-<command>.json`, where the timestamp is in ISO 8601 format (e.g., `20250821T193000Z-pytest.json`).
3.  **Mandated Commands to Log:** At a minimum, all invocations of the following commands MUST be logged: `git`, `pytest`, `npm`, `poetry`, `black`, `prettier`, `eslint`, `mypy`.
4.  **JSON Structure:** Each log file MUST be a JSON object with the following schema:
    ```json
    {
      "command": "The full command string that was executed",
      "timestamp_utc": "ISO 8601 timestamp",
      "exit_code": "The integer exit code of the command",
      "stdout": "The complete standard output of the command",
      "stderr": "The complete standard error output of the command"
    }
    ```

## 6. Git Workflow and Version Control
A Trunk-Based Development model is mandatory. Committing to `main` is forbidden.
1.  **Branching:** The agent MUST use a short-lived branch for every task, named `<type>/<TASK-ID>` (e.g., `feature/TASK-create-auth-endpoints`).
2.  **Initial Commit:** The first commit in a repository MUST be `chore: initial project structure`.
3.  **Granular Commit Strategy:** The agent MUST NOT group all work for a task into a single commit. A resilient, multi-commit strategy is mandatory to ensure a clean Git history and minimize work loss.
    1.  **Feature/Fix Commit:** After the `TEST_WRITING` state is complete and before the first `VALIDATION` attempt, the agent MUST create a `feat` or `fix` commit containing all the application and test code.
    2.  **Debug Commits:** If the agent enters the `IMPLEMENTATION` <-> `VALIDATION` debugging loop, each subsequent fix MUST be committed with the `fix` type.
    3.  **Documentation Commit:** All changes made during the `DOCUMENTATION_UPDATE` state MUST be committed with the `docs` type.

4.  **Commit Messages:** All commits MUST follow the Conventional Commits specification, with a footer `Refs: <TASK-ID>`.
5.  **Merging:** The agent MUST use Pull Requests (PRs) to merge code into the `main` branch, governed by an automated quality gate.
    1.  **Pull Request Creation:** Upon completion of the final commit for a task, the agent MUST automatically create a Pull Request from its task branch to the `main` branch. The PR body MUST contain a link to the task's history log file in the `/docs` directory.
    2.  **Automated Quality Gate:** The Pull Request is subject to a mandatory CI pipeline that runs the entire validation suite as defined in the Testing section.
    3.  **Automated Merge:** The project's version control system MUST be configured to automatically merge the Pull Request if, and only if, all automated CI checks pass. No human review is required for the merge.
    4.  **Failure Protocol:** If any CI check fails, the PR merge is blocked. The agent MUST check out the branch again and re-enter the state machine to debug the failure, pushing subsequent fixes to the same branch, which will trigger a new CI run.
## 7. Security Requirements
The application MUST be secure by default.
1.  **Input Validation:** All API inputs MUST be validated with **Pydantic**.
2.  **Authentication:** Passwords MUST be hashed with **Argon2**. Authentication MUST use **JWTs** in cookies with the `HttpOnly=True`, `Secure=True`, and `SameSite=Strict` attributes.
3.  **Authorization:** A centralized, decorator-based authorization system MUST be implemented in `/backend/app/core/security.py`.
4.  **CSRF Protection:** CSRF protection MUST be implemented for all state-changing, cookie-authenticated requests.
5.  **CORS Policy:** The Flask backend MUST implement a Cross-Origin Resource Sharing (CORS) policy. For the development environment, this policy must be configured to allow requests only from the specified frontend development server origin. For production, the policy must be configured to allow requests only from the deployed frontend's domain.
6.  **Vulnerability Scanning:** The CI pipeline MUST include **`pip-audit`** and **`npm audit`** and MUST fail on HIGH or CRITICAL vulnerabilities.
## 8. Configuration and Secrets Management
## 8.1. Core Principles
To ensure security and portability, a strict separation between configuration and code MUST be enforced, adhering to the principles of **The Twelve-Factor App** methodology.
1.  **Environment Variables:** All configuration MUST be from environment variables.
2.  **Local Secrets:** Local development MUST use `.env` files, which are excluded from Git. A `.env.example` file is mandatory.
3.  **Validated Configuration:** The backend MUST use **Pydantic's `BaseSettings`** to load and validate all environment variables at application startup.
## 9. Dependency Management
A "Least Privilege" principle is enforced.
1.  **Justification Mandate:** The agent may only add a new dependency if it is strictly necessary and a clear justification is written in the task's history log.
2.  **Lock Files:** All changes to lock files (`poetry.lock`, `package-lock.json`) resulting from a dependency change MUST be committed to version control.
3.  **Updates:** The agent MUST NOT update major dependency versions without an explicit task in `PLAN.md`.