import { MonitorPlay } from "lucide-react";
import { useState } from "react";
import { Button } from "../design-system/Button.jsx";

const ACTION_LABELS = { click: "Click", key: "Key", navigate: "Navigation", select: "Selection", type: "Text entry" };

export function TeachScreen({ busy, capture, error, onOpenBrowser, onCreateProject, onSetPaused, onStart, project, session }) {
  const [name, setName] = useState("");
  const activeEnvironment = project?.environments?.find((environment) => environment.isActive);
  const actions = [...(capture?.actions ?? [])].sort((left, right) => left.seq - right.seq);

  if (!project) {
    return <section className="teach-screen"><div className="teach-empty"><span className="eyebrow">Teach</span><h1>Create a project first</h1><p>A Teach session needs a project and environment.</p><Button onClick={onCreateProject} variant="high-energy">Create project</Button></div></section>;
  }

  if (session) {
    return (
      <section aria-labelledby="teach-session-title" className="teach-screen teach-screen--active">
        <header className="teach-recording-header">
          <div>
            <span className="teach-session-status" role="status">{capture?.paused ? "Recording paused" : capture?.recording ? "Recording your demonstration" : "Teaching session started"}</span>
            <h1 id="teach-session-title">{session.name}</h1>
          </div>
          <div className="teach-recording-meta"><span>{session.environmentName}</span><span>Started {new Date(session.startedAt).toLocaleTimeString()}</span></div>
        </header>
        <div className="teach-workspace">
          <article className="teach-timeline panel"><div className="teach-timeline-heading"><span className="eyebrow">Teaching timeline</span>{actions.length ? <span>{actions.length} {actions.length === 1 ? "step" : "steps"}</span> : null}</div>{actions.length ? (
              <><p aria-atomic="true" aria-live="polite" className="sr-only">{actions.length} {actions.length === 1 ? "step" : "steps"} captured. Latest: {actions.at(-1).readable}</p>
                <ol aria-label="Captured steps" className="teach-steps">
                  {actions.map((action, index) => (
                    <li aria-current={index === actions.length - 1 ? "step" : undefined} className={index === actions.length - 1 ? "teach-step teach-step--active" : "teach-step"} key={action.actionId ?? action.seq}>
                      <span aria-hidden="true" className="teach-step-number">{index + 1}</span>
                      <div className="teach-step-content">
                        <span className="teach-step-kind">{ACTION_LABELS[action.kind] ?? "Action"}</span>
                        <strong>{action.readable}</strong>
                        {action.parameterCandidate ? <span className="teach-step-parameter">Suggested input <code>{`{{${action.parameterCandidate.suggestedName}}}`}</code></span> : null}
                        {action.resolution === "ambiguous" ? <span className="teach-step-warning">Several matching controls — Veyra will block rather than guess.</span> : null}
                        {action.sensitive ? <span className="teach-step-note">Value protected</span> : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            ) : <><h2>Ready for your demonstration</h2><p>Actions you demonstrate will appear here as readable steps.</p></>}</article>
          <article className="teach-browser-placeholder panel"><MonitorPlay aria-hidden="true" size={28} /><h2>{capture?.paused ? "Recording paused" : capture?.recording ? "Browser open" : "Environment selected"}</h2><p>{capture?.paused ? "Actions in the controlled browser will not be captured until you resume." : capture?.recording ? "Perform your workflow in the controlled browser window." : `${session.environmentName} is attached. Open the controlled browser to start capturing.`}</p>{error ? <p className="teach-error" role="alert">{error}</p> : null}{capture?.recording || capture?.paused ? <Button busy={busy} onClick={() => onSetPaused(!capture?.paused)} variant="secondary">{capture?.paused ? "Resume recording" : "Pause recording"}</Button> : <Button icon={MonitorPlay} onClick={onOpenBrowser} variant="high-energy">Open controlled browser</Button>}</article>
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
