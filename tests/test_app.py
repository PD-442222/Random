from app import app


def test_index_route():
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    assert b"Campus Activewear" in response.data


def test_demo_api():
    client = app.test_client()
    response = client.get("/api/demo")
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["source"] == "S/4HANA ACDOCA"
    assert payload["api_ready"] is True
    assert payload["training"]["dataset"] == "ACDOCA Profitability Extract"
    assert len(payload["line_items"]) >= 1
    assert payload["line_items"][0]["shap"]
