import { useEffect, useRef, useState } from "react";

const commands = [
  { label: "Complete checkout", section: "tests", type: "Test" },
  { label: "Add product to cart", section: "tests", type: "Test" },
  { label: "Search product", section: "modules", type: "Module" },
  { label: "Nightly regression — run 482", section: "runs", type: "Run" },
];

export function CommandSearch({ onClose, onSelect }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const visibleCommands = commands.filter(({ label }) =>
    label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "Tab") {
      const focusable = [...dialogRef.current.querySelectorAll("input, button")].filter(
        (element) => !element.disabled,
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!visibleCommands.length) return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setSelectedIndex((index) =>
        (index + direction + visibleCommands.length) % visibleCommands.length,
      );
      return;
    }

    if (event.key === "Enter" && event.target.getAttribute("role") !== "option") {
      const selectedCommand = visibleCommands[selectedIndex];
      if (selectedCommand) {
        event.preventDefault();
        onSelect(selectedCommand.section);
      }
    }
  }

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="command-search-title"
        aria-modal="true"
        className="command-dialog"
        onKeyDown={handleKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
      >
        <h2 className="sr-only" id="command-search-title">
          Search Veyra
        </h2>
        <label className="command-input-wrap">
          <span className="sr-only">Search Veyra</span>
          <input
            aria-activedescendant={
              visibleCommands.length ? `command-result-${selectedIndex}` : undefined
            }
            aria-controls="command-search-results"
            aria-expanded="true"
            aria-label="Search Veyra"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tests, modules, runs"
            ref={inputRef}
            role="searchbox"
            value={query}
          />
          <kbd>ESC</kbd>
        </label>
        <div
          aria-label="Search results"
          className="command-results"
          id="command-search-results"
          role="listbox"
        >
          {visibleCommands.length ? (
            visibleCommands.map(({ label, section, type }, index) => (
              <button
                aria-selected={index === selectedIndex}
                className="command-result"
                id={`command-result-${index}`}
                key={`${section}-${label}`}
                onClick={() => onSelect(section)}
                onMouseMove={() => setSelectedIndex(index)}
                role="option"
                type="button"
              >
                <span>{label}</span>
                <small>{type}</small>
              </button>
            ))
          ) : (
            <p className="command-empty">No matching tests, modules or runs.</p>
          )}
        </div>
      </section>
    </div>
  );
}
