import { collection, doc, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { db } from "./firebase";
export { db };

// -- TYPES --

export interface CaseData {
  id?: string;
  title: string;
  status: "Open" | "In Progress" | "Closed" | "Escalated";
  priority: "Low" | "Medium" | "High" | "Critical";
  assignee: string;
  summary: string;
  createdAt: number;
  updatedAt: number;
}

export interface TaskData {
  id?: string;
  title: string;
  status: "Open" | "In Progress" | "Blocked" | "Completed";
  assignee: string;
  target: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  dueDate: string;
  createdAt: number;
}

export interface ClaimData {
  id?: string;
  time: string;
  source: string;
  entity: string;
  text: string;
  level: "medium" | "high" | "critical";
  timestamp: number;
}

export interface WatchlistData {
  id?: string;
  type: string;
  name: string;
  lastActive: string;
  riskTrend: string;
  createdAt: number;
}

export interface NarrativeData {
  id?: string;
  title: string;
  activeClaims: number;
  sources: number;
  riskScore: number;
  velocity: string;
  createdAt: number;
}

export interface AuditLogData {
  id?: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  changes: string;
  createdAt: number;
}

export interface SourceData {
  id?: string;
  handle: string;
  platform: string;
  riskScore: number;
  lastScraped: string;
  credibility: "low" | "medium" | "high";
  createdAt: number;
}

export interface UserData {
  id?: string;
  email: string;
  role: string;
  status: "active" | "suspended";
  lastLogin: string;
  createdAt: number;
}

export interface ExperimentData {
  id?: string;
  title: string;
  status: string;
  highlight?: boolean;
  createdAt: number;
}

export interface KnowledgeData {
  id?: string;
  title: string;
  type: string;
  author: string;
  date: string;
  createdAt: number;
}

export interface TeamMemberData {
  id?: string;
  name: string;
  role: string;
  accessLevel: string;
  mfa: boolean;
  lastActive: string;
  createdAt: number;
}

export interface TenantData {
  id?: string;
  name: string;
  tier: string;
  storage: string;
  status: string;
  createdAt: number;
}

export interface CaseStudyData {
  id?: string;
  title: string;
  tags: string[];
  summary: string;
  createdAt: number;
}

export interface ValidationItemData {
  id?: string;
  claim: string;
  modelConfidence: string;
  status: string;
  createdAt: number;
}

// -- CONVERTERS --
// Firestore data converters for type safety

export const caseConverter = {
  toFirestore(c: CaseData): DocumentData {
    return { ...c };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): CaseData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
      summary: data.summary,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as CaseData;
  }
};

export const taskConverter = {
  toFirestore(t: TaskData): DocumentData {
    return { ...t };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): TaskData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      status: data.status,
      assignee: data.assignee,
      target: data.target,
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: data.createdAt,
    } as TaskData;
  }
};

export const claimConverter = {
  toFirestore(c: ClaimData): DocumentData {
    return { ...c };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ClaimData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      time: data.time,
      source: data.source,
      entity: data.entity,
      text: data.text,
      level: data.level,
      timestamp: data.timestamp,
    } as ClaimData;
  }
};

export const watchlistConverter = {
  toFirestore(w: WatchlistData): DocumentData {
    return { ...w };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): WatchlistData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      type: data.type,
      name: data.name,
      lastActive: data.lastActive,
      riskTrend: data.riskTrend,
      createdAt: data.createdAt,
    } as WatchlistData;
  }
};

export const narrativeConverter = {
  toFirestore(n: NarrativeData): DocumentData {
    return { ...n };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): NarrativeData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      activeClaims: data.activeClaims,
      sources: data.sources,
      riskScore: data.riskScore,
      velocity: data.velocity,
      createdAt: data.createdAt,
    } as NarrativeData;
  }
};

export const auditLogConverter = {
  toFirestore(a: AuditLogData): DocumentData {
    return { ...a };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): AuditLogData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      timestamp: data.timestamp,
      actor: data.actor,
      action: data.action,
      target: data.target,
      changes: data.changes,
      createdAt: data.createdAt,
    } as AuditLogData;
  }
};

export const sourceConverter = {
  toFirestore(s: SourceData): DocumentData {
    return { ...s };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): SourceData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      handle: data.handle,
      platform: data.platform,
      riskScore: data.riskScore,
      lastScraped: data.lastScraped,
      credibility: data.credibility,
      createdAt: data.createdAt,
    } as SourceData;
  }
};

export const userConverter = {
  toFirestore(u: UserData): DocumentData {
    return { ...u };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserData {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      email: data.email,
      role: data.role,
      status: data.status,
      lastLogin: data.lastLogin,
      createdAt: data.createdAt,
    } as UserData;
  }
};

