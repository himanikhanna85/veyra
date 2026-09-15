import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Database,
  Layers3,
  LayoutGrid,
  LockKeyhole,
  MonitorPlay,
  Search,
  Settings,
} from "lucide-react";
import veyraMark from "../assets/brand/veyra-tr-icon.png";
import veyraWordmark from "../assets/brand/veyra-wordmark-light.png";
import { CommandSearch } from "./CommandSearch.jsx";

const primaryNavigation = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "teach", label: "Teach", Icon: MonitorPlay },
  { id: "tests", label: "Tests", Icon: ClipboardCheck, count: 18 },
  { id: "modules", label: "Modules", Icon: Layers3, count: 7 },
  { id: "runs", label: "Runs", Icon: Clock3 },
  { id: "data", label: "Data", Icon: Database },
];

export function AppShell({ activeSection, children, onNavigate, pageTitle }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchTriggerRef = useRef(null);

  useEffect(() => {
    function openSearch(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, []);

  function closeSearch() {
    setSearchOpen(false);
    window.requestAnimationFrame(() => searchTriggerRef.current?.focus());
  }

  function navigate(section) {
    setProjectOpen(false);
    setNotificationsOpen(false);
    onNavigate(section);
  }

  function selectSearchResult(section) {
    setSearchOpen(false);
    navigate(section);
    window.requestAnimationFrame(() => searchTriggerRef.current?.focus());
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <aside aria-label="Veyra workspace" className="sidebar">
        <div aria-label="Veyra" className="brand-lockup" role="img">
          <span aria-hidden="true" className="brand-mark">
            <img alt="" src={veyraMark} />
          </span>
          <img alt="" className="brand-wordmark" src={veyraWordmark} />
        </div>

        <div className="project-switcher-wrap">
          <button
            aria-expanded={projectOpen}
            aria-haspopup="menu"
            className="project-switcher"
            onClick={() => setProjectOpen((value) => !value)}
            type="button"
          >
            <span aria-hidden="true" className="project-initials">
              CS
            </span>
            <span>Commerce Storefront</span>
            <ChevronDown aria-hidden="true" size={14} strokeWidth={2} />
          </button>
          {projectOpen ? (
            <div className="project-menu" role="menu" aria-label="Projects">
              <button role="menuitem" type="button">
                <span>Commerce Storefront</span>
                <span className="project-menu__current">Current</span>
              </button>
              <button role="menuitem" type="button">
                Create project
              </button>
            </div>
          ) : null}
        </div>

        <nav aria-label="Primary" className="primary-nav">
          {primaryNavigation.map(({ Icon, count, id, label }) => (
            <button
              aria-current={id === activeSection ? "page" : undefined}
              className="nav-item"
              key={id}
              onClick={() => navigate(id)}
              type="button"
            >
              <span aria-hidden="true" className="nav-item__rail" />
              <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {count ? <span className="nav-item__count">{count}</span> : null}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="utility-nav-item" type="button">
            <Settings aria-hidden="true" size={17} strokeWidth={1.8} />
            <span>Settings</span>
          </button>
          <button className="utility-nav-item" type="button">
            <CircleHelp aria-hidden="true" size={17} strokeWidth={1.8} />
            <span>Help</span>
          </button>
          <button className="profile-summary" type="button">
            <span aria-hidden="true" className="avatar avatar--blue">
              HK
            </span>
            <span className="profile-summary__copy">
              <strong>Himani Khanna</strong>
              <small>QA lead</small>
            </span>
            <ChevronRight aria-hidden="true" size={14} strokeWidth={1.8} />
          </button>
        </div>
      </aside>

      <div className="app-workspace">
        <header className="app-header">
          <div aria-label="Breadcrumb" className="breadcrumbs">
            <span>Commerce Storefront</span>
            <ChevronRight aria-hidden="true" size={14} strokeWidth={2} />
            <strong>{pageTitle}</strong>
          </div>

          <button
            aria-label="Search tests, modules, runs"
            className="global-search"
            onClick={() => setSearchOpen(true)}
            ref={searchTriggerRef}
            type="button"
          >
            <Search aria-hidden="true" size={15} strokeWidth={1.8} />
            <span>Search tests, modules, runs</span>
            <kbd>⌘K</kbd>
          </button>

          <div className="header-actions">
            <span className="context-pill">
              <span aria-hidden="true" className="context-pill__dot" />
              Staging
            </span>
            <span className="context-pill context-pill--local">
              <LockKeyhole aria-hidden="true" size={13} strokeWidth={1.9} />
              Runs locally
            </span>
            <div className="header-popover-wrap">
              <button
                aria-expanded={notificationsOpen}
                aria-label="Notifications, 2 unread"
                className="icon-button"
                onClick={() => setNotificationsOpen((value) => !value)}
                type="button"
              >
                <Bell aria-hidden="true" size={16} strokeWidth={1.8} />
                <span aria-hidden="true" className="notification-dot" />
              </button>
              {notificationsOpen ? (
                <section className="notification-popover" aria-label="Notifications">
                  <strong>Needs your attention</strong>
                  <p>One failed test and one blockage from the latest run.</p>
                  <button onClick={() => navigate("runs")} type="button">
                    Review latest run
                  </button>
                </section>
              ) : null}
            </div>
            <button aria-label="Open profile" className="avatar avatar--ink" type="button">
              HK
            </button>
          </div>
        </header>

        <main id="main-content" tabIndex="-1">
          {children}
        </main>
      </div>

      {searchOpen ? (
        <CommandSearch onClose={closeSearch} onSelect={selectSearchResult} />
      ) : null}
    </div>
  );
}
