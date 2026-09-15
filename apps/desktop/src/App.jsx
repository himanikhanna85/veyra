import { useState } from "react";
import { AppShell } from "./design-system/AppShell.jsx";
import { OverviewScreen } from "./screens/OverviewScreen.jsx";
import { StorageScreen } from "./screens/StorageScreen.jsx";

export function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const pageTitle = activeSection[0].toUpperCase() + activeSection.slice(1);

  return (
    <AppShell
      activeSection={activeSection}
      onNavigate={setActiveSection}
      pageTitle={pageTitle}
    >
      {activeSection === "overview" ? (
        <OverviewScreen onNavigate={setActiveSection} />
      ) : activeSection === "data" ? (
        <StorageScreen />
      ) : (
        <section aria-labelledby="foundation-screen-title" className="foundation-placeholder">
          <span>Foundation preview</span>
          <h1 id="foundation-screen-title">{pageTitle}</h1>
          <p>
            This destination is wired into the shared shell. Its product screen is
            tracked separately in tasks.md.
          </p>
        </section>
      )}
    </AppShell>
  );
}
