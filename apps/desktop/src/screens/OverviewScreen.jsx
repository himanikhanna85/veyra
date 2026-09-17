import {
  CheckCircle2,
  CircleAlert,
  ChevronRight,
  Database,
  LogIn,
  MonitorPlay,
  PauseCircle,
  Play,
  Search,
  ShoppingCart,
  StopCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../design-system/Button.jsx";

const metrics = [
  ["18", "Tests"],
  ["7", "Reusable modules"],
  ["14 min ago", "Last run"],
  ["89%", "Pass rate — last 7 days"],
];

const modules = [
  { Icon: Search, name: "Search product", usage: "Used by 11 tests" },
  { Icon: ShoppingCart, name: "Add to cart", usage: "Used by 9 tests" },
  { Icon: LogIn, name: "Login", usage: "Used by 14 tests" },
];

export function OverviewScreen({ browserBusy, browserError, browserRuntime, browserSession, error, loading, onCreateProject, onDiagnostics, onManageProject, onNavigate, onRetry, onStartControlledBrowser, onStopControlledBrowser, overview, project }) {
  if (loading) return <div className="overview-screen" aria-label="Loading project overview"><div className="overview-skeleton overview-skeleton--hero" /><div className="metric-grid">{[1, 2, 3, 4].map((item) => <div className="overview-skeleton overview-skeleton--metric" key={item} />)}</div></div>;
  if (error) return <div className="overview-screen"><section className="overview-empty"><span className="eyebrow">Workspace unavailable</span><h1>Veyra could not load your projects</h1><p>{error}</p><div className="overview-empty__actions"><Button onClick={onRetry} variant="primary">Retry</Button><button className="text-link" onClick={onDiagnostics} type="button">Open diagnostics</button></div></section></div>;
  if (!project) return <div className="overview-screen"><section className="overview-empty"><span className="eyebrow">Your first workspace</span><h1>Create a project to begin</h1><p>Give Veyra an application URL and environment, then teach your first workflow.</p><Button onClick={onCreateProject} variant="high-energy">Create project</Button></section></div>;
  const projectMetrics = [
    [String(overview?.tests ?? 0), "Tests"],
    [String(overview?.modules ?? 0), "Reusable modules"],
    [overview?.latestRunAt ? new Date(overview.latestRunAt).toLocaleDateString() : "—", "Last run"],
    [overview?.passRate == null ? "—" : `${overview.passRate}%`, "Pass rate — last 7 days"],
  ];
  const hasRuns = (overview?.recentRuns ?? 0) > 0;
  const isPreview = project.id === "preview";
  const attentionRuns = overview?.recentRunItems?.filter((run) => ["FAIL", "BLOCKED"].includes(run.outcome)) ?? [];
  const latestRun = overview?.recentRunItems?.[0];
  const statusIcon = (outcome) => outcome === "PASS" ? CheckCircle2 : outcome === "BLOCKED" ? PauseCircle : outcome === "ERROR" ? CircleAlert : outcome === "INTERRUPTED" ? StopCircle : XCircle;
  const isEmptyProject = !isPreview && !hasRuns && (overview?.tests ?? 0) === 0 && (overview?.modules ?? 0) === 0;
  if (isEmptyProject) return (
    <div className="overview-screen">
      <section className="overview-hero" aria-labelledby="overview-title"><div><div className="eyebrow-row"><span>{project.name}</span><span aria-hidden="true" className="eyebrow-divider" /><span>{project.environmentName}</span></div><h1 id="overview-title">Good morning, Himani</h1><p>What should Veyra validate today?</p></div><Button onClick={onManageProject} variant="secondary">Project settings</Button></section>
      <section className="overview-empty"><span className="eyebrow">Project ready</span><h2>Teach your first workflow</h2><p>Show Veyra a real task in {project.environmentName}. It will turn your demonstration into a readable test.</p><Button icon={MonitorPlay} onClick={() => onNavigate("teach")} variant="high-energy">Teach first workflow</Button></section>
      <ControlledBrowserPanel browserBusy={browserBusy} browserError={browserError} browserRuntime={browserRuntime} browserSession={browserSession} onStartControlledBrowser={onStartControlledBrowser} onStopControlledBrowser={onStopControlledBrowser} project={project} />
    </div>
  );
  return (
    <div className="overview-screen">
      <section className="overview-hero" aria-labelledby="overview-title">
        <div>
          <div className="eyebrow-row">
            <span>{project.name}</span>
            <span aria-hidden="true" className="eyebrow-divider" />
            <span>{project.environmentName}</span>
          </div>
          <h1 id="overview-title">Good morning, Himani</h1>
          <p>What should Veyra validate today?</p>
        </div>
        <div className="overview-hero__actions">
          <Button onClick={onManageProject} variant="secondary">Project settings</Button>
          <Button
            icon={MonitorPlay}
            onClick={() => onNavigate("teach")}
            variant="high-energy"
          >
            Teach new workflow
          </Button>
          <Button icon={Play} onClick={() => onNavigate("runs")} variant="primary">
            Run regression
          </Button>
        </div>
      </section>

      <section aria-label="Project metrics" className="metric-grid">
        {projectMetrics.map(([value, label]) => (
          <article className="metric-card" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="overview-grid" aria-label="Project activity">
        <div className="overview-grid__primary">
          <article className="panel last-run-panel">
            <div className="panel-heading">
              <h2>{hasRuns ? "Latest project run" : "No runs yet"}</h2>
              <span>{hasRuns ? `${overview.latestOutcome} · ${overview.recentRuns} recent runs` : "Teach or run a test to create history"}</span>
              {hasRuns ? <button className="text-link" onClick={() => onNavigate("runs")} type="button">Open run</button> : null}
            </div>
            {hasRuns && isPreview ? <><div
              aria-label="12 passed, 1 failed, 1 blocked"
              aria-valuemax="14"
              aria-valuemin="0"
              aria-valuenow="12"
              className="run-distribution"
              role="progressbar"
            >
              <span className="run-distribution__pass" />
              <span className="run-distribution__fail" />
              <span className="run-distribution__blocked" />
            </div>
            <div className="run-counts">
              <span aria-label="PASS — 12 passed" className="run-count run-count--pass">
                <CheckCircle2 aria-hidden="true" size={17} strokeWidth={1.9} />
                <strong>12 passed</strong>
              </span>
              <span aria-label="FAIL — 1 failed" className="run-count run-count--fail">
                <XCircle aria-hidden="true" size={17} strokeWidth={1.9} />
                <strong>1 failed</strong>
              </span>
              <span aria-label="BLOCKED — 1 blocked" className="run-count run-count--blocked">
                <PauseCircle aria-hidden="true" size={17} strokeWidth={1.9} />
                <strong>1 blocked</strong>
              </span>
            </div></> : hasRuns ? <div className="persisted-run-summary"><div aria-label={`Latest run distribution: 1 ${latestRun.outcome}`} className="run-distribution" role="img"><span className={`run-distribution__persisted run-distribution__persisted--${latestRun.outcome.toLowerCase()}`} /></div><div aria-label={`Latest run ${latestRun.id}: ${latestRun.outcome}`} className="persisted-latest-run"><strong>{latestRun.id}</strong><span>{new Date(latestRun.completedAt).toLocaleString()} · Duration not recorded</span><span className={`run-count run-count--${latestRun.outcome.toLowerCase()}`}>{latestRun.outcome} — 1</span></div><p className="panel-description">Recent outcomes: {Object.entries(overview.outcomeCounts ?? {}).map(([outcome, count]) => `${count} ${outcome}`).join(" · ")}.</p>{overview.recentRunItems?.slice(0, 3).map((run) => { const StatusIcon = statusIcon(run.outcome); return <button className="text-link" key={run.id} onClick={() => onNavigate("runs")} type="button"><StatusIcon aria-hidden="true" size={15} />{run.outcome} — {run.id} — {new Date(run.completedAt).toLocaleString()}</button>; })}</div> : <Button icon={Play} onClick={() => onNavigate("runs")} variant="primary">Run a test</Button>}
          </article>

          <article className="panel attention-panel">
            <div className="panel-heading panel-heading--simple">
              <h2>Needs your attention</h2>
              <button className="text-link" onClick={() => onNavigate("runs")} type="button">
                All results
              </button>
            </div>
            <p className="panel-description">{isPreview ? "Two items from the last run. One is an application failure, one is an automation blockage." : attentionRuns.length ? `${attentionRuns.length} recent persisted run${attentionRuns.length === 1 ? " needs" : "s need"} review.` : "No persisted failures or blockages need attention."}</p>
            {isPreview ? <div className="attention-list">
              <button
                aria-label="FAIL — Checkout — Order confirmation missing. The order was not created. POST /orders returned 500. Product: Watch. 14 min ago."
                className="attention-item attention-item--fail"
                onClick={() => onNavigate("runs")}
                type="button"
              >
                <XCircle aria-hidden="true" className="attention-state-icon" size={18} strokeWidth={1.9} />
                <span className="attention-item__copy">
                  <span className="attention-item__title-row">
                    <span className="attention-item__title">Checkout — Order confirmation missing</span>
                    <span className="attention-item__status">FAIL</span>
                  </span>
                  <span>The order was not created · POST /orders returned 500 · product = Watch</span>
                </span>
                <time dateTime="PT14M">14 min ago</time>
              </button>
              <div aria-hidden="true" className="attention-divider" />
              <button
                aria-label="BLOCKED — Product page — Add to cart not found. Veyra could not confidently locate Add to cart and needs one confirmation. 14 min ago."
                className="attention-item"
                onClick={() => onNavigate("runs")}
                type="button"
              >
                <PauseCircle aria-hidden="true" className="attention-state-icon" size={18} strokeWidth={1.9} />
                <span className="attention-item__copy">
                  <span className="attention-item__title-row">
                    <span className="attention-item__title">Product page — Add to cart not found</span>
                    <span className="attention-item__status">BLOCKED</span>
                  </span>
                  <span>Veyra could not confidently locate “Add to cart” · needs one confirmation</span>
                </span>
                <time dateTime="PT14M">14 min ago</time>
              </button>
            </div> : <div className="attention-list">{attentionRuns.slice(0, 3).map((run) => { const StatusIcon = run.outcome === "BLOCKED" ? PauseCircle : XCircle; return <button aria-label={`${run.outcome} — run ${run.id}`} className={run.outcome === "FAIL" ? "attention-item attention-item--fail" : "attention-item"} key={run.id} onClick={() => onNavigate("runs")} type="button"><StatusIcon aria-hidden="true" className="attention-state-icon" size={18} /><span className="attention-item__copy"><span className="attention-item__title-row"><span className="attention-item__title">Run {run.id}</span><span className="attention-item__status">{run.outcome}</span></span><span>{new Date(run.completedAt).toLocaleString()}</span></span></button>; })}</div>}
          </article>
        </div>

        <div className="overview-grid__secondary">
          <article className="panel modules-panel">
            <div className="panel-heading panel-heading--simple">
              <h2>Reusable modules</h2>
              <button className="text-link" onClick={() => onNavigate("modules")} type="button">
                All {overview?.modules ?? 0}
              </button>
            </div>
            {isPreview ? <div className="module-list">
              {modules.map(({ Icon, name, usage }) => (
                <button
                  aria-label={`${name}. ${usage}. Open module.`}
                  className="module-row"
                  key={name}
                  onClick={() => onNavigate("modules")}
                  type="button"
                >
                  <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                  <span>
                    <strong>{name}</strong>
                    <small>{usage}</small>
                  </span>
                  <ChevronRight aria-hidden="true" size={15} strokeWidth={2} />
                </button>
              ))}
            </div> : overview?.moduleItems?.length ? <div className="module-list">{overview.moduleItems.map((module) => <button aria-label={`${module.name}. Open module.`} className="module-row" key={module.id} onClick={() => onNavigate("modules")} type="button"><Search aria-hidden="true" size={16} /><span><strong>{module.name}</strong><small>{module.id}</small></span><ChevronRight aria-hidden="true" size={15} /></button>)}</div> : <p className="panel-description">No reusable modules yet. Teach a workflow to begin building shared behavior.</p>}
          </article>

          <article className="panel setup-panel">
            <div className="panel-heading panel-heading--simple">
              <h2>{isPreview ? "Set-up progress" : "Project ready"}</h2>
              <span>{isPreview ? "3 of 5" : project.environmentName}</span>
            </div>
            <div
              aria-label={isPreview ? "3 of 5 setup steps complete" : "Project environment configured"}
              aria-valuemax={isPreview ? "5" : "1"}
              aria-valuemin="0"
              aria-valuenow={isPreview ? "3" : "1"}
              className={isPreview ? "setup-progress" : "setup-progress setup-progress--complete"}
              role="progressbar"
            >
              <span />
            </div>
            <div className="setup-next">
              <Database aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>
                <strong>{isPreview ? "Next: add a dataset to Complete checkout" : "Next: teach your first workflow"}</strong>
                <small>{isPreview ? "Run the same flow with Laptop, Watch and Backpack." : `Veyra will use the ${project.environmentName} environment.`}</small>
              </span>
            </div>
            <Button onClick={() => onNavigate("data")}>
              {isPreview ? "Add dataset" : "Open data"}
            </Button>
          </article>

          <ControlledBrowserPanel browserBusy={browserBusy} browserError={browserError} browserRuntime={browserRuntime} browserSession={browserSession} onStartControlledBrowser={onStartControlledBrowser} onStopControlledBrowser={onStopControlledBrowser} project={project} />
        </div>
      </section>
    </div>
  );
}

function ControlledBrowserPanel({ browserBusy, browserError, browserRuntime, browserSession, onStartControlledBrowser, onStopControlledBrowser, project }) {
  const runtimeReady = browserRuntime?.status === "ready";
  const runtimeLabel = browserRuntime ? (runtimeReady ? `Compatible bundled Chromium ${browserRuntime.version}` : "Bundled Chromium unavailable") : "Checking bundled Chromium…";
  return (
    <article className="panel browser-panel">
      <div className="panel-heading panel-heading--simple">
        <h2>Controlled browser</h2>
        <span>{browserSession ? "Running" : runtimeReady ? "Ready" : browserRuntime ? "Unavailable" : "Checking"}</span>
      </div>
      <p className="panel-description">
        {browserSession ? `${browserSession.browserEngine} ${browserSession.browserVersion} · ${browserSession.environmentName}` : `${runtimeLabel} · Open ${project.environmentName} in a Veyra-controlled window.`}
      </p>
      {browserError ? <p className="browser-panel__error" role="alert">{browserError}</p> : null}
      {browserSession ? (
        <div className="browser-session" aria-label="Controlled browser session metadata">
          <span>{browserSession.url}</span>
          <small>Started {new Date(browserSession.launchedAt).toLocaleTimeString()}</small>
        </div>
      ) : null}
      <div className="browser-panel__actions">
        <Button disabled={browserBusy || Boolean(browserSession) || !runtimeReady} icon={MonitorPlay} onClick={onStartControlledBrowser} variant="primary">
          {browserBusy && !browserSession ? "Starting..." : "Start browser"}
        </Button>
        <Button disabled={browserBusy || !browserSession} icon={StopCircle} onClick={onStopControlledBrowser} variant="secondary">
          Stop
        </Button>
      </div>
    </article>
  );
}
