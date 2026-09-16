import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Archive, Check, LoaderCircle, LockKeyhole, Plus, Trash2, X } from "lucide-react";
import { Button } from "../design-system/Button.jsx";
import "./project-dialog.css";

export function ProjectDialog({ mode, onClose, onCommand, project }) {
  const dialogRef = useRef(null);
  const deleteConfirmationRef = useRef(null);
  const deleteTriggerRef = useRef(null);
  const previousFocusRef = useRef(document.activeElement);
  const [name, setName] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("https://");
  const [environmentName, setEnvironmentName] = useState("Staging");
  const [environmentDraft, setEnvironmentDraft] = useState({ name: "", baseUrl: "https://" });
  const [variableDraft, setVariableDraft] = useState({ key: "", value: "" });
  const [secretReferenceDraft, setSecretReferenceDraft] = useState({ id: "", description: "" });
  const [deleteName, setDeleteName] = useState("");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const busy = Boolean(busyAction);
  const secretReferenceIdIsInvalid = Boolean(secretReferenceDraft.id && !/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(secretReferenceDraft.id));

  useEffect(() => {
    setName(project?.name ?? "");
    setApplicationUrl(project?.applicationUrl ?? "https://");
    setEnvironmentName(project?.environmentName ?? "Staging");
    setConfirmDelete(false);
    setError("");
  }, [mode, project]);

  useEffect(() => () => previousFocusRef.current?.focus?.(), []);

  useEffect(() => {
    function handleDialogKey(event) {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        if (confirmDelete) { setConfirmDelete(false); window.requestAnimationFrame(() => deleteTriggerRef.current?.focus()); }
        else onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusRoot = confirmDelete ? deleteConfirmationRef.current : dialogRef.current;
      const focusable = [...focusRoot.querySelectorAll("button:not(:disabled),input:not(:disabled),[href],[tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable.at(-1);
      if (!focusRoot.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener("keydown", handleDialogKey);
    return () => window.removeEventListener("keydown", handleDialogKey);
  }, [busy, confirmDelete, onClose]);

  const activeEnvironment = useMemo(() => project?.environments.find((environment) => environment.isActive), [project]);
  const validUrl = (value) => { try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; } };
  const canSubmit = Boolean(name.trim() && validUrl(applicationUrl) && (mode !== "create" || environmentName.trim()));

  async function run(command, close = false, actionKey = command.type) {
    setBusyAction(actionKey); setError("");
    try { await onCommand(command); if (close) onClose(); return true; }
    catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); return false; }
    finally { setBusyAction(""); }
  }

  function submit(event) {
    event.preventDefault();
    if (mode === "create") void run({ type: "create", name, applicationUrl, environmentName }, true);
    else void run({ type: "update", projectId: project.id, name, applicationUrl });
  }

  function cancelDelete() {
    setConfirmDelete(false);
    window.requestAnimationFrame(() => deleteTriggerRef.current?.focus());
  }

  async function addSecretReference() {
    const saved = await run({ type: "save-secret-reference", projectId: project.id, ...secretReferenceDraft });
    if (saved) setSecretReferenceDraft({ id: "", description: "" });
  }

  return (
    <div className="project-dialog-backdrop" role="presentation">
      <section aria-hidden={confirmDelete || undefined} aria-labelledby="project-dialog-title" aria-modal={!confirmDelete} className="project-dialog" inert={confirmDelete ? true : undefined} ref={dialogRef} role="dialog">
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

            <section className="project-dialog-section">
              <h3>Secret references</h3><p>Create logical names now. OS-secured value storage is added in the next security slice.</p>
              <div className="secret-reference-list">
                {(project.secretReferences ?? []).map((reference) => { const deleting = busyAction === `delete-secret-${reference.id}`; return <div className="secret-reference-row" key={reference.id}><LockKeyhole aria-hidden="true" size={16} /><span><code>{reference.id}</code><small>{reference.description || "No description"}</small></span><span className="secret-reference-status">Value not configured</span><button aria-busy={deleting || undefined} aria-label={deleting ? `Deleting secret reference ${reference.id}` : `Delete secret reference ${reference.id}`} aria-live="polite" disabled={busy} onClick={() => void run({ type: "delete-secret-reference", projectId: project.id, id: reference.id }, false, `delete-secret-${reference.id}`)} type="button">{deleting ? <LoaderCircle aria-hidden="true" className="button__spinner" size={14} /> : <Trash2 aria-hidden="true" size={14} />}</button></div>; })}
                {(project.secretReferences ?? []).length === 0 ? <span className="empty-copy">No secret references yet.</span> : null}
              </div>
              <div className="inline-form inline-form--secret">
                <label>Secret identifier<input aria-describedby={secretReferenceIdIsInvalid ? "secret-reference-id-error" : undefined} aria-invalid={secretReferenceIdIsInvalid || undefined} disabled={busy} pattern="[A-Za-z][A-Za-z0-9_]*" placeholder="e.g. shop_password" value={secretReferenceDraft.id} onChange={(event) => setSecretReferenceDraft((value) => ({ ...value, id: event.target.value }))} />{secretReferenceIdIsInvalid ? <small className="field-error" id="secret-reference-id-error"><AlertCircle aria-hidden="true" size={13} />Start with a letter; use up to 64 letters, numbers or underscores.</small> : null}</label>
                <label><span className="field-label">Secret description <small>(optional)</small></span><input disabled={busy} maxLength={200} placeholder="What this credential is used for" value={secretReferenceDraft.description} onChange={(event) => setSecretReferenceDraft((value) => ({ ...value, description: event.target.value }))} /></label>
                <Button aria-label="Add secret reference" busy={busyAction === "save-secret-reference"} disabled={busy || secretReferenceIdIsInvalid || !secretReferenceDraft.id} icon={Plus} onClick={() => void addSecretReference()} size="compact">Add</Button>
              </div>
            </section>

            <section className="project-dialog-section danger-zone">
              <h3>Project lifecycle</h3>
              <div className="danger-action"><div><strong>Archive project</strong><span>Hide it from the project switcher without deleting data.</span></div><Button busy={busyAction === "archive"} disabled={busy} icon={Archive} onClick={() => confirmArchive ? void run({ type: "archive", projectId: project.id, archived: true }, true) : setConfirmArchive(true)}>{confirmArchive ? "Confirm archive" : "Archive"}</Button></div>
              <div className="danger-action"><div><strong>Delete permanently</strong><span>Enter <b>{project.name}</b> to continue to the final confirmation.</span></div><div className="delete-confirm"><input aria-label="Confirm project name" disabled={busy} placeholder={project.name} value={deleteName} onChange={(event) => setDeleteName(event.target.value)} /><Button disabled={busy || deleteName !== project.name} icon={Trash2} onClick={() => setConfirmDelete(true)} ref={deleteTriggerRef}>Delete</Button></div></div>
            </section>
          </>
        ) : null}
        {error ? <p aria-live="assertive" className="form-error">{error}</p> : null}
      </section>
      {confirmDelete ? <section aria-labelledby="delete-project-title" aria-modal="true" className="destructive-confirm" ref={deleteConfirmationRef} role="alertdialog"><div className="destructive-confirm__icon"><Trash2 aria-hidden="true" size={22} /></div><h3 id="delete-project-title">Delete {project.name} permanently?</h3><p>This cannot be undone. Veyra will permanently remove this project’s definitions, run history, environments, variables and evidence.</p><div className="destructive-confirm__actions"><Button autoFocus disabled={busy} onClick={cancelDelete} variant="secondary">Cancel</Button><Button busy={busyAction === "delete"} className="button--danger" disabled={busy} onClick={() => void run({ type: "delete", projectId: project.id, confirmationName: deleteName }, true)}>Delete project permanently</Button></div></section> : null}
    </div>
  );
}
