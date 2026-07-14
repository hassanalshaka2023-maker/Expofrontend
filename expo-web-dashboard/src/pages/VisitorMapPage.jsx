/* ==========================================================================
 * VisitorMapPage — the PUBLIC, read-only exhibition map opened from the Visitor
 * QR code. It:
 *   - opens with NO login (Admin or Investor),
 *   - loads the real booths from the public GET /booths endpoint,
 *   - renders the SAME SharedExhibitionScene that Admin and Investor use,
 *   - shows only visitor-safe information (booth number, status, public company
 *     name / category / description) — never admin controls, reservation tools,
 *     internal notes, employee/attendance data or tokens.
 *
 * Route: /visitor/map  (and /visitor/map/:exhibitionId — this app has a single
 * implicit exhibition served globally by GET /booths, so the id is optional and
 * only informational; no fake id is invented).
 * ======================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X, MapPin, RefreshCw, WifiOff, Info } from "lucide-react";
import { webApi } from "../services/api";
import SharedExhibitionScene from "../components/exhibition/SharedExhibitionScene";

const EXHIBITION_NAME = "HOPEX EXPO";

const STATUS_META = {
  Available: { label: "Available", color: "#0f8f80", bg: "rgba(23,184,166,0.12)" },
  Pending: { label: "Reserved (pending)", color: "#a5721c", bg: "rgba(213,154,60,0.14)" },
  Reserved: { label: "Reserved", color: "#a34a41", bg: "rgba(192,91,82,0.14)" },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Available;
  return (
    <span
      className="v-status-pill"
      style={{ color: meta.color, background: meta.bg, borderColor: meta.color + "55" }}
    >
      {meta.label}
    </span>
  );
}

export default function VisitorMapPage() {
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { kind, message }
  const [selected, setSelected] = useState(null); // { boothId, status, companyDetails }
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const sceneRef = useRef(null);

  const applyResult = useCallback((data) => {
    const list = Array.isArray(data) ? data : [];
    setBooths(list);
    setError(
      list.length === 0
        ? { kind: "empty", message: "This exhibition has no booths to show yet." }
        : null
    );
  }, []);

  const applyError = useCallback((err) => {
    // Friendly, visitor-safe messages — never a stack trace.
    let kind = "server";
    let message = "Unable to load the exhibition map.";
    if (err?.code === "ECONNABORTED") {
      kind = "timeout";
      message = "The map is taking too long to load. Check your connection and try again.";
    } else if (!err?.response) {
      kind = "network";
      message = "Can't reach the exhibition server. Check your connection and try again.";
    }
    // Log once for development diagnostics; no repeated/looping requests.
    if (import.meta.env.DEV) console.warn("[VisitorMap] load failed:", err?.message || err);
    setError({ kind, message });
  }, []);

  // Retry handler (event-driven — may set state synchronously).
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      applyResult(await webApi.getBooths());
    } catch (err) {
      applyError(err);
    } finally {
      setLoading(false);
    }
  }, [applyResult, applyError]);

  // Initial load: only touch state AFTER the request resolves (no synchronous
  // setState on mount) and ignore the result if the component unmounted.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await webApi.getBooths();
        if (active) applyResult(data);
      } catch (err) {
        if (active) applyError(err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [applyResult, applyError]);

  const handleSelectBooth = useCallback((info) => {
    setSelected(info);
    setSearchOpen(false);
    setQuery("");
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return booths
      .filter((b) => {
        const name = b?.companyDetails?.companyName?.toLowerCase() || "";
        const cat = b?.companyDetails?.category?.toLowerCase() || "";
        return (
          String(b.boothId).toLowerCase().includes(q) ||
          name.includes(q) ||
          cat.includes(q)
        );
      })
      .slice(0, 6);
  }, [query, booths]);

  const selectFromSearch = (booth) => {
    handleSelectBooth({
      boothId: booth.boothId,
      status: booth.status,
      companyDetails: booth.companyDetails,
    });
  };

  const details = selected?.companyDetails || {};
  const showCompany = selected && selected.status !== "Available" && details.companyName;

  return (
    <div className="visitor-map-page" dir="ltr">
      {/* ── The shared 3D scene (identical to Admin & Investor) ── */}
      {!loading && !error && (
        <div className="visitor-scene">
          <SharedExhibitionScene
            ref={sceneRef}
            mode="visitor"
            booths={booths}
            exhibitionName={EXHIBITION_NAME}
            selectedBoothId={selected?.boothId || null}
            onSelectBooth={handleSelectBooth}
          />
        </div>
      )}

      {/* ── Top bar: brand + name + public search ── */}
      <header className="visitor-topbar">
        <div className="visitor-brand">
          <span className="visitor-logo">H</span>
          <div>
            <strong>{EXHIBITION_NAME}</strong>
            <small>Interactive exhibition map</small>
          </div>
        </div>

        {!loading && !error && (
          <div className="visitor-search">
            <Search size={16} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search booth or company…"
              aria-label="Search booths or companies"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
            {searchOpen && searchResults.length > 0 && (
              <ul className="visitor-search-results">
                {searchResults.map((b) => {
                  const name = b?.companyDetails?.companyName;
                  const isAvail = b.status === "Available";
                  return (
                    <li key={b.boothId}>
                      <button type="button" onClick={() => selectFromSearch(b)}>
                        <span className="vsr-id">{b.boothId}</span>
                        <span className="vsr-name">
                          {isAvail ? "Available booth" : name || "Reserved booth"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </header>

      {/* ── Loading ── */}
      {loading && (
        <div className="visitor-state">
          <div className="visitor-spinner" />
          <h2>Loading the exhibition map…</h2>
          <p>Fetching the latest booths and layout.</p>
        </div>
      )}

      {/* ── Error / empty ── */}
      {!loading && error && (
        <div className="visitor-state">
          <div className="visitor-state-icon">
            {error.kind === "empty" ? <Info size={30} /> : <WifiOff size={30} />}
          </div>
          <h2>
            {error.kind === "empty" ? "No booths to display" : "Couldn't load the map"}
          </h2>
          <p>{error.message}</p>
          {error.kind !== "empty" && (
            <button type="button" className="visitor-retry" onClick={load}>
              <RefreshCw size={16} />
              Try again
            </button>
          )}
        </div>
      )}

      {/* ── Booth bottom sheet (mobile) / floating card (desktop) ── */}
      {selected && !loading && !error && (
        <div className="visitor-sheet" role="dialog" aria-label={`Booth ${selected.boothId}`}>
          <button
            type="button"
            className="visitor-sheet-close"
            onClick={() => setSelected(null)}
            aria-label="Close booth details"
          >
            <X size={18} />
          </button>

          <div className="visitor-sheet-head">
            <span className="visitor-sheet-booth">
              <MapPin size={16} /> Booth {selected.boothId}
            </span>
            <StatusPill status={selected.status} />
          </div>

          {showCompany ? (
            <div className="visitor-sheet-body">
              <div className="vsb-company">
                <span className="vsb-avatar">{details.companyName.charAt(0).toUpperCase()}</span>
                <div>
                  <small>Exhibitor</small>
                  <strong>{details.companyName}</strong>
                </div>
              </div>
              {details.category && (
                <div className="vsb-row">
                  <small>Category</small>
                  <span>{details.category}</span>
                </div>
              )}
              {details.description && (
                <div className="vsb-row">
                  <small>About</small>
                  <p>{details.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="visitor-sheet-body">
              <p className="vsb-available">
                This booth is currently available. Come back soon to see which company joins the
                exhibition here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Hint (only with a loaded scene, hidden once a booth is open) ── */}
      {!loading && !error && !selected && (
        <div className="visitor-hint">Drag to look around · pinch to zoom · tap a booth</div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        .visitor-map-page {
          position: fixed;
          inset: 0;
          overflow: hidden;
          background: #cfe6f4;
          font-family: Inter, system-ui, -apple-system, sans-serif;
          color: #1f3346;
        }
        .visitor-scene { position: absolute; inset: 0; }

        .visitor-topbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px;
          background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0));
        }
        .visitor-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .visitor-logo {
          display: grid; place-items: center;
          width: 40px; height: 40px; flex: 0 0 auto;
          border-radius: 12px;
          background: linear-gradient(140deg, #25b6bd, #128a90);
          color: #fff; font-weight: 900; font-size: 20px;
          box-shadow: 0 6px 16px rgba(18,138,144,0.32);
        }
        .visitor-brand strong { display: block; font-size: 15px; color: #14303f; line-height: 1.1; }
        .visitor-brand small { font-size: 11px; color: #5b7180; }

        .visitor-search {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          width: min(320px, 52vw);
          padding: 0 12px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(28,52,74,0.12);
          box-shadow: 0 6px 18px rgba(30,50,60,0.12);
          color: #3a5566;
        }
        .visitor-search input {
          flex: 1; min-width: 0;
          border: 0; outline: 0; background: transparent;
          font-size: 13px; color: #1f3346;
        }
        .visitor-search input::placeholder { color: #93a6b2; }
        .visitor-search button { display: grid; place-items: center; color: #7a8f9b; background: none; border: 0; }
        .visitor-search-results {
          position: absolute;
          top: calc(100% + 6px); left: 0; right: 0;
          margin: 0; padding: 6px;
          list-style: none;
          background: #fff;
          border: 1px solid rgba(28,52,74,0.12);
          border-radius: 12px;
          box-shadow: 0 14px 30px rgba(30,50,60,0.2);
          max-height: 260px; overflow-y: auto;
        }
        .visitor-search-results button {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 9px 10px;
          background: none; border: 0; border-radius: 8px;
          text-align: left; color: #1f3346;
        }
        .visitor-search-results button:hover { background: rgba(37,182,189,0.1); }
        .vsr-id {
          flex: 0 0 auto;
          font-weight: 800; font-size: 12px; color: #128a90;
          background: rgba(37,182,189,0.12);
          padding: 2px 8px; border-radius: 6px;
        }
        .vsr-name { font-size: 13px; color: #41556a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .visitor-state {
          position: absolute; inset: 0; z-index: 30;
          display: grid; place-content: center; justify-items: center;
          gap: 8px; padding: 24px; text-align: center;
          background: radial-gradient(circle at 50% 35%, #eaf5fb, #cfe6f4);
        }
        .visitor-state h2 { margin: 6px 0 0; font-size: 19px; color: #16303f; }
        .visitor-state p { margin: 0; max-width: 340px; font-size: 13px; color: #5b7180; line-height: 1.6; }
        .visitor-state-icon {
          display: grid; place-items: center;
          width: 68px; height: 68px; border-radius: 20px;
          color: #a34a41; background: rgba(192,91,82,0.12);
          border: 1px solid rgba(192,91,82,0.3);
        }
        .visitor-spinner {
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 4px solid rgba(37,182,189,0.25);
          border-top-color: #25b6bd;
          animation: vspin 0.9s linear infinite;
        }
        @keyframes vspin { to { transform: rotate(360deg); } }
        .visitor-retry {
          margin-top: 10px;
          display: inline-flex; align-items: center; gap: 8px;
          min-height: 44px; padding: 0 20px;
          border-radius: 12px; border: 0;
          background: linear-gradient(140deg, #25b6bd, #128a90);
          color: #fff; font-weight: 700; font-size: 13px;
          box-shadow: 0 8px 20px rgba(18,138,144,0.3);
        }

        .visitor-hint {
          position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%);
          z-index: 6;
          padding: 8px 14px; border-radius: 999px;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(28,52,74,0.1);
          color: #4a6270; font-size: 11.5px; font-weight: 600;
          box-shadow: 0 6px 16px rgba(30,50,60,0.14);
          white-space: nowrap;
        }

        .visitor-sheet {
          position: absolute; z-index: 25;
          right: 16px; bottom: 16px; width: 380px; max-width: calc(100vw - 32px);
          padding: 18px;
          border-radius: 18px;
          background: rgba(255,255,255,0.98);
          border: 1px solid rgba(28,52,74,0.12);
          box-shadow: 0 18px 44px rgba(30,50,60,0.26);
          animation: vsheet-in 0.22s ease;
        }
        @keyframes vsheet-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .visitor-sheet-close {
          position: absolute; top: 12px; right: 12px;
          display: grid; place-items: center;
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid rgba(28,52,74,0.12);
          background: #fff; color: #5b7180;
        }
        .visitor-sheet-head { display: flex; align-items: center; gap: 10px; padding-right: 40px; }
        .visitor-sheet-booth {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 16px; font-weight: 800; color: #16303f;
        }
        .v-status-pill {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 999px;
          border: 1px solid; font-size: 10px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .visitor-sheet-body { margin-top: 14px; display: flex; flex-direction: column; gap: 12px; }
        .vsb-company { display: flex; align-items: center; gap: 12px; }
        .vsb-avatar {
          display: grid; place-items: center;
          width: 46px; height: 46px; flex: 0 0 auto;
          border-radius: 13px;
          background: linear-gradient(140deg, #25b6bd, #128a90);
          color: #fff; font-weight: 800; font-size: 20px;
        }
        .vsb-company small, .vsb-row small {
          display: block; font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; color: #8aa0ac;
        }
        .vsb-company strong { font-size: 16px; color: #16303f; }
        .vsb-row { padding: 10px 12px; border-radius: 11px; background: rgba(37,182,189,0.06); border: 1px solid rgba(37,182,189,0.14); }
        .vsb-row span { font-size: 13px; color: #33485a; font-weight: 600; }
        .vsb-row p { margin: 4px 0 0; font-size: 13px; color: #41556a; line-height: 1.6; }
        .vsb-available { margin: 0; font-size: 13px; color: #41556a; line-height: 1.6; }

        @media (max-width: 640px) {
          .visitor-topbar { flex-direction: column; align-items: stretch; gap: 10px; padding: 10px 12px; }
          .visitor-brand { justify-content: flex-start; }
          .visitor-search { width: 100%; }
          .visitor-sheet {
            left: 0; right: 0; bottom: 0; width: 100%; max-width: 100%;
            border-radius: 20px 20px 0 0;
            padding: 18px 18px calc(18px + env(safe-area-inset-bottom, 0px));
          }
          .visitor-hint { bottom: unset; top: 118px; font-size: 11px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .visitor-spinner { animation-duration: 0.001ms; }
          .visitor-sheet { animation: none; }
        }
      `}</style>
    </div>
  );
}
