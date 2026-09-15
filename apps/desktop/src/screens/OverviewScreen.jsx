import {
  CheckCircle2,
  ChevronRight,
  Database,
  LogIn,
  MonitorPlay,
  PauseCircle,
  Play,
  Search,
  ShoppingCart,
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

export function OverviewScreen({ onNavigate }) {
  return (
    <div className="overview-screen">
      <section className="overview-hero" aria-labelledby="overview-title">
        <div>
          <div className="eyebrow-row">
            <span>Commerce Storefront</span>
            <span aria-hidden="true" className="eyebrow-divider" />
            <span>Staging</span>
          </div>
          <h1 id="overview-title">Good morning, Himani</h1>
          <p>What should Veyra validate today?</p>
        </div>
        <div className="overview-hero__actions">
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
        {metrics.map(([value, label]) => (
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
              <h2>Last run — Nightly regression</h2>
              <span>14 min ago · 6 min 22 sec</span>
              <button className="text-link" onClick={() => onNavigate("runs")} type="button">
                Open run
              </button>
            </div>
            <div
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
            </div>
          </article>

          <article className="panel attention-panel">
            <div className="panel-heading panel-heading--simple">
              <h2>Needs your attention</h2>
              <button className="text-link" onClick={() => onNavigate("runs")} type="button">
                All results
              </button>
            </div>
            <p className="panel-description">
              Two items from the last run. One is an application failure, one is an
              automation blockage.
            </p>
            <div className="attention-list">
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
            </div>
          </article>
        </div>

        <div className="overview-grid__secondary">
          <article className="panel modules-panel">
            <div className="panel-heading panel-heading--simple">
              <h2>Reusable modules</h2>
              <button className="text-link" onClick={() => onNavigate("modules")} type="button">
                All 7
              </button>
            </div>
            <div className="module-list">
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
            </div>
          </article>

          <article className="panel setup-panel">
            <div className="panel-heading panel-heading--simple">
              <h2>Set-up progress</h2>
              <span>3 of 5</span>
            </div>
            <div
              aria-label="3 of 5 setup steps complete"
              aria-valuemax="5"
              aria-valuemin="0"
              aria-valuenow="3"
              className="setup-progress"
              role="progressbar"
            >
              <span />
            </div>
            <div className="setup-next">
              <Database aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>
                <strong>Next: add a dataset to Complete checkout</strong>
                <small>Run the same flow with Laptop, Watch and Backpack.</small>
              </span>
            </div>
            <Button onClick={() => onNavigate("data")}>
              Add dataset
            </Button>
          </article>
        </div>
      </section>
    </div>
  );
}
