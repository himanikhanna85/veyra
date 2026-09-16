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
});
