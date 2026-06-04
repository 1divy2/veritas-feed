"""
VERITAS//FEED Python SDK
========================
Official Python client for the VERITAS Intelligence Platform API.

Installation:
    pip install veritas-sdk

Quick Start:
    from veritas_sdk import VeritasClient

    client = VeritasClient(api_key="vf_prod_xxx", base_url="https://api.veritas.io/v2")
    investigations = client.investigations.list(status="active")
    for inv in investigations:
        print(inv.title, inv.risk_score)
"""

__version__ = "0.1.0"


class VeritasClient:
    """Main entry point for the VERITAS Platform SDK."""

    def __init__(self, api_key: str, base_url: str = "https://api.veritas.io/v2"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.investigations = InvestigationResource(self)
        self.narratives = NarrativeResource(self)
        self.sources = SourceResource(self)
        self.events = EventResource(self)

    def _headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "X-SDK-Version": __version__,
        }

    def _request(self, method: str, path: str, **kwargs) -> dict:
        """Placeholder — in production uses httpx or requests."""
        url = f"{self.base_url}{path}"
        # import httpx; return httpx.request(method, url, headers=self._headers(), **kwargs).json()
        raise NotImplementedError("HTTP transport not yet wired. Use veritas-sdk >= 1.0.0")


class _Resource:
    def __init__(self, client: VeritasClient):
        self.client = client


class InvestigationResource(_Resource):
    def list(self, status: str = "active") -> list:
        return self.client._request("GET", f"/investigations?status={status}")

    def get(self, investigation_id: str) -> dict:
        return self.client._request("GET", f"/investigations/{investigation_id}")

    def create(self, title: str, description: str) -> dict:
        return self.client._request("POST", "/investigations", json={"title": title, "description": description})


class NarrativeResource(_Resource):
    def list(self) -> list:
        return self.client._request("GET", "/narratives")

    def get(self, narrative_id: str) -> dict:
        return self.client._request("GET", f"/narratives/{narrative_id}")


class SourceResource(_Resource):
    def list(self) -> list:
        return self.client._request("GET", "/sources")


class EventResource(_Resource):
    def list_catalog(self) -> list:
        return self.client._request("GET", "/platform/events")

    def subscribe(self, event_type: str, webhook_url: str) -> dict:
        return self.client._request("POST", "/platform/events/subscribe", json={"event_type": event_type, "url": webhook_url})
