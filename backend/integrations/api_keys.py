import secrets
import hashlib
from typing import Tuple

class ApiKeyManager:
    """Manages generation, hashing, and validation of API keys for external integrations."""
    
    PREFIX = "vf_prod_"

    @classmethod
    def generate_key(cls) -> Tuple[str, str]:
        """
        Generates a new API key.
        Returns: (raw_key, hashed_key)
        The raw key is only shown once to the user. The hashed key is stored in the DB.
        """
        raw_secret = secrets.token_urlsafe(32)
        raw_key = f"{cls.PREFIX}{raw_secret}"
        
        # We store the SHA256 hash of the raw key
        hashed_key = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()
        
        return raw_key, hashed_key

    @classmethod
    def verify_key(cls, raw_key: str, hashed_key: str) -> bool:
        """Verifies an incoming raw API key against a stored hash."""
        incoming_hash = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()
        return secrets.compare_digest(incoming_hash, hashed_key)
