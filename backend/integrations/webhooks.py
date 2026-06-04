import hmac
import hashlib
import json
import logging
import requests
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class WebhookDispatcher:
    """Dispatches webhooks to registered tenant URLs with cryptographic signatures."""
    
    @staticmethod
    def generate_signature(payload: str, secret: str) -> str:
        """Generate HMAC SHA256 signature for the payload."""
        return hmac.new(
            key=secret.encode("utf-8"),
            msg=payload.encode("utf-8"),
            digestmod=hashlib.sha256
        ).hexdigest()

    def dispatch(self, event_type: str, payload_data: Dict[str, Any], webhooks: List[Any]):
        """
        Dispatch an event to a list of Webhook database objects.
        """
        payload = json.dumps({"event": event_type, "data": payload_data})
        
        for hook in webhooks:
            if event_type not in hook.events:
                continue
                
            signature = self.generate_signature(payload, hook.secret)
            headers = {
                "Content-Type": "application/json",
                "X-Veritas-Signature": signature,
                "X-Veritas-Event": event_type
            }
            
            try:
                # In production, dispatch via Celery/Redis queue instead of blocking
                response = requests.post(hook.url, data=payload, headers=headers, timeout=5)
                logger.info(f"Webhook {event_type} delivered to {hook.url} - Status: {response.status_code}")
            except Exception as e:
                logger.error(f"Webhook delivery failed for {hook.url}: {str(e)}")
