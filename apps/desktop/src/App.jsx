import { useCallback, useEffect, useState } from "react";
import { AppShell } from "./design-system/AppShell.jsx";
import { OverviewScreen } from "./screens/OverviewScreen.jsx";
import { StorageScreen } from "./screens/StorageScreen.jsx";
import { ProjectDialog } from "./projects/ProjectDialog.jsx";

const previewWorkspace = {
  projects: [{ id: "preview", name: "Commerce Storefront", environmentName: "Staging", archived: false }],
  activeProject: { id: "preview", name: "Commerce Storefront", applicationUrl: "https://shop.example", environmentName: "Staging", archived: false, environments: [{ id: "default", name: "Staging", baseUrl: "https://shop.example", isActive: true, variables: [] }], secretReferences: [] },
  overview: { tests: 18, modules: 7, recentRuns: 14, latestOutcome: "FAIL", passRate: 89 },
};

export function App() {
  const hasWorkspaceApi = typeof window.veyraDesktop?.getProjectWorkspace === "function";
  const [activeSection, setActiveSection] = useState("overview");
  const [workspace, setWorkspace] = useState(hasWorkspaceApi ? { projects: [], activeProject: null, overview: null } : previewWorkspace);
  const [projectDialog, setProjectDialog] = useState(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(hasWorkspaceApi);
  const [workspaceError, setWorkspaceError] = useState("");
  const [browserSession, setBrowserSession] = useState(null);
  const [browserRuntime, setBrowserRuntime] = useState(null);
  const [browserError, setBrowserError] = useState("");
  const [browserBusy, setBrowserBusy] = useState(false);
  const pageTitle = activeSection[0].toUpperCase() + activeSection.slice(1);

  const refreshWorkspace = useCallback(async (projectId) => {
    if (!hasWorkspaceApi) return;
    setLoadingWorkspace(true);
    setWorkspaceError("");
    try { setWorkspace(await window.veyraDesktop.getProjectWorkspace(projectId)); }
    catch (reason) { setWorkspaceError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setLoadingWorkspace(false); }
  }, [hasWorkspaceApi]);

  useEffect(() => { void refreshWorkspace(); }, [refreshWorkspace]);

  useEffect(() => {
    let active = true;
    async function loadBrowserSession() {
      if (typeof window.veyraDesktop?.getControlledBrowserSession !== "function") return;
      try {
        const [session, runtime] = await Promise.all([
          window.veyraDesktop.getControlledBrowserSession(),
          window.veyraDesktop.getBrowserRuntimeStatus(),
        ]);
        if (active) {
          setBrowserSession(session);
          setBrowserRuntime(runtime);
        }
      } catch (reason) {
        if (active) setBrowserError(reason instanceof Error ? reason.message : String(reason));
      }
    }
    void loadBrowserSession();
    return () => { active = false; };
  }, []);

  async function applyProjectCommand(command) {
    if (typeof window.veyraDesktop?.applyProjectCommand !== "function") throw new Error("Project changes are available in the desktop app.");
    const result = await window.veyraDesktop.applyProjectCommand(command);
    await refreshWorkspace(result.projectId ?? undefined);
  }

  async function startControlledBrowser() {
    if (!workspace.activeProject) return;
    if (typeof window.veyraDesktop?.startControlledBrowser !== "function") {
      setBrowserError("Controlled browser is available in the desktop app.");
      return;
    }
    setBrowserBusy(true);
    setBrowserError("");
    try {
      setBrowserSession(await window.veyraDesktop.startControlledBrowser({ projectId: workspace.activeProject.id }));
    } catch (reason) {
      setBrowserError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBrowserBusy(false);
    }
  }

  async function stopControlledBrowser() {
    if (typeof window.veyraDesktop?.stopControlledBrowser !== "function") return;
    setBrowserBusy(true);
    setBrowserError("");
    try {
      await window.veyraDesktop.stopControlledBrowser();
      setBrowserSession(null);
    } catch (reason) {
      setBrowserError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBrowserBusy(false);
    }
  }

  return (
    <AppShell
      activeSection={activeSection}
      activeProject={workspace.activeProject}
      projects={workspace.projects}
      onCreateProject={() => setProjectDialog("create")}
      onManageProject={() => setProjectDialog("manage")}
      onNavigate={setActiveSection}
      onProjectSelect={(projectId) => void refreshWorkspace(projectId)}
      pageTitle={pageTitle}
    >
      {activeSection === "overview" ? (
        <OverviewScreen browserBusy={browserBusy} browserError={browserError} browserRuntime={browserRuntime} browserSession={browserSession} error={workspaceError} loading={loadingWorkspace} onCreateProject={() => setProjectDialog("create")} onDiagnostics={() => setActiveSection("data")} onManageProject={() => setProjectDialog("manage")} onNavigate={setActiveSection} onRetry={() => void refreshWorkspace(workspace.activeProject?.id)} onStartControlledBrowser={() => void startControlledBrowser()} onStopControlledBrowser={() => void stopControlledBrowser()} overview={workspace.overview} project={workspace.activeProject} />
        ) : activeSection === "data" ? (
          <StorageScreen onProjectsChanged={refreshWorkspace} />
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
      {projectDialog ? <ProjectDialog mode={projectDialog} onClose={() => setProjectDialog(null)} onCommand={applyProjectCommand} project={workspace.activeProject} /> : null}
    </AppShell>
  );
}
