import { useCallback, useEffect, useState } from "react";
import { ArchiveRestore, Database, Download, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "../design-system/Button.jsx";
import "./storage.css";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function StorageScreen({ onProjectsChanged }) {
  const [overview, setOverview] = useState(null);
  const [message, setMessage] = useState("");
  const [pendingClean, setPendingClean] = useState(null);
  const api = window.veyraDesktop;

  const refresh = useCallback(async () => {
    if (!api) return;
    setOverview(await api.getStorageOverview());
  }, [api]);

  useEffect(() => { void refresh(); }, [refresh]);

  async function restore() {
    const result = await api.restoreProjectBackup();
    setMessage(result.canceled ? "Restore canceled." : `Restored ${result.fileName}.`);
    await refresh();
    if (!result.canceled) await onProjectsChanged?.(result.projectId);
  }

  async function clean(projectId) {
    if (pendingClean !== projectId) {
      setPendingClean(projectId);
      setMessage("Select Clean again to remove evidence older than 30 days. Project definitions and run history are kept.");
      return;
    }
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const result = await api.cleanProjectEvidence(projectId, cutoff);
    setPendingClean(null);
    setMessage(`Removed ${result.deletedFiles} evidence files (${formatBytes(result.deletedBytes)}).`);
    await refresh();
  }

  return (
    <section aria-labelledby="storage-title" className="storage-screen">
      <div className="storage-heading">
        <div>
          <span className="eyebrow">Local workspace</span>
          <h1 id="storage-title">Data &amp; storage</h1>
          <p>Project definitions stay in versioned local storage. Screenshots, traces and reports are stored separately.</p>
        </div>
        <div className="storage-heading__actions">
          <Button disabled={!api} icon={ArchiveRestore} onClick={() => void restore()} variant="primary">Restore project</Button>
          <Button disabled={!api} icon={RefreshCw} onClick={() => void refresh()} variant="secondary">Refresh</Button>
        </div>
      </div>

      {!api ? <div className="storage-notice">Storage details are available in the desktop application.</div> : null}
      {overview ? (
        <>
          <div aria-label="Storage totals" className="storage-summary">
            <div><Database aria-hidden="true" size={18} /><span>Structured data</span><strong>{formatBytes(overview.databaseBytes)}</strong></div>
            <div><span>Evidence</span><strong>{formatBytes(overview.evidenceBytes)}</strong><small>{overview.evidenceFiles} files</small></div>
            <div><span>Total local usage</span><strong>{formatBytes(overview.totalBytes)}</strong></div>
          </div>
          <div className="storage-projects">
            <div className="storage-projects__head"><h2>Projects</h2><span>{overview.projects.length}</span></div>
            {overview.projects.length === 0 ? <p className="storage-empty">No project storage yet. Restore a Veyra project or create one when Projects is enabled.</p> : overview.projects.map((project) => (
              <article className="storage-project" key={project.id}>
                <div><strong>{project.name}</strong><span>{formatBytes(project.evidenceBytes)} evidence · {project.evidenceFiles} files</span></div>
                <div>
                  <Button icon={Download} onClick={() => void api.exportProjectBackup(project.id)} variant="secondary">Export</Button>
                  <Button icon={Trash2} onClick={() => void clean(project.id)} variant="secondary">{pendingClean === project.id ? "Confirm clean" : "Clean evidence"}</Button>
                </div>
              </article>
            ))}
          </div>
          <p aria-live="polite" className="storage-message">{message}</p>
        </>
      ) : null}
    </section>
  );
}
