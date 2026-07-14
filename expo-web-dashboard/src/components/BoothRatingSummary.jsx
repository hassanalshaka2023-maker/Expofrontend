/* ==========================================================================
 * BoothRatingSummary — compact, read-only display of the aggregate visitor
 * ratings for a booth (average stars + count). Shown to the booth owner
 * (Investor) and the Admin so they can see how visitors rated the booth.
 *
 * Ratings are collected anonymously from the public mobile visitor map; here we
 * only READ the aggregate (ratingSum / ratingCount) that GET /booths returns.
 * Dark-theme, self-contained inline styles so it drops into either dashboard.
 * ======================================================================== */

export default function BoothRatingSummary({ ratingSum = 0, ratingCount = 0 }) {
  const count = Number(ratingCount) || 0;
  const sum = Number(ratingSum) || 0;
  const avg = count ? sum / count : 0;
  const filled = Math.round(avg);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        padding: 16,
        border: "1px solid rgba(227,160,79,0.24)",
        borderRadius: 16,
        background:
          "linear-gradient(145deg, rgba(40,30,12,0.34), rgba(3,17,30,0.5))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <span
          style={{
            color: "rgba(227,160,79,0.72)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Visitor Ratings
        </span>
        <span style={{ fontSize: 10, color: "rgba(183,198,216,0.5)" }}>
          {count
            ? `${count.toLocaleString("en-US")} rating${count > 1 ? "s" : ""}`
            : "No ratings yet"}
        </span>
      </div>

      <div
        style={{
          marginTop: 11,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          aria-hidden="true"
          style={{ fontSize: 22, letterSpacing: 2, lineHeight: 1 }}
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              style={{ color: s <= filled ? "#e5a83a" : "rgba(255,255,255,0.16)" }}
            >
              ★
            </span>
          ))}
        </span>

        <strong
          style={{
            color: "#fff",
            fontSize: 24,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {count ? avg.toFixed(1) : "—"}
        </strong>
        <span style={{ color: "rgba(183,198,216,0.5)", fontSize: 11 }}>/ 5</span>
      </div>
    </div>
  );
}
