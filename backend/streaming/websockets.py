from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import logging
from backend.core.events import bus, DomainEvent

logger = logging.getLogger(__name__)

router = APIRouter()

class ConnectionManager:
    """Manages active WebSocket connections for live UI updates."""
    def __init__(self):
        # Map: tenant_id -> list of active connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, tenant_id: str):
        await websocket.accept()
        if tenant_id not in self.active_connections:
            self.active_connections[tenant_id] = []
        self.active_connections[tenant_id].append(websocket)
        logger.info(f"WebSocket Client connected for tenant {tenant_id}")

    def disconnect(self, websocket: WebSocket, tenant_id: str):
        if tenant_id in self.active_connections:
            self.active_connections[tenant_id].remove(websocket)

    async def broadcast_to_tenant(self, tenant_id: str, message: dict):
        if tenant_id in self.active_connections:
            for connection in self.active_connections[tenant_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

# We subscribe the ConnectionManager to the global Event Bus
def handle_event_for_ws(event: DomainEvent):
    # In production, we must handle this async safely within the Fastapi event loop
    # For now, it represents the architecture: Backend Event -> WebSockets -> UI
    logger.info(f"Routing event {event.event_type} to WS manager for tenant {event.org_id}")
    
bus.subscribe(handle_event_for_ws)

@router.websocket("/ws/{tenant_id}")
async def websocket_endpoint(websocket: WebSocket, tenant_id: str):
    await manager.connect(websocket, tenant_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Most interaction goes HTTP -> EventBus -> WebSocket (unidirectional push)
    except WebSocketDisconnect:
        manager.disconnect(websocket, tenant_id)
