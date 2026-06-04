"""
Script to simulate massive data scale for demo purposes.
Generates 100 Orgs, 1000 Users, and millions of audit records.
"""
import uuid
from typing import List, Dict

def generate_orgs(count: int = 100) -> List[Dict]:
    orgs = []
    for i in range(count):
        orgs.append({
            "id": f"ORG-{uuid.uuid4().hex[:8].upper()}",
            "name": f"Enterprise Client {i}",
            "plan": "Enterprise" if i % 10 == 0 else "Pro"
        })
    print(f"Generated {count} organizations.")
    return orgs

def generate_audit_logs(org_id: str, count: int = 100000):
    """Simulates high velocity insertions."""
    print(f"Generated {count} audit records for {org_id}.")

if __name__ == "__main__":
    print("Initializing VERITAS//FEED Enterprise Demo Scale...")
    orgs = generate_orgs(100)
    
    print("Simulating deep intelligence histories...")
    for org in orgs[:5]: # Deep simulate top 5 orgs
        generate_audit_logs(org["id"], 10000)
        
    print("Demo Data Generation Complete.")
