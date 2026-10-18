import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TeachScreen } from "./TeachScreen.jsx";

const project = { environmentName: "Staging", environments: [{ id: "e1", isActive: true, name: "Staging" }], name: "Shop" };
const session = { environmentName: "Staging", name: "Checkout", startedAt: "2026-10-04T10:00:00.000Z" };

describe("TeachScreen capture", () => {
  it("shows readable captured steps, flags ambiguity and protected values", () => {
    const capture = { recording: true, actions: [
      { actionId: "click-cart", kind: "click", seq: 1, readable: "Click button “Add to cart” in “Wireless Headphones”", resolution: "unique", sensitive: false, target: { locators: [{ description: "#raw-selector" }] } },
      { actionId: "password", kind: "type", seq: 2, readable: "Enter protected value in textbox", resolution: "unique", sensitive: true, value: "must-not-render" },
      { actionId: "email", kind: "type", seq: 3, readable: "Type “qa@example.com” in textbox “Email”", resolution: "unique", sensitive: false, parameterCandidate: { source: "literal", status: "suggested", suggestedName: "email", value: "qa@example.com" } },
      { actionId: "ambiguous", kind: "click", seq: 4, readable: "Click button “Add to cart”", resolution: "ambiguous", sensitive: false },
    ] };
    render(<TeachScreen capture={capture} project={project} session={session} />);
    expect(screen.getByRole("status")).toHaveTextContent("Recording your demonstration");
    const steps = screen.getByLabelText("Captured steps").children;
    expect(steps).toHaveLength(4);
    expect(steps[0]).toHaveTextContent("1ClickClick button “Add to cart” in “Wireless Headphones”");
    expect(steps[3]).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("{{email}}")).toBeInTheDocument();
    expect(screen.getByText(/block rather than guess/)).toBeInTheDocument();
    expect(screen.getByText("Value protected")).toBeInTheDocument();
    expect(screen.queryByText("must-not-render")).not.toBeInTheDocument();
    expect(screen.queryByText("#raw-selector")).not.toBeInTheDocument();
  });

  it("orders persisted actions by sequence and announces the latest readable step", () => {
    const capture = { recording: false, actions: [
      { actionId: "second", kind: "navigate", seq: 2, readable: "Go to checkout", sensitive: false },
      { actionId: "first", kind: "click", seq: 1, readable: "Click Shop now", sensitive: false },
    ] };
    render(<TeachScreen capture={capture} project={project} session={session} />);
    const steps = screen.getByLabelText("Captured steps").children;
    expect(steps[0]).toHaveTextContent("Click Shop now");
    expect(steps[1]).toHaveTextContent("Go to checkout");
    expect(screen.getByText("2 steps captured. Latest: Go to checkout")).toHaveAttribute("aria-live", "polite");
  });

  it("offers to open the controlled browser before capture starts", () => {
    render(<TeachScreen capture={null} onOpenBrowser={() => {}} project={project} session={session} />);
    expect(screen.getByRole("button", { name: /open controlled browser/i })).toBeInTheDocument();
  });

  it("shows a paused recording and resumes it on request", () => {
    const onSetPaused = vi.fn();
    render(<TeachScreen capture={{ actions: [], paused: true, recording: false }} onSetPaused={onSetPaused} project={project} session={session} />);
    expect(screen.getByRole("status")).toHaveTextContent("Recording paused");
    fireEvent.click(screen.getByRole("button", { name: "Resume recording" }));
    expect(onSetPaused).toHaveBeenCalledWith(false);
  });
});
