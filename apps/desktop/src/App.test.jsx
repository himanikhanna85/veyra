import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App.jsx";

describe("Veyra desktop foundation", () => {
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
    delete window.veyraDesktop;
  });
});
