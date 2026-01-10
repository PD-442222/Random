const { useEffect, useMemo, useState } = React;

const tabs = [
  { id: "training", label: "Step 1 · Model training" },
  { id: "evaluation", label: "Step 2 · Evaluate performance" },
  { id: "insights", label: "Step 3 · Themes & insights" },
];

const impactClass = (value) => (value >= 0 ? "positive" : "negative");

const formatCurrency = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function App() {
  const [payload, setPayload] = useState(null);
  const [activeTab, setActiveTab] = useState("training");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/demo")
      .then((response) => {
        if (!response.ok) {
          throw new Error("API unavailable");
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setPayload(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPayload({ error: true });
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const lineItems = payload?.line_items ?? [];
  const firstLine = lineItems[0];
  const driverCards = payload?.drivers ?? [];
  const themes = payload?.themes ?? [];
  const training = payload?.training ?? {};
  const trainingPipeline = payload?.training_pipeline ?? [];
  const evaluation = payload?.evaluation ?? {};
  const insights = payload?.insights ?? {};

  const varianceValue = useMemo(() => {
    if (!firstLine) {
      return 0;
    }
    return firstLine.actual_margin - firstLine.expected_margin;
  }, [firstLine]);

  if (!payload) {
    return (
      <main className="loading-state">
        <h1>Preparing the Campus Activewear AI demo…</h1>
        <p>Connecting to the mock S/4HANA data feed.</p>
      </main>
    );
  }

  if (payload.error) {
    return (
      <main className="loading-state">
        <h1>Demo data unavailable</h1>
        <p>Please retry once the API is reachable.</p>
      </main>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="logo">
          <span className="logo-badge">CA</span>
          <div>
            <p className="logo-title">Campus Activewear</p>
            <p className="logo-sub">Profitability Insight Studio</p>
          </div>
        </div>
        <nav className="nav">
          <a href="#overview">Overview</a>
          <a href="#steps">How it works</a>
          <a href="#insights">Insights</a>
          <a href="#api">S/4HANA API</a>
        </nav>
        <div className="header-actions">
          <button className="ghost">Share</button>
          <button className="primary">Launch demo</button>
        </div>
      </header>

      <main>
        <section className="hero" id="overview">
          <div className="hero-copy">
            <div className="pill">Educational AI Experience · Campus Activewear</div>
            <h1>Show-and-tell AI profitability insights in three guided steps.</h1>
            <p>
              Turn S/4HANA ACDOCA profitability data into clear, explainable
              outcomes. This agentic UI demonstrates model training, variance
              explanations, and high-level themes with drill-down detail — all in
              a polished, client-ready experience.
            </p>
            <div className="hero-actions">
              <button className="primary">Start guided tour</button>
              <button className="secondary">View data story</button>
            </div>
            <div className="hero-metrics">
              <div>
                <h3>96%</h3>
                <p>Model explainability coverage</p>
              </div>
              <div>
                <h3>{lineItems.length}</h3>
                <p>Sales order lines analyzed</p>
              </div>
              <div>
                <h3>{training.features ?? 0}</h3>
                <p>Profitability drivers tracked</p>
              </div>
            </div>
          </div>
          <div className="hero-panel">
            <div className="panel-header">
              <h2>Agentic AI Workflow</h2>
              <span className="panel-badge">Live demo</span>
            </div>
            <div className="panel-body">
              <div className="step-card">
                <div className="step-index">1</div>
                <div>
                  <h4>Model build & training</h4>
                  <p>ACDOCA profitability signals feed an XGBoost model.</p>
                  <span className="tag">Data pipeline connected</span>
                </div>
              </div>
              <div className="step-card">
                <div className="step-index">2</div>
                <div>
                  <h4>Explain actual vs expected</h4>
                  <p>SHAP visuals highlight variance drivers per line item.</p>
                  <span className="tag">Explainability ready</span>
                </div>
              </div>
              <div className="step-card">
                <div className="step-index">3</div>
                <div>
                  <h4>Theme & drill-down insights</h4>
                  <p>Aggregate themes reveal the largest profitability impact.</p>
                  <span className="tag">Guided exploration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="steps" id="steps">
          <div className="section-title">
            <h2>Step-wise AI explainability</h2>
            <p>Each step is designed to educate and empower business users.</p>
          </div>

          <div className="process-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`process-tab ${activeTab === tab.id ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="process-panels">
            <article
              className={`step-detail process-panel ${
                activeTab === "training" ? "is-active" : ""
              }`}
            >
              <header>
                <div className="step-icon">01</div>
                <div>
                  <h3>Model building & training</h3>
                  <p>Profitability data sourced from S/4HANA ACDOCA tables.</p>
                </div>
              </header>
              <ul>
                <li>Automated feature engineering for channel, region, and product mix.</li>
                <li>Model comparison panel: XGBoost, Random Forest, Linear Baseline.</li>
                <li>Training diagnostics with fairness and bias guardrails.</li>
              </ul>
              <div className="pipeline-grid">
                {trainingPipeline.map((stage) => (
                  <div key={stage.stage} className="pipeline-card">
                    <h4>{stage.stage}</h4>
                    <p>{stage.detail}</p>
                    <span>{stage.output}</span>
                  </div>
                ))}
              </div>
              <div className="training-card">
                <div>
                  <p>Dataset</p>
                  <h4>{training.dataset}</h4>
                </div>
                <div className="training-metrics">
                  <div>
                    <span>Rows</span>
                    <strong>{Number(training.rows).toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span>Features</span>
                    <strong>{training.features}</strong>
                  </div>
                  <div>
                    <span>Validation R²</span>
                    <strong>{training.validation?.r2}</strong>
                  </div>
                  <div>
                    <span>MAE</span>
                    <strong>{training.validation?.mae}</strong>
                  </div>
                </div>
                <p className="training-window">Training window: {training.time_window}</p>
              </div>
            </article>

            <article
              className={`step-detail process-panel ${
                activeTab === "evaluation" ? "is-active" : ""
              }`}
            >
              <header>
                <div className="step-icon">02</div>
                <div>
                  <h3>Variance explanation</h3>
                  <p>Explain expected vs actual profitability per sales order.</p>
                </div>
              </header>
              <ul>
                <li>SHAP force plots show impact of discounting and freight.</li>
                <li>Hover to view each line-item variance with confidence bounds.</li>
                <li>Auto-generated narratives for planners and finance leads.</li>
              </ul>
              <div className="variance-card">
                <div>
                  <p>Evaluation run: {evaluation.run_window}</p>
                  <h4>Total variance {evaluation.variance_total}</h4>
                </div>
                <div className="variance-bars">
                  {(evaluation.top_drivers ?? []).map((driver) => (
                    <div key={driver} className="impact negative">
                      {driver}
                    </div>
                  ))}
                </div>
              </div>
              {firstLine && (
                <div className="mock-panel">
                  <div className="mock-panel-header">
                    <h4>Mock S/4HANA line-item explanation</h4>
                    <span>ACDOCA → SHAP</span>
                  </div>
                  <div className="mock-panel-body">
                    <div className="mock-item-card">
                      <div>
                        <p>
                          Sales Order {firstLine.order} · Line {firstLine.line}
                        </p>
                        <h5>
                          {firstLine.sku} ({firstLine.material_group})
                        </h5>
                        <span>
                          {firstLine.customer} · {firstLine.sales_org} · {firstLine.region}
                        </span>
                      </div>
                      <div className="mock-values">
                        <div>
                          <span>Expected margin</span>
                          <strong>{formatCurrency(firstLine.expected_margin)}</strong>
                        </div>
                        <div>
                          <span>Actual margin</span>
                          <strong>{formatCurrency(firstLine.actual_margin)}</strong>
                        </div>
                        <div>
                          <span>Variance</span>
                          <strong className={impactClass(varianceValue)}>
                            {formatCurrency(varianceValue)}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="shap-grid">
                      {(firstLine.shap ?? []).map((impact) => (
                        <div key={impact.feature} className={`shap-card ${impact.direction}`}>
                          <p>{impact.feature}</p>
                          <h5>
                            {impact.impact > 0 ? "+" : ""}
                            {formatCurrency(impact.impact)}
                          </h5>
                          <span>{impact.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>

            <article
              className={`step-detail process-panel ${
                activeTab === "insights" ? "is-active" : ""
              }`}
            >
              <header>
                <div className="step-icon">03</div>
                <div>
                  <h3>Theme aggregation & drill-down</h3>
                  <p>Translate variance patterns into actionable business themes.</p>
                </div>
              </header>
              <ul>
                <li>Cluster drivers into strategic themes with impact ranking.</li>
                <li>Filter by region, channel, or product family.</li>
                <li>Click any theme to reveal root-cause evidence.</li>
              </ul>
              <div className="theme-list">
                {themes.map((theme) => (
                  <div key={theme.title} className="theme">
                    <span>{theme.title}</span>
                    <strong>{theme.impact}</strong>
                  </div>
                ))}
              </div>
              <div className="insight-actions">
                <h4>Recommended actions</h4>
                <ul>
                  {(insights.actions ?? []).map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section className="insights" id="insights">
          <div className="section-title">
            <h2>Profitability insight workspace</h2>
            <p>Explore line items, drivers, and summaries in one collaborative canvas.</p>
          </div>
          <div className="workspace">
            <div className="workspace-column">
              <h3>Line item explorer</h3>
              <table>
                <thead>
                  <tr>
                    <th>Sales Order</th>
                    <th>Line</th>
                    <th>SKU</th>
                    <th>Expected Margin</th>
                    <th>Actual Margin</th>
                    <th>Variance</th>
                    <th>Region</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={`${item.order}-${item.line}`}>
                      <td>{item.order}</td>
                      <td>{item.line}</td>
                      <td>{item.sku}</td>
                      <td>{formatCurrency(item.expected_margin)}</td>
                      <td>{formatCurrency(item.actual_margin)}</td>
                      <td className={impactClass(item.actual_margin - item.expected_margin)}>
                        {formatCurrency(item.actual_margin - item.expected_margin)}
                      </td>
                      <td>{item.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="workspace-column">
              <h3>Driver impact matrix</h3>
              <div className="impact-grid">
                {driverCards.map((driver) => (
                  <div key={driver.name} className="impact-card">
                    <p>{driver.name}</p>
                    <h4>{driver.impact}</h4>
                    <span>{driver.detail}</span>
                  </div>
                ))}
              </div>
              <div className="callout">
                <h4>Agent summary</h4>
                <p>
                  Across Q3, excess freight in East and discount-heavy campaigns caused 62% of
                  negative variance. Premium catalog performance offset 38% of the decline.
                </p>
                <p className="timestamp">Generated {new Date().toUTCString()}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="api" id="api">
          <div className="section-title">
            <h2>Ready for S/4HANA API integration</h2>
            <p>Use dummy data today. Swap in live ACDOCA endpoints when available.</p>
          </div>
          <div className="api-panel">
            <div>
              <h3>Connection status</h3>
              <p className="status online">Sandbox connected</p>
              <p className="description">
                The demo currently reads mock data from a local adapter. Configure the connection
                string to point at your S/4HANA environment when ready.
              </p>
              <button className="secondary">Configure endpoints</button>
            </div>
            <div className="code-block">
              <pre>{`GET /sap/opu/odata/sap/ACDOCA_PROFITABILITY
Headers:
  x-api-key: {campus_activewear_key}
  client: 100
  region: IN`}</pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>Campus Activewear Ltd.</strong>
          <p>AI explainability studio for profitability excellence.</p>
        </div>
        <div className="footer-actions">
          <button className="ghost">Download report</button>
          <button className="primary">Book walkthrough</button>
        </div>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
