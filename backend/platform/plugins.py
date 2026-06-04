"""
platform/plugins.py
====================
Plugin Architecture for the VERITAS Intelligence Operating System.

Allows independent modules to extend platform capabilities without
modifying core services. Plugins register themselves at startup and
are discoverable via the PluginRegistry.

Supported plugin types:
  - NarrativeDetector: Custom clustering / trend detection algorithms
  - SourceConnector:   New external data source integrations
  - AnalyticsEngine:   Custom analytical projections
  - ReportGenerator:   Custom output format generators
  - SearchProvider:    Alternative search index backends
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class PluginBase(ABC):
    """Base class for all VERITAS platform plugins."""

    @property
    @abstractmethod
    def plugin_id(self) -> str:
        """Globally unique identifier (e.g., 'com.acme.narrative-bert-v2')."""
        pass

    @property
    @abstractmethod
    def plugin_type(self) -> str:
        """One of: NarrativeDetector, SourceConnector, AnalyticsEngine, ReportGenerator, SearchProvider."""
        pass

    @property
    def version(self) -> str:
        return "1.0.0"

    @property
    def description(self) -> str:
        return ""

    @abstractmethod
    def initialize(self, config: Dict[str, Any]) -> None:
        """Called once when the plugin is loaded."""
        pass

    @abstractmethod
    def execute(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Primary execution entrypoint. Context varies by plugin type."""
        pass

    def teardown(self) -> None:
        """Called when the plugin is unloaded. Override for cleanup."""
        pass


class PluginRegistry:
    """
    Central registry for all installed plugins.
    In production, this would scan a directory or query a database
    for plugin manifests. For now it's an in-memory store.
    """

    def __init__(self):
        self._plugins: Dict[str, PluginBase] = {}

    def register(self, plugin: PluginBase) -> None:
        if plugin.plugin_id in self._plugins:
            raise ValueError(f"Plugin '{plugin.plugin_id}' is already registered.")
        self._plugins[plugin.plugin_id] = plugin
        logger.info(f"[PLUGIN_REGISTRY] Registered: {plugin.plugin_id} ({plugin.plugin_type} v{plugin.version})")

    def unregister(self, plugin_id: str) -> None:
        plugin = self._plugins.pop(plugin_id, None)
        if plugin:
            plugin.teardown()
            logger.info(f"[PLUGIN_REGISTRY] Unregistered: {plugin_id}")

    def get(self, plugin_id: str) -> Optional[PluginBase]:
        return self._plugins.get(plugin_id)

    def list_by_type(self, plugin_type: str) -> List[PluginBase]:
        return [p for p in self._plugins.values() if p.plugin_type == plugin_type]

    def list_all(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": p.plugin_id,
                "type": p.plugin_type,
                "version": p.version,
                "description": p.description,
            }
            for p in self._plugins.values()
        ]


# Global singleton
registry = PluginRegistry()
