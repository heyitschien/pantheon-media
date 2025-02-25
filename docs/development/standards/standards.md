Below is a comprehensive document outlining industry standards and best practices to follow when building a modern streaming hub project. This guide is designed to serve as a reference for both manual development and for orchestrating AI-driven code generation. It covers architectural decisions, coding conventions, testing strategies (including TDD), CI/CD, and more.

---

# Industry Standards & Best Practices for a Modern Streaming Hub Project

*Last Updated: February 2024*

---

## 1. Project Architecture & Structure

**1.1. Modular Architecture**  
- **Separation of Concerns:** Divide the application into clear modules: UI components, state management, services, hooks, utilities, and pages.
- **Directory Structure:**  
  ```
  /src
    /components      # Reusable UI components and compound components
    /contexts        # Global state management using React Context or Redux
    /hooks           # Custom hooks for shared logic
    /services        # API calls and business logic
    /lib             # Utility functions
    /pages           # Page-level components (routing)
    /types           # TypeScript definitions
  ```
- **Scalability:** Structure your codebase so that it can grow without significant refactoring. Favor component composition and encapsulation over large monolithic files.

**1.2. Design Patterns**  
- **Compound Components:** Use this pattern for complex UI elements (e.g., VideoPlayer) to encapsulate subcomponents and reduce prop drilling.
- **Container/Presentational Pattern:** Separate the business logic (container components) from the UI logic (presentational components).
- **State Management:** Use a centralized approach (React Context, Redux, or TanStack Query for data fetching) to keep the application state predictable and manageable.

---

## 2. Technical Stack Guidelines

**2.1. Core Technologies**  
- **React & TypeScript:** Utilize React for building dynamic UIs and TypeScript for static type checking.
- **Vite:** For a fast development environment and efficient module bundling.
- **Tailwind CSS:** Adopt a utility-first approach for styling, ensuring consistency and rapid prototyping.
  
**2.2. Essential Libraries**  
- **Radix UI & shadcn/ui:** Use for accessible, customizable UI primitives.
- **Framer Motion:** Integrate for smooth and responsive animations.
- **React Hook Form:** For efficient and scalable form management.
- **TanStack Query & Zod:** Employ these for robust data fetching and schema validation.

---

## 3. Coding Conventions & Quality

**3.1. Code Style Guidelines**  
- **Consistency:** Follow a style guide (e.g., Airbnb or Prettier configuration) to ensure consistent code formatting and readability.
- **Naming Conventions:** Use clear and descriptive names for variables, functions, and components. Maintain a consistent naming strategy across modules.
- **Modularity:** Break down components into small, reusable pieces. Avoid “god components” with too many responsibilities.
  
**3.2. Documentation & Comments**  
- **Inline Documentation:** Use comments to explain non-obvious logic or business rules.
- **High-Level Documentation:** Maintain a well-documented README and inline documentation (e.g., using JSDoc/TypeScript comments) to explain module purposes and usage.

---

## 4. Test-Driven Development (TDD) & Testing Strategy

**4.1. TDD Approach**  
- **Write Tests First:** Define test cases for functionality before implementing the code. This ensures clear requirements and minimal bugs.
- **Incremental Testing:** Start with unit tests for individual components, then build up to integration and end-to-end (E2E) tests.

**4.2. Testing Tools & Coverage**  
- **Unit Testing:** Use Vitest or Jest to ensure each component and function behaves as expected.
- **Integration Testing:** Validate interactions between components and services.
- **E2E Testing:** Utilize Cypress or a similar tool for testing complete user flows.
- **Coverage Goals:** Aim for high coverage in critical areas (90%+ for core components, and focus on UI behavior and data flows).

**4.3. Test Cases & Scenarios**  
- **Edge Cases:** Identify and test edge cases, such as network failures or unusual user inputs.
- **Mocking & Stubbing:** Use mocking libraries to simulate API calls and external services, ensuring tests are fast and isolated.

---

## 5. Continuous Integration / Continuous Deployment (CI/CD)

**5.1. Automated Testing**  
- **CI Pipelines:** Set up CI pipelines (using GitHub Actions, Travis CI, etc.) to run tests automatically on every commit or pull request.
- **Linting & Formatting:** Integrate linting (ESLint) and formatting (Prettier) checks in the CI pipeline to enforce code quality.

