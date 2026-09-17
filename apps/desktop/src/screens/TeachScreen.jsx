import { MonitorPlay } from "lucide-react";
import { useState } from "react";
import { Button } from "../design-system/Button.jsx";

export function TeachScreen({ busy, error, onCreateProject, onStart, project, session }) {
  const [name, setName] = useState("");
  const activeEnvironment = project?.environments?.find((environment) => environment.isActive);

  if (!project) {
    return <section className="teach-screen"><div className="teach-empty"><span className="eyebrow">Teach</span><h1>Create a project first</h1><p>A Teach session needs a project and environment.</p><Button onClick={onCreateProject} variant="high-energy">Create project</Button></div></section>;
  }

  if (session) {
    return (
      <section aria-labelledby="teach-session-title" className="teach-screen teach-screen--active">
        <header className="teach-recording-header">
          <div>
            <span className="teach-session-status" role="status">Teaching session started</span>
            <h1 id="teach-session-title">{session.name}</h1>
          </div>
          <div className="teach-recording-meta"><span>{session.environmentName}</span><span>Started {new Date(session.startedAt).toLocaleTimeString()}</span></div>
        </header>
        <div className="teach-workspace">
          <article className="teach-timeline panel"><span className="eyebrow">Teaching timeline</span><h2>Ready for your demonstration</h2><p>Actions you demonstrate will appear here as readable steps.</p></article>
          <article className="teach-browser-placeholder panel"><MonitorPlay aria-hidden="true" size={28} /><h2>Environment selected</h2><p>{session.environmentName} is attached. Browser action capture begins in the next recorder step.</p></article>
        </div>
      </section>
    );
  }

  function submit(event) {
    event.preventDefault();
    if (name.trim()) onStart({ environmentId: activeEnvironment?.id, name: name.trim() });
  }

  return (
    <section aria-labelledby="teach-title" className="teach-screen">
      <div className="teach-start-card panel">
        <span className="eyebrow">Teach Veyra</span>
        <h1 id="teach-title">Teach</h1>
        <p className="teach-intro">Name the workflow you want to demonstrate. Veyra will keep the session attached to this project and environment.</p>
        <form onSubmit={submit}>
          <label htmlFor="workflow-name">Workflow name</label>
          <input autoFocus id="workflow-name" maxLength={120} onChange={(event) => setName(event.target.value)} placeholder="e.g. Complete checkout" value={name} />
          <div className="teach-context" aria-label="Teach session context"><span>Project<strong>{project.name}</strong></span><span>Environment<strong>{activeEnvironment?.name ?? project.environmentName}</strong></span></div>
          {error ? <p className="teach-error" role="alert">{error}</p> : null}
          <Button busy={busy} disabled={!name.trim() || !activeEnvironment} icon={MonitorPlay} type="submit" variant="high-energy">Start teaching</Button>
        </form>
      </div>
    </section>
  );
}
