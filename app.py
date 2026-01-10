from dataclasses import asdict, dataclass
from datetime import datetime
from flask import Flask, render_template, jsonify


@dataclass
class ShapImpact:
    feature: str
    impact: int
    direction: str
    note: str


@dataclass
class DemoLineItem:
    order: str
    line: str
    sku: str
    material_group: str
    customer: str
    sales_org: str
    plant: str
    channel: str
    region: str
    quantity: int
    net_revenue: int
    cogs: int
    expected_margin: int
    actual_margin: int
    currency: str
    shap: list[ShapImpact]


@dataclass
class DriverImpact:
    name: str
    impact: str
    sentiment: str
    detail: str


app = Flask(__name__)


DUMMY_LINE_ITEMS = [
    DemoLineItem(
        "SO-29871",
        "0010",
        "Runner Pro 2.0",
        "Performance Running",
        "FootZone Retail",
        "IN10",
        "DL01",
        "Retail",
        "East",
        420,
        824000,
        624500,
        205300,
        145500,
        "INR",
        [
            ShapImpact("Discount depth", -42000, "negative", "Festive promo at 18%"),
            ShapImpact("Freight", -23600, "negative", "Express lane surcharge"),
            ShapImpact("Channel mix", 12400, "positive", "In-store add-ons"),
            ShapImpact("Product mix", -7600, "negative", "Lower ASP size run"),
        ],
    ),
    DemoLineItem(
        "SO-29875",
        "0020",
        "Nova Sprint",
        "Athleisure",
        "UrbanFit Digital",
        "IN20",
        "MH02",
        "E-comm",
        "North",
        510,
        642800,
        442900,
        188600,
        229800,
        "INR",
        [
            ShapImpact("Premium mix", 38200, "positive", "High-ASP bundles"),
            ShapImpact("Returns", -14600, "negative", "Sizing related returns"),
            ShapImpact("Ad spend", -9200, "negative", "Higher CPC in August"),
            ShapImpact("Freight", 10400, "positive", "Regional fulfillment"),
        ],
    ),
    DemoLineItem(
        "SO-29912",
        "0030",
        "Flex Urban",
        "Lifestyle",
        "Campus Pro Store",
        "IN10",
        "KA01",
        "Distributor",
        "South",
        280,
        410200,
        295600,
        111400,
        86400,
        "INR",
        [
            ShapImpact("Channel rebates", -18600, "negative", "Distributor incentives"),
            ShapImpact("Material cost", -12800, "negative", "Rubber price spike"),
            ShapImpact("Cross-sell", 9800, "positive", "Accessory attach"),
            ShapImpact("Stockout risk", -5600, "negative", "Missed upsell"),
        ],
    ),
    DemoLineItem(
        "SO-29924",
        "0040",
        "Terra Trail",
        "Outdoor",
        "TrailBlazer Sports",
        "IN30",
        "GJ01",
        "Retail",
        "West",
        360,
        553600,
        351200,
        154800,
        187400,
        "INR",
        [
            ShapImpact("Markdown recovery", 22400, "positive", "End-of-season sell-through"),
            ShapImpact("Logistics", -11800, "negative", "Long-haul lane"),
            ShapImpact("Premium share", 18400, "positive", "Trail Pro upsell"),
            ShapImpact("Promo stacking", -7400, "negative", "Double coupons"),
        ],
    ),
]

DUMMY_DRIVERS = [
    DriverImpact("Discount depth", "-18%", "negative", "Heavy discounting in Q3 campaigns"),
    DriverImpact("Freight variance", "-12%", "negative", "Fuel price spikes on priority lanes"),
    DriverImpact("Channel mix", "+9%", "positive", "E-comm premium share lift"),
    DriverImpact("Premium share", "+14%", "positive", "Higher ASP for performance SKUs"),
]

THEMES = [
    {"title": "High freight in East", "impact": "-₹42L", "detail": "East region express lanes"},
    {"title": "Premium SKUs outperform", "impact": "+₹37L", "detail": "Performance category"},
    {"title": "Seasonal discounting spikes", "impact": "-₹28L", "detail": "Festive campaigns"},
]

TRAINING_SUMMARY = {
    "dataset": "ACDOCA Profitability Extract",
    "rows": 182_400,
    "features": 42,
    "model": "XGBoost v1.8",
    "validation": {"r2": 0.91, "mae": "₹4.2K"},
    "time_window": "FY23 Q1-Q4",
}

TRAINING_PIPELINE = [
    {
        "stage": "Ingest ACDOCA",
        "detail": "Pull profitability ledger, cost elements, and pricing conditions.",
        "output": "182,400 rows · 42 features",
    },
    {
        "stage": "Feature engineering",
        "detail": "Channel mix, freight lanes, promo depth, and material group signals.",
        "output": "Standardized feature set",
    },
    {
        "stage": "Model training",
        "detail": "XGBoost with cross-validation and bias checks.",
        "output": "R² 0.91 · MAE ₹4.2K",
    },
]

EVALUATION_SUMMARY = {
    "run_window": "Current Month",
    "line_items": len(DUMMY_LINE_ITEMS),
    "variance_total": "-₹5.9L",
    "top_drivers": ["Discount depth", "Freight variance", "Premium share"],
}

INSIGHT_SUMMARY = {
    "themes": 3,
    "actions": [
        "Renegotiate East lane freight contracts",
        "Tighten festive discount guardrails",
        "Double down on performance SKUs in North",
    ],
}


@app.route("/")
def index():
    return render_template(
        "index.html",
        generated_at=datetime.utcnow().strftime("%d %b %Y %H:%M UTC"),
        line_items=DUMMY_LINE_ITEMS,
        drivers=DUMMY_DRIVERS,
        themes=THEMES,
        training=TRAINING_SUMMARY,
        training_pipeline=TRAINING_PIPELINE,
        evaluation=EVALUATION_SUMMARY,
        insights=INSIGHT_SUMMARY,
        api_ready=True,
    )


@app.route("/api/demo")
def demo_api():
    return jsonify(
        {
            "source": "S/4HANA ACDOCA",
            "model": "xgboost_profitability_v1",
            "api_ready": True,
            "training": TRAINING_SUMMARY,
            "training_pipeline": TRAINING_PIPELINE,
            "evaluation": EVALUATION_SUMMARY,
            "insights": INSIGHT_SUMMARY,
            "line_items": [asdict(item) for item in DUMMY_LINE_ITEMS],
            "drivers": [driver.__dict__ for driver in DUMMY_DRIVERS],
            "themes": THEMES,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
