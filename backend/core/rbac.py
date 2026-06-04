from enum import Enum
from typing import List

class Role(Enum):
    OWNER = "Owner"
    ADMIN = "Administrator"
    MANAGER = "Manager"
    SENIOR_ANALYST = "Senior Analyst"
    ANALYST = "Analyst"
    RESEARCHER = "Researcher"
    VIEWER = "Viewer"

class Permission(Enum):
    MANAGE_ORG = "org:manage"
    MANAGE_BILLING = "billing:manage"
    MANAGE_USERS = "users:manage"
    CREATE_WORKSPACE = "workspace:create"
    CREATE_INVESTIGATION = "investigation:create"
    APPROVE_REPORT = "report:approve"
    CREATE_REPORT = "report:create"
    VIEW_DATA = "data:view"
    EXPORT_DATA = "data:export"
    MANAGE_API_KEYS = "api:manage"

# Granular Capability Matrix
ROLE_PERMISSIONS = {
    Role.OWNER: [p for p in Permission],
    Role.ADMIN: [p for p in Permission if p != Permission.MANAGE_BILLING],
    Role.MANAGER: [
        Permission.MANAGE_USERS, Permission.CREATE_WORKSPACE, Permission.CREATE_INVESTIGATION,
        Permission.APPROVE_REPORT, Permission.CREATE_REPORT, Permission.VIEW_DATA, Permission.EXPORT_DATA
    ],
    Role.SENIOR_ANALYST: [
        Permission.CREATE_INVESTIGATION, Permission.CREATE_REPORT, Permission.APPROVE_REPORT,
        Permission.VIEW_DATA, Permission.EXPORT_DATA
    ],
    Role.ANALYST: [
        Permission.CREATE_INVESTIGATION, Permission.CREATE_REPORT, Permission.VIEW_DATA
    ],
    Role.RESEARCHER: [
        Permission.VIEW_DATA
    ],
    Role.VIEWER: [
        Permission.VIEW_DATA
    ]
}

class RBACManager:
    @staticmethod
    def has_permission(role_str: str, permission: Permission) -> bool:
        try:
            role = Role(role_str)
            return permission in ROLE_PERMISSIONS[role]
        except ValueError:
            return False
