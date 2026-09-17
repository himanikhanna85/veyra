import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App.jsx";

describe("Veyra desktop foundation", () => {
  afterEach(() => { delete window.veyraDesktop; });

  it("opens on the approved Overview shell", () => {
    render(<App />);

    expect(screen.getByRole("img", { name: "Veyra" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Good morning, Himani" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("updates the selected destination and page context from primary navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Teach" }));

    expect(screen.getByRole("button", { name: "Teach" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("heading", { name: "Teach" })).toBeVisible();
    expect(within(screen.getByLabelText("Breadcrumb")).getByText("Commerce Storefront")).toBeVisible();
  });

  it("starts and restores a named Teach session for the active project environment", async () => {
    const user = userEvent.setup();
    const project = { id: "shop", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.test", isActive: true, variables: [] }], secretReferences: [] };
    const workspace = { projects: [{ id: "shop", name: "Shop QA", environmentName: "Staging", archived: false }], activeProject: project, overview: { tests: 0, modules: 0, recentRuns: 0, latestOutcome: null, latestRunAt: null, passRate: null, outcomeCounts: {}, recentRunItems: [], moduleItems: [] } };
    const session = { id: "teach-1", projectId: "shop", environmentId: "default", environmentName: "Staging", name: "Complete checkout", startedAt: "2026-09-17T08:00:00.000Z", status: "started" };
    const startTeachSession = vi.fn().mockResolvedValue(session);
    window.veyraDesktop = {
      getProjectWorkspace: vi.fn().mockResolvedValue(workspace),
      getActiveTeachSession: vi.fn().mockResolvedValue(null),
      startTeachSession,
    };
    render(<App />);

    await screen.findByRole("heading", { name: "Teach your first workflow" });
    await user.click(screen.getByRole("button", { name: "Teach" }));
    await user.type(screen.getByRole("textbox", { name: "Workflow name" }), "Complete checkout");
    await user.click(screen.getByRole("button", { name: "Start teaching" }));

    await waitFor(() => expect(startTeachSession).toHaveBeenCalledWith({ projectId: "shop", environmentId: "default", name: "Complete checkout" }));
    expect(await screen.findByRole("heading", { name: "Complete checkout" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Teaching session started");
    expect(screen.getAllByText(/Staging/).length).toBeGreaterThan(0);
  });

  it("resumes the persisted Teach session when the desktop app reloads", async () => {
    const user = userEvent.setup();
    const project = { id: "shop", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.test", isActive: true, variables: [] }], secretReferences: [] };
    window.veyraDesktop = {
      getProjectWorkspace: vi.fn().mockResolvedValue({ projects: [{ id: "shop", name: "Shop QA", environmentName: "Staging", archived: false }], activeProject: project, overview: { tests: 0, modules: 0, recentRuns: 0, latestOutcome: null, latestRunAt: null, passRate: null, outcomeCounts: {}, recentRunItems: [], moduleItems: [] } }),
      getActiveTeachSession: vi.fn().mockResolvedValue({ id: "teach-1", projectId: "shop", environmentId: "default", environmentName: "Staging", name: "Complete checkout", startedAt: "2026-09-17T08:00:00.000Z", status: "started" }),
    };
    render(<App />);

    await screen.findByRole("heading", { name: "Teach your first workflow" });
    await user.click(screen.getByRole("button", { name: "Teach" }));
    expect(await screen.findByRole("heading", { name: "Complete checkout" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Teaching session started");
  });

  it("opens and dismisses global search without losing shell context", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Search tests, modules, runs" }),
    );

    expect(screen.getByRole("dialog", { name: "Search Veyra" })).toBeVisible();
    expect(screen.getByRole("searchbox", { name: "Search Veyra" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Search Veyra" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Good morning, Himani" })).toBeVisible();
  });

  it("keeps focus inside command search and selects results by keyboard", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Search tests, modules, runs" }),
    );

    const dialog = screen.getByRole("dialog", { name: "Search Veyra" });
    const search = screen.getByRole("searchbox", { name: "Search Veyra" });
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement);
    await user.tab();
    expect(search).toHaveFocus();

    await user.type(search, "nightly");
    await user.keyboard("{Enter}");

    expect(screen.queryByRole("dialog", { name: "Search Veyra" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Runs" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Runs" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("routes Overview work items and announces attention status first", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: /^FAIL — Checkout — Order confirmation missing/,
      }),
    );
    expect(screen.getByRole("heading", { level: 1, name: "Runs" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Overview" }));
    await user.click(screen.getByRole("button", { name: /Search product/ }));
    expect(screen.getByRole("heading", { level: 1, name: "Modules" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Overview" }));
    await user.click(screen.getByRole("button", { name: "Add dataset" }));
    expect(screen.getByRole("heading", { level: 1, name: "Data & storage" })).toBeVisible();
  });

  it("shows local structured and evidence usage in Data", async () => {
    const user = userEvent.setup();
    window.veyraDesktop = {
      getStorageOverview: async () => ({ databaseBytes: 4096, evidenceBytes: 2048, evidenceFiles: 2, totalBytes: 6144, projects: [] }),
    };
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Data" }));
    expect(await screen.findByRole("heading", { name: "Data & storage" })).toBeVisible();
    expect(await screen.findByText("4.0 KB")).toBeVisible();
    expect(screen.getByText("2 files")).toBeVisible();
  });

  it("creates the first desktop project and opens its persisted overview", async () => {
    const user = userEvent.setup();
    const project = { id: "shop", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.test", isActive: true, variables: [] }] };
    const getProjectWorkspace = vi.fn()
      .mockResolvedValueOnce({ projects: [], activeProject: null, overview: null })
      .mockResolvedValue({ projects: [{ id: "shop", name: "Shop QA", environmentName: "Staging", archived: false }], activeProject: project, overview: { tests: 0, modules: 0, recentRuns: 0, latestOutcome: null, passRate: null } });
    const applyProjectCommand = vi.fn().mockResolvedValue({ projectId: "shop" });
    window.veyraDesktop = { getProjectWorkspace, applyProjectCommand };

    render(<App />);
    expect(await screen.findByRole("heading", { name: "Create a project to begin" })).toBeVisible();
    await user.click(within(screen.getByRole("main")).getByRole("button", { name: "Create project" }));
    const dialog = screen.getByRole("dialog", { name: "Create project" });
    expect(within(dialog).getByRole("button", { name: "Create project" })).toBeDisabled();
    await user.type(within(dialog).getByLabelText("Project name"), "Shop QA");
    await user.clear(within(dialog).getByLabelText("Application URL"));
    await user.type(within(dialog).getByLabelText("Application URL"), "https://shop.test");
    await user.click(within(dialog).getByRole("button", { name: "Create project" }));

    expect(applyProjectCommand).toHaveBeenCalledWith({ type: "create", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging" });
    expect(await screen.findByRole("heading", { name: "Good morning, Himani" })).toBeVisible();
    expect(screen.getAllByText("Shop QA").length).toBeGreaterThan(0);
  });

  it("manages a named environment through the desktop project settings", async () => {
    const user = userEvent.setup();
    const project = { id: "shop", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.test", isActive: true, variables: [] }] };
    const workspace = { projects: [{ id: "shop", name: "Shop QA", environmentName: "Staging", archived: false }], activeProject: project, overview: { tests: 0, modules: 0, recentRuns: 0, latestOutcome: null, passRate: null } };
    const applyProjectCommand = vi.fn().mockResolvedValue({ projectId: "shop" });
    window.veyraDesktop = { getProjectWorkspace: vi.fn().mockResolvedValue(workspace), applyProjectCommand };
    render(<App />);

    await screen.findByRole("heading", { name: "Good morning, Himani" });
    await user.click(screen.getByRole("button", { name: "Project settings" }));
    const dialog = screen.getByRole("dialog", { name: "Shop QA" });
    await user.type(within(dialog).getByLabelText("Environment name"), "Production");
    await user.clear(within(dialog).getByLabelText("Environment base URL"));
    await user.type(within(dialog).getByLabelText("Environment base URL"), "https://www.shop.test");
    await user.click(within(dialog).getByRole("button", { name: "Add" }));

    await waitFor(() => expect(applyProjectCommand).toHaveBeenCalledWith({ type: "save-environment", projectId: "shop", environment: { name: "Production", baseUrl: "https://www.shop.test" } }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Shop QA" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Project settings" })).toHaveFocus();
  });

  it("creates a named secret reference without exposing a secret value", async () => {
    const user = userEvent.setup();
    const project = { id: "shop", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.test", isActive: true, variables: [] }], secretReferences: [] };
    const workspace = { projects: [{ id: "shop", name: "Shop QA", environmentName: "Staging", archived: false }], activeProject: project, overview: { tests: 0, modules: 0, recentRuns: 0, latestOutcome: null, latestRunAt: null, passRate: null, outcomeCounts: {}, recentRunItems: [], moduleItems: [] } };
    const applyProjectCommand = vi.fn().mockResolvedValue({ projectId: "shop" });
    window.veyraDesktop = { getProjectWorkspace: vi.fn().mockResolvedValue(workspace), applyProjectCommand };
    render(<App />);

    await screen.findByRole("heading", { name: "Teach your first workflow" });
    await user.click(screen.getByRole("button", { name: "Project settings" }));
    const dialog = screen.getByRole("dialog", { name: "Shop QA" });
    expect(within(dialog).queryByText("correct horse battery staple")).not.toBeInTheDocument();
    await user.type(within(dialog).getByLabelText("Secret identifier"), "shop_password");
    await user.type(within(dialog).getByLabelText(/Secret description/), "Test shopper password");
    await user.click(within(dialog).getByRole("button", { name: "Add secret reference" }));

    await waitFor(() => expect(applyProjectCommand).toHaveBeenCalledWith({ type: "save-secret-reference", projectId: "shop", id: "shop_password", description: "Test shopper password" }));
  });

  it("stores a masked secret value and protects the window while it is entered", async () => {
    const user = userEvent.setup();
    const project = { id: "shop", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.test", isActive: true, variables: [] }], secretReferences: [{ id: "shop_password", description: "Shopper password", hasValue: false }] };
    const workspace = { projects: [{ id: "shop", name: "Shop QA", environmentName: "Staging", archived: false }], activeProject: project, overview: { tests: 0, modules: 0, recentRuns: 0, latestOutcome: null, latestRunAt: null, passRate: null, outcomeCounts: {}, recentRunItems: [], moduleItems: [] } };
    const applyProjectCommand = vi.fn().mockResolvedValue({ projectId: "shop" });
    const setSensitiveEntry = vi.fn().mockResolvedValue(undefined);
    const configuredWorkspace = { ...workspace, activeProject: { ...project, secretReferences: [{ ...project.secretReferences[0], hasValue: true }] } };
    window.veyraDesktop = { getProjectWorkspace: vi.fn().mockResolvedValueOnce(workspace).mockResolvedValue(configuredWorkspace), applyProjectCommand, setSensitiveEntry };
    render(<App />);

    await screen.findByRole("heading", { name: "Teach your first workflow" });
    await user.click(screen.getByRole("button", { name: "Project settings" }));
    const valueInput = screen.getByLabelText("Secret value for shop_password");
    expect(valueInput).toHaveAttribute("type", "password");
    await user.type(valueInput, "correct horse battery staple");
    expect(setSensitiveEntry).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole("button", { name: "Save value" }));

    expect(applyProjectCommand).toHaveBeenCalledWith({ type: "set-secret-value", projectId: "shop", id: "shop_password", value: "correct horse battery staple" });
    await waitFor(() => expect(valueInput).toHaveValue(""));
    expect(setSensitiveEntry).toHaveBeenCalledWith(false);
    expect(screen.queryByText("correct horse battery staple")).not.toBeInTheDocument();
    expect(await screen.findByText("Configured")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Clear value" }));
    expect(applyProjectCommand).toHaveBeenLastCalledWith({ type: "delete-secret-value", projectId: "shop", id: "shop_password" });
  });

  it("requires a final irreversible confirmation before deleting a project", async () => {
    const user = userEvent.setup();
    const project = { id: "shop", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.test", isActive: true, variables: [] }] };
    const workspace = { projects: [{ id: "shop", name: "Shop QA", environmentName: "Staging", archived: false }], activeProject: project, overview: { tests: 0, modules: 0, recentRuns: 0, latestOutcome: null, latestRunAt: null, passRate: null, outcomeCounts: {}, recentRunItems: [], moduleItems: [] } };
    const applyProjectCommand = vi.fn().mockResolvedValue({ projectId: null });
    window.veyraDesktop = { getProjectWorkspace: vi.fn().mockResolvedValue(workspace), applyProjectCommand };
    render(<App />);

    await screen.findByRole("heading", { name: "Teach your first workflow" });
    await user.click(screen.getByRole("button", { name: "Project settings" }));
    await user.type(screen.getByLabelText("Confirm project name"), "Shop QA");
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(applyProjectCommand).not.toHaveBeenCalled();
    let confirmation = screen.getByRole("alertdialog", { name: "Delete Shop QA permanently?" });
    expect(within(confirmation).getByText(/cannot be undone/i)).toBeVisible();
    await user.click(within(confirmation).getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog", { name: "Delete Shop QA permanently?" })).not.toBeInTheDocument();
    expect(applyProjectCommand).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    confirmation = screen.getByRole("alertdialog", { name: "Delete Shop QA permanently?" });
    await user.click(within(confirmation).getByRole("button", { name: "Delete project permanently" }));
    await waitFor(() => expect(applyProjectCommand).toHaveBeenCalledWith({ type: "delete", projectId: "shop", confirmationName: "Shop QA" }));
  });

  it("starts and stops the controlled browser for the active project", async () => {
    const user = userEvent.setup();
    const project = { id: "shop", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.test", isActive: true, variables: [] }], secretReferences: [] };
    const workspace = { projects: [{ id: "shop", name: "Shop QA", environmentName: "Staging", archived: false }], activeProject: project, overview: { tests: 0, modules: 0, recentRuns: 0, latestOutcome: null, latestRunAt: null, passRate: null, outcomeCounts: {}, recentRunItems: [], moduleItems: [] } };
    const startControlledBrowser = vi.fn().mockResolvedValue({
      browserEngine: "chromium",
      browserVersion: "140.0.0.0",
      environmentName: "Staging",
      isolationKey: "veyra-controlled.shop.session-1",
      launchedAt: "2026-09-16T08:00:00.000Z",
      projectId: "shop",
      projectName: "Shop QA",
      sessionId: "session-1",
      status: "running",
      url: "https://shop.test",
    });
    const stopControlledBrowser = vi.fn().mockResolvedValue({ sessionId: "session-1", status: "stopped" });
    window.veyraDesktop = {
      getBrowserRuntimeStatus: vi.fn().mockResolvedValue({ compatibility: "compatible", engine: "chromium", managedBy: "veyra", source: "electron-bundled", status: "ready", version: "144.0.7559.97" }),
      getControlledBrowserSession: vi.fn().mockResolvedValue(null),
      getProjectWorkspace: vi.fn().mockResolvedValue(workspace),
      startControlledBrowser,
      stopControlledBrowser,
    };
    render(<App />);

    await screen.findByRole("heading", { name: "Teach your first workflow" });
    await user.click(screen.getByRole("button", { name: "Start browser" }));

    await waitFor(() => expect(startControlledBrowser).toHaveBeenCalledWith({ projectId: "shop" }));
    expect(await screen.findByText("chromium 140.0.0.0 · Staging")).toBeVisible();
    expect(screen.getByText("https://shop.test")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Stop" }));

    await waitFor(() => expect(stopControlledBrowser).toHaveBeenCalled());
    expect(screen.getByText(/Compatible bundled Chromium 144\.0\.7559\.97 · Open Staging/)).toBeVisible();
  });

  it("disables browser launch when the managed Chromium runtime is unavailable", async () => {
    const project = { id: "shop", name: "Shop QA", applicationUrl: "https://shop.test", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.test", isActive: true, variables: [] }], secretReferences: [] };
    const workspace = { projects: [{ id: "shop", name: "Shop QA", environmentName: "Staging", archived: false }], activeProject: project, overview: { tests: 0, modules: 0, recentRuns: 0, latestOutcome: null, latestRunAt: null, passRate: null, outcomeCounts: {}, recentRunItems: [], moduleItems: [] } };
    window.veyraDesktop = {
      getBrowserRuntimeStatus: vi.fn().mockResolvedValue({ compatibility: "unknown", engine: "chromium", managedBy: "veyra", source: "electron-bundled", status: "unavailable", version: null }),
      getControlledBrowserSession: vi.fn().mockResolvedValue(null),
      getProjectWorkspace: vi.fn().mockResolvedValue(workspace),
    };
    render(<App />);

    expect(await screen.findByText(/Bundled Chromium unavailable/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Start browser" })).toBeDisabled();
  });
});
