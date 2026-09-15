import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge.jsx";

describe("StatusBadge", () => {
  it("exposes the meaning that distinguishes application failure from automation blockage", () => {
    render(
      <>
        <StatusBadge status="FAIL" />
        <StatusBadge status="BLOCKED" />
      </>,
    );

    expect(
      screen.getByRole("status", {
        name: "FAIL — Application contradicted the expected outcome",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("status", {
        name: "BLOCKED — Veyra could not act with confidence",
      }),
    ).toBeVisible();
  });
});
