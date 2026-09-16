import { useEffect, useMemo, useRef, useState } from "react";
import { Archive, Check, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { Button } from "../design-system/Button.jsx";
import "./project-dialog.css";

export function ProjectDialog({ mode, onClose, onCommand, project }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(document.activeElement);
  const [name, setName] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("https://");
  const [environmentName, setEnvironmentName] = useState("Staging");
  const [environmentDraft, setEnvironmentDraft] = useState({ name: "", baseUrl: "https://" });
  const [variableDraft, setVariableDraft] = useState({ key: "", value: "" });
  const [deleteName, setDeleteName] = useState("");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const busy = Boolean(busyAction);

  useEffect(() => {
    setName(project?.name ?? "");
    setApplicationUrl(project?.applicationUrl ?? "https://");
    setEnvironmentName(project?.environmentName ?? "Staging");
    setError("");
  }, [mode, project]);

  useEffect(() => () => previousFocusRef.current?.focus?.(), []);

  useEffect(() => {
    function handleDialogKey(event) {
      if (event.key === "Escape" && !busy) { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const focusable = [...dialogRef.current.querySelectorAll("button:not(:disabled),input:not(:disabled),[href],[tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable.at(-1);
      if (!dialogRef.current.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", handleDialogKey);
    return () => window.removeEventListener("keydown", handleDialogKey);
  }, [busy, onClose]);

  const activeEnvironment = useMemo(() => project?.environments.find((environment) => environment.isActive), [project]);
  const validUrl = (value) => { try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; } };
  const canSubmit = Boolean(name.trim() && validUrl(applicationUrl) && (mode !== "create" || environmentName.trim()));

  async function run(command, close = false, actionKey = command.type) {
    setBusyAction(actionKey); setError("");
    try { await onCommand(command); if (close) onClose(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setBusyAction(""); }
  }

  function submit(event) {
    event.preventDefault();
    if (mode === "create") void run({ type: "create", name, applicationUrl, environmentName }, true);
    else void run({ type: "update", projectId: project.id, name, applicationUrl });
  }

  return (
    <div className="project-dialog-backdrop" role="presentation">
      <section aria-labelledby="project-dialog-title" aria-modal="true" className="project-dialog" ref={dialogRef} role="dialog">
        <header>
          <div><span className="eyebrow">{mode === "create" ? "New workspace" : "Project settings"}</span><h2 id="project-dialog-title">{mode === "create" ? "Create project" : project.name}</h2></div>
          <button aria-label="Close project settings" className="icon-button" disabled={busy} onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
        </header>

        <form className="project-form" onSubmit={submit}>
          <label>Project name<input autoFocus disabled={busy} required value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Application URL<input disabled={busy} required type="url" value={applicationUrl} onChange={(event) => setApplicationUrl(event.target.value)} /></label>
          {mode === "create" ? <label>First environment<input disabled={busy} required value={environmentName} onChange={(event) => setEnvironmentName(event.target.value)} /></label> : null}
          <Button busy={["create", "update"].includes(busyAction)} disabled={!canSubmit || busy} type="submit" variant="primary">{mode === "create" ? "Create project" : "Save project details"}</Button>
        </form>

        {mode === "manage" ? (
          <>
            <section className="project-dialog-section">
              <div className="project-dialog-section__heading"><div><h3>Environments</h3><p>Choose where Veyra teaches and runs this project.</p></div></div>
              <div className="environment-list">
                {project.environments.map((environment) => (
                  <article className={environment.isActive ? "environment-card environment-card--active" : "environment-card"} key={environment.id}>
                    <div><strong>{environment.name}</strong><span>{environment.baseUrl}</span></div>
                    {environment.isActive ? <span className="active-label"><Check size={13} />Active</span> : <Button busy={busyAction === `activate-${environment.id}`} disabled={busy} onClick={() => void run({ type: "activate-environment", projectId: project.id, environmentId: environment.id }, false, `activate-${environment.id}`)} size="compact">Use</Button>}
                  </article>
                ))}
              </div>
              <div className="inline-form">
                <input aria-label="Environment name" disabled={busy} placeholder="Environment name" value={environmentDraft.name} onChange={(event) => setEnvironmentDraft((value) => ({ ...value, name: event.target.value }))} />
                <input aria-label="Environment base URL" disabled={busy} placeholder="https://" type="url" value={environmentDraft.baseUrl} onChange={(event) => setEnvironmentDraft((value) => ({ ...value, baseUrl: event.target.value }))} />
                <Button busy={busyAction === "save-environment"} disabled={busy} icon={Plus} onClick={() => void run({ type: "save-environment", projectId: project.id, environment: environmentDraft })} size="compact">Add</Button>
              </div>
            </section>

            <section className="project-dialog-section">
              <h3>{activeEnvironment?.name} variables</h3><p>Non-secret values available only in this environment.</p>
              <div className="variable-list">
                {activeEnvironment?.variables.map((variable) => <div className="variable-row" key={variable.key}><code>{variable.key}</code><span>{variable.value}</span><button aria-busy={busyAction === `delete-${variable.key}` || undefined} aria-label={`Delete ${variable.key}`} disabled={busy} onClick={() => void run({ type: "delete-variable", projectId: project.id, environmentId: activeEnvironment.id, key: variable.key }, false, `delete-${variable.key}`)} type="button">{busyAction === `delete-${variable.key}` ? <LoaderCircle aria-hidden="true" className="button__spinner" size={14} /> : <Trash2 aria-hidden="true" size={14} />}</button></div>)}
                {activeEnvironment?.variables.length === 0 ? <span className="empty-copy">No variables yet.</span> : null}
              </div>
              <div className="inline-form inline-form--variable">
                <input aria-label="Variable name" disabled={busy} placeholder="e.g. locale" value={variableDraft.key} onChange={(event) => setVariableDraft((value) => ({ ...value, key: event.target.value }))} />
                <input aria-label="Variable value" disabled={busy} placeholder="e.g. en-IN" value={variableDraft.value} onChange={(event) => setVariableDraft((value) => ({ ...value, value: event.target.value }))} />
                <Button busy={busyAction === "save-variable"} disabled={busy || !activeEnvironment || !variableDraft.key.trim()} icon={Plus} onClick={() => activeEnvironment && void run({ type: "save-variable", projectId: project.id, environmentId: activeEnvironment.id, ...variableDraft })} size="compact">Save</Button>
              </div>
            </section>

            <section className="project-dialog-section danger-zone">
              <h3>Project lifecycle</h3>
              <div className="danger-action"><div><strong>Archive project</strong><span>Hide it from the project switcher without deleting data.</span></div><Button busy={busyAction === "archive"} disabled={busy} icon={Archive} onClick={() => confirmArchive ? void run({ type: "archive", projectId: project.id, archived: true }, true) : setConfirmArchive(true)}>{confirmArchive ? "Confirm archive" : "Archive"}</Button></div>
              <div className="danger-action"><div><strong>Delete permanently</strong><span>Enter <b>{project.name}</b> to remove definitions and evidence.</span></div><div className="delete-confirm"><input aria-label="Confirm project name" disabled={busy} placeholder={project.name} value={deleteName} onChange={(event) => setDeleteName(event.target.value)} /><Button busy={busyAction === "delete"} disabled={busy || deleteName !== project.name} icon={Trash2} onClick={() => void run({ type: "delete", projectId: project.id, confirmationName: deleteName }, true)}>Delete</Button></div></div>
            </section>
          </>
        ) : null}
        {error ? <p aria-live="assertive" className="form-error">{error}</p> : null}
      </section>
    </div>
  );
}
