# **BeaverOS: Contributing Guide**

---

Welcome to the **BeaverOS** project! We're thrilled you're interested in contributing. BeaverOS is an open-source, modular, and multi-tenant commerce platform, and its success relies on the collective efforts of a vibrant community. Whether you're a developer, designer, technical writer, or just passionate about open source, there are many ways you can help.

This guide will walk you through the process of contributing to BeaverOS. Please read it carefully before making your first contribution.

---

## **1. Our Code of Conduct**

Before you begin, please ensure you read and understand our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to fostering an open and welcoming environment. By participating in this project, you are expected to uphold this code.

---

## **2. Ways to Contribute**

There are many ways to contribute to BeaverOS, regardless of your skill set:

### **2.1. Reporting Bugs**

Found a bug? Great! Helping us identify and fix issues is incredibly valuable.
1.  **Check existing issues:** Before opening a new issue, please search the [issue tracker](https://github.com/your-org/BeaverOS/issues) (placeholder: replace with actual link) to see if the bug has already been reported.
2.  **Provide clear steps:** If it's a new bug, open a new issue and provide as much detail as possible:
    * A clear and concise description of the bug.
    * Steps to reproduce the behavior.
    * Expected behavior vs. actual behavior.
    * Screenshots or error messages (if applicable).
    * Your environment details (OS, BeaverOS version/commit, relevant microservices).

### **2.2. Suggesting Enhancements / Features**

Have an idea for a new feature or an improvement? We'd love to hear it!
1.  **Check existing discussions:** Search the [issue tracker](https://github.com/your-org/BeaverOS/issues) and [discussions](https://github.com/your-org/BeaverOS/discussions) (placeholder: replace with actual links) to see if your idea has already been discussed.
2.  **Open a new issue:** If new, open an issue with a clear title and description:
    * **Problem:** Describe the problem your suggestion aims to solve.
    * **Proposed Solution:** Explain your idea in detail.
    * **Use Case:** Describe how this feature would benefit users.

### **2.3. Contributing Code**

This is where the magic happens! We welcome contributions from developers of all experience levels.

#### **2.3.1. Setting Up Your Development Environment**
1.  **Fork the repository:** Fork the [BeaverOS repository](https://github.com/your-org/BeaverOS) to your GitHub account.
2.  **Clone your fork:**
    ```bash
    git clone [https://github.com/YOUR_GITHUB_USERNAME/BeaverOS.git](https://github.com/YOUR_GITHUB_USERNAME/BeaverOS.git)
    cd BeaverOS
    ```
3.  **Set up upstream remote:**
    ```bash
    git remote add upstream [https://github.com/your-org/BeaverOS.git](https://github.com/your-org/BeaverOS.git)
    ```
4.  **Install Docker & Docker Compose:** BeaverOS microservices are containerized. Ensure you have Docker and Docker Compose installed.
5.  **Start core services (for development):**
    ```bash
    # From the project root
    docker-compose -f infra/docker-compose.dev.yml up --build -d
    ```
    (Refer to `infra/README.md` for detailed service-specific setup).
6.  **Install dependencies:** Navigate into the specific microservice or client directory you want to work on (e.g., `services/auth-user-service`) and install its dependencies (e.g., `pip install -r requirements.txt`).

#### **2.3.2. Coding Guidelines**
* **Language & Frameworks:** Adhere to the established stack (Python/FastAPI, C++/Qt, React/Next.js).
* **Code Style:** Follow PEP 8 for Python, standard C++ conventions for Qt, and ESLint/Prettier for JavaScript. Automated formatters and linters will be part of CI.
* **Microservices Principles:** Ensure your code adheres to our [Microservices Architecture Design](docs/arch/Microservices_Design.md) (e.g., independent service boundaries, API-first communication).
* **Multi-Tenancy:** **Crucially**, all new code must correctly implement and respect multi-tenancy rules, ensuring strict data isolation per `tenant_id`.
* **Testing:** Write comprehensive unit and integration tests for your changes. Refer to the [Software Testing Strategy](docs/dev/Software_Testing_Strategy.md).

#### **2.3.3. Commit Message Guidelines**
We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for clear and consistent commit history.
* **Format:** `<type>(<scope>): <short description>`
* **Examples:**
    * `feat(auth): Add user password reset functionality`
    * `fix(pos): Correct tax calculation on order items`
    * `docs(roadmap): Update phase 1 details`
    * `chore(deps): Update FastAPI version`
    * `refactor(product): Extract inventory logic to new module`
* **Types:** `feat` (new feature), `fix` (bug fix), `docs` (documentation), `chore` (maintenance, no code change), `refactor` (code refactoring), `test` (adding tests), `style` (formatting), `perf` (performance improvement), `build` (build process changes), `ci` (CI/CD changes).
* **Scope:** The part of the codebase affected (e.g., `auth`, `pos`, `product`, `infra`, `docs`).

#### **2.3.4. Pull Request (PR) Process**
1.  **Create a new branch:** For each new feature or bug fix, create a new branch from `main`:
    ```bash
    git checkout main
    git pull upstream main
    git checkout -b feature/your-feature-name # or bugfix/your-bug-name
    ```
2.  **Make your changes:** Write code, tests, and documentation.
3.  **Test your changes:** Ensure all existing tests pass and your new tests cover your changes.
4.  **Commit your changes:** Follow the [Commit Message Guidelines](#233-commit-message-guidelines).
5.  **Push to your fork:**
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Open a Pull Request:** Go to your fork on GitHub and open a new PR targeting the `main` branch of the `your-org/BeaverOS` repository.
7.  **PR Description:** Provide a clear and concise description of your changes.
    * What problem does it solve?
    * How was it solved?
    * Any relevant screenshots or GIFs.
    * Reference any related issues (e.g., `Closes #123`).
8.  **Code Review:** Your PR will be reviewed by maintainers. Be prepared to address feedback and make further changes.
9.  **Squash and Merge:** Once approved, your PR will be squashed (if necessary, for clean history) and merged into `main`.

### **2.4. Contributing Documentation**

High-quality documentation is invaluable!
* Improve existing READMEs.
* Write tutorials or how-to guides.
* Translate documentation.
* Correct typos or grammatical errors.
* Submit PRs for documentation changes just like code changes.

### **2.5. Contributing Design (UI/UX)**

If you're a designer, your input is crucial for BeaverOS's usability and aesthetic appeal.
* Provide feedback on existing UIs.
* Suggest improvements to workflows.
* Contribute UI mockups or design specifications.
* Participate in design discussions on our communication channels.

### **2.6. Contributing Localization**

Help us make BeaverOS accessible to users worldwide!
* Translate existing strings or documentation into new languages.
* Review existing translations for accuracy.

---

## **3. Community and Communication**

We encourage you to join our community channels to ask questions, discuss ideas, and connect with other contributors:

* **GitHub Discussions:** For broader topics, feature ideas, and general Q&A.
* **Discord/Slack Channel:** (Placeholder: Add link to your preferred chat platform) For real-time discussions, quick questions, and coordination.
* **Issue Tracker:** For bugs and specific feature requests.

We look forward to your contributions and working together to build a powerful open-source commerce platform!

---
