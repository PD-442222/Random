const statusNode = document.querySelector(".status");
const mockPanel = document.querySelector(".mock-panel");
const heroMetrics = document.querySelector(".hero-metrics");
const processTabs = document.querySelectorAll(".process-tab");
const processPanels = document.querySelectorAll(".process-panel");

function formatCurrency(value) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function updateMockPanel(lineItem) {
  if (!mockPanel || !lineItem) {
    return;
  }
  mockPanel.querySelector(
    ".mock-item-card p"
  ).textContent = `Sales Order ${lineItem.order} · Line ${lineItem.line}`;
  mockPanel.querySelector(
    ".mock-item-card h5"
  ).textContent = `${lineItem.sku} (${lineItem.material_group})`;
  mockPanel.querySelector(
    ".mock-item-card span"
  ).textContent = `${lineItem.customer} · ${lineItem.sales_org} · ${lineItem.region}`;

  const values = mockPanel.querySelectorAll(".mock-values strong");
  const variance = lineItem.actual_margin - lineItem.expected_margin;
  if (values.length >= 3) {
    values[0].textContent = formatCurrency(lineItem.expected_margin);
    values[1].textContent = formatCurrency(lineItem.actual_margin);
    values[2].textContent = formatCurrency(variance);
    values[2].classList.toggle("positive", variance >= 0);
    values[2].classList.toggle("negative", variance < 0);
  }

  const shapGrid = mockPanel.querySelector(".shap-grid");
  if (shapGrid) {
    shapGrid.innerHTML = "";
    lineItem.shap.forEach((impact) => {
      const card = document.createElement("div");
      card.className = `shap-card ${impact.direction}`;
      const sign = impact.impact > 0 ? "+" : "";
      card.innerHTML = `
        <p>${impact.feature}</p>
        <h5>${sign}${formatCurrency(impact.impact)}</h5>
        <span>${impact.note}</span>
      `;
      shapGrid.appendChild(card);
    });
  }
}

function updateHeroMetrics(payload) {
  if (!heroMetrics || !payload?.training) {
    return;
  }
  const values = heroMetrics.querySelectorAll("h3");
  if (values.length >= 3) {
    values[2].textContent = payload.training.features;
  }
}

async function hydrateDemo() {
  try {
    const response = await fetch("/api/demo");
    if (!response.ok) {
      throw new Error("API unavailable");
    }
    const payload = await response.json();
    if (statusNode) {
      statusNode.setAttribute("title", `Source: ${payload.source}`);
    }
    updateMockPanel(payload.line_items?.[0]);
    updateHeroMetrics(payload);
  } catch (error) {
    if (statusNode) {
      statusNode.textContent = "Offline";
    }
  }
}

hydrateDemo();

processTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const step = tab.dataset.step;
    processTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    processPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.stepPanel === step);
    });
  });
});