export const experimentConverter = {
  toFirestore(e: ExperimentData): DocumentData { return { ...e }; },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ExperimentData {
    const data = snapshot.data(options);
    return { id: snapshot.id, title: data.title, status: data.status, highlight: data.highlight, createdAt: data.createdAt } as ExperimentData;
  }
};

export const knowledgeConverter = {
  toFirestore(k: KnowledgeData): DocumentData { return { ...k }; },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): KnowledgeData {
    const data = snapshot.data(options);
    return { id: snapshot.id, title: data.title, type: data.type, author: data.author, date: data.date, createdAt: data.createdAt } as KnowledgeData;
  }
};

export const teamMemberConverter = {
  toFirestore(t: TeamMemberData): DocumentData { return { ...t }; },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): TeamMemberData {
    const data = snapshot.data(options);
    return { id: snapshot.id, name: data.name, role: data.role, accessLevel: data.accessLevel, mfa: data.mfa, lastActive: data.lastActive, createdAt: data.createdAt } as TeamMemberData;
  }
};

export const tenantConverter = {
  toFirestore(t: TenantData): DocumentData { return { ...t }; },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): TenantData {
    const data = snapshot.data(options);
    return { id: snapshot.id, name: data.name, tier: data.tier, storage: data.storage, status: data.status, createdAt: data.createdAt } as TenantData;
  }
};

export const caseStudyConverter = {
  toFirestore(c: CaseStudyData): DocumentData { return { ...c }; },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): CaseStudyData {
    const data = snapshot.data(options);
    return { id: snapshot.id, title: data.title, tags: data.tags || [], summary: data.summary, createdAt: data.createdAt } as CaseStudyData;
  }
};

export const validationItemConverter = {
  toFirestore(v: ValidationItemData): DocumentData { return { ...v }; },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ValidationItemData {
    const data = snapshot.data(options);
    return { id: snapshot.id, claim: data.claim, modelConfidence: data.modelConfidence, status: data.status, createdAt: data.createdAt } as ValidationItemData;
  }
};

// -- COLLECTION REFERENCES --

export const casesRef = collection(db, "cases").withConverter(caseConverter);
export const tasksRef = collection(db, "tasks").withConverter(taskConverter);
export const claimsRef = collection(db, "claims").withConverter(claimConverter);
export const watchlistsRef = collection(db, "watchlists").withConverter(watchlistConverter);
export const narrativesRef = collection(db, "narratives").withConverter(narrativeConverter);
export const auditLogsRef = collection(db, "audit_logs").withConverter(auditLogConverter);
export const sourcesRef = collection(db, "sources").withConverter(sourceConverter);
export const usersRef = collection(db, "users").withConverter(userConverter);
export const experimentsRef = collection(db, "experiments").withConverter(experimentConverter);
export const knowledgeRef = collection(db, "knowledge").withConverter(knowledgeConverter);
export const teamMembersRef = collection(db, "team_members").withConverter(teamMemberConverter);
export const tenantsRef = collection(db, "tenants").withConverter(tenantConverter);
export const caseStudiesRef = collection(db, "case_studies").withConverter(caseStudyConverter);
export const validationItemsRef = collection(db, "validation_items").withConverter(validationItemConverter);

// Helpers
export const getCaseRef = (id: string) => doc(db, "cases", id).withConverter(caseConverter);
export const getTaskRef = (id: string) => doc(db, "tasks", id).withConverter(taskConverter);
export const getClaimRef = (id: string) => doc(db, "claims", id).withConverter(claimConverter);
export const getWatchlistRef = (id: string) => doc(db, "watchlists", id).withConverter(watchlistConverter);
export const getNarrativeRef = (id: string) => doc(db, "narratives", id).withConverter(narrativeConverter);
export const getAuditLogRef = (id: string) => doc(db, "audit_logs", id).withConverter(auditLogConverter);
export const getSourceRef = (id: string) => doc(db, "sources", id).withConverter(sourceConverter);
export const getUserRef = (id: string) => doc(db, "users", id).withConverter(userConverter);
export const getExperimentRef = (id: string) => doc(db, "experiments", id).withConverter(experimentConverter);
export const getKnowledgeRef = (id: string) => doc(db, "knowledge", id).withConverter(knowledgeConverter);
export const getTeamMemberRef = (id: string) => doc(db, "team_members", id).withConverter(teamMemberConverter);
export const getTenantRef = (id: string) => doc(db, "tenants", id).withConverter(tenantConverter);
export const getCaseStudyRef = (id: string) => doc(db, "case_studies", id).withConverter(caseStudyConverter);
export const getValidationItemRef = (id: string) => doc(db, "validation_items", id).withConverter(validationItemConverter);
