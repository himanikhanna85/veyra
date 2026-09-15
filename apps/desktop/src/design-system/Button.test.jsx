import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button.jsx";

describe("Button", () => {
  it("prevents repeat actions and announces progress while busy", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button busy onClick={onClick} variant="high-energy">
        Run test
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Run test — Running" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-live", "polite");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