**5.2. Deployment Strategy**  
- **Automated Deployments:** Use platforms like Vercel, Netlify, or AWS Amplify for seamless, automated deployments.
- **Staging Environment:** Maintain a staging environment for testing features before pushing to production.

---

## 6. Accessibility & Responsive Design

**6.1. Accessibility Best Practices**  
- **Semantic HTML:** Use semantic tags (e.g., `<header>`, `<main>`, `<nav>`) to enhance accessibility.
- **ARIA Attributes:** Ensure interactive elements have proper ARIA attributes.
- **Keyboard Navigation:** Design for full keyboard navigability and screen reader support.
- **Color Contrast:** Adhere to WCAG guidelines for color contrast to support users with visual impairments.

**6.2. Responsive Design**  
- **Mobile-First Approach:** Design and develop with mobile responsiveness as a priority.
- **Fluid Layouts:** Use responsive units (e.g., percentages, rems) and CSS media queries to ensure the UI adapts to various screen sizes.
- **Testing Across Devices:** Regularly test on multiple devices and browsers to ensure consistent behavior.

---

## 7. Performance Optimization

**7.1. Efficient Rendering**  
- **Lazy Loading:** Implement lazy loading for heavy components (e.g., video players, large lists).
- **Virtualization:** Use virtualization libraries (like react-window) for rendering long lists or grids.
- **Code Splitting:** Apply code splitting and dynamic imports to minimize the initial load time.

**7.2. Monitoring & Profiling**  
- **Performance Profiling:** Use tools like Chrome DevTools and Lighthouse to identify and address bottlenecks.
- **Caching:** Leverage TanStack Query’s caching strategies for efficient data fetching.

---

## 8. AI Orchestration & Tool Integration

**8.1. Role Definition for AI Tools**  
- **Architectural Planning (Cline):** Use for high-level code generation, refactoring proposals, and documentation scaffolding.
- **Real-Time Coding Assistance (Cursor AI):** Leverage for in-line code completions, quick fixes, and adhering to coding conventions.
- **Complex Logic & Optimization (Sonnet Cloud / Sonnet 2.5):** Utilize these for managing complex business logic, performance optimization, and test scaffolding.

**8.2. AI Workflow Integration**  
- **Feedback Loop:** Ensure a continuous feedback loop between the AI tools and manual review. Validate AI-generated code through code reviews and testing.
- **Consistency Enforcement:** Use the AI tools to enforce consistency across the codebase—adhering to the guidelines set forth in this document.

---

## 9. Security & Data Protection

**9.1. Secure Coding Practices**  
- **Input Validation:** Ensure that all inputs are validated both on the client and server side.
- **Data Sanitization:** Prevent cross-site scripting (XSS) and SQL injection by properly sanitizing data.
- **Authentication & Authorization:** Use secure authentication mechanisms (e.g., JWT, OAuth) and enforce role-based access controls.

**9.2. Dependency Management**  
- **Regular Audits:** Regularly review and update dependencies to mitigate security vulnerabilities.
- **Static Analysis:** Incorporate static code analysis tools (e.g., Snyk, Dependabot) to identify and address security issues.

---

## 10. Version Control & Collaboration

**10.1. Git Workflow**  
- **Branching Strategy:** Adopt a branching strategy such as GitFlow for feature development, bug fixes, and releases.
- **Commit Messages:** Follow a clear and concise commit message format (e.g., Conventional Commits) to document changes effectively.

**10.2. Code Reviews & Documentation**  
- **Peer Reviews:** Ensure all changes go through a thorough code review process to maintain code quality.
- **Documentation Updates:** Regularly update documentation to reflect new features, changes, and architectural decisions.

---

## Conclusion

This document serves as a comprehensive reference for building a modern streaming hub project using industry standards and best practices. It’s designed to guide you through architectural decisions, coding conventions, testing strategies (including TDD), CI/CD pipelines, accessibility, performance optimization, AI orchestration, security, and version control. As you progress through your Meta Front End Development certification and further refine your skills, continue to update and evolve these standards to keep pace with emerging technologies and practices.

By adhering to these guidelines, you ensure that your project not only demonstrates technical prowess but also aligns with professional standards expected in the industry today.

--- 

Feel free to reference and adapt this document as your project evolves and your understanding deepens. Happy coding and AI orchestration!