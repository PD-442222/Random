from dataclasses import dataclass
from datetime import datetime
from flask import Flask, render_template, jsonify


@dataclass
class DemoLineItem:
    order: str
    sku: str
    expected: int
    actual: int
    region: str
    channel: str


@dataclass
class DriverImpact:
    name: str
    impact: str
    sentiment: str
    detail: str


app = Flask(__name__)


DUMMY_LINE_ITEMS = [
    DemoLineItem("SO-29871", "Runner Pro 2.0", 82400, 71500, "East", "Retail"),
    DemoLineItem("SO-29875", "Nova Sprint", 64200, 72980, "North", "E-comm"),
    DemoLineItem("SO-29912", "Flex Urban", 41000, 35500, "South", "Distributor"),
    DemoLineItem("SO-29924", "Terra Trail", 55300, 59870, "West", "Retail"),
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


@app.route("/")
def index():
    return render_template(
        "index.html",
        generated_at=datetime.utcnow().strftime("%d %b %Y %H:%M UTC"),
        line_items=DUMMY_LINE_ITEMS,
        drivers=DUMMY_DRIVERS,
        themes=THEMES,
        api_ready=True,
    )


@app.route("/api/demo")
def demo_api():
    return jsonify(
        {
            "source": "S/4HANA ACDOCA",
            "model": "xgboost_profitability_v1",
            "api_ready": True,
            "line_items": [item.__dict__ for item in DUMMY_LINE_ITEMS],
            "drivers": [driver.__dict__ for driver in DUMMY_DRIVERS],
            "themes": THEMES,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
