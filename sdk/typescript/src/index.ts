/**
 * VERITAS//FEED TypeScript SDK
 * ============================
 * Official TypeScript client for the VERITAS Intelligence Platform API.
 *
 * Installation:
 *   npm install @veritas/sdk
 *
 * Quick Start:
 *   import { VeritasClient } from '@veritas/sdk';
 *   const client = new VeritasClient({ apiKey: 'vf_prod_xxx' });
 *   const investigations = await client.investigations.list({ status: 'active' });
 */

export const SDK_VERSION = '0.1.0';

export interface VeritasConfig {
  apiKey: string;
  baseUrl?: string;
}

export class VeritasClient {
  private apiKey: string;
  private baseUrl: string;

  public investigations: InvestigationResource;
  public narratives: NarrativeResource;
  public sources: SourceResource;
  public events: EventResource;

  constructor(config: VeritasConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || 'https://api.veritas.io/v2').replace(/\/$/, '');
    this.investigations = new InvestigationResource(this);
    this.narratives = new NarrativeResource(this);
    this.sources = new SourceResource(this);
    this.events = new EventResource(this);
  }

  async request<T = any>(method: string, path: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-SDK-Version': SDK_VERSION,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`VERITAS API Error: ${res.status} ${res.statusText}`);
    return res.json();
  }
}

class InvestigationResource {
  constructor(private client: VeritasClient) {}

  list(params?: { status?: string }) {
    const qs = params?.status ? `?status=${params.status}` : '';
    return this.client.request('GET', `/investigations${qs}`);
  }

  get(id: string) {
    return this.client.request('GET', `/investigations/${id}`);
  }

  create(data: { title: string; description: string }) {
    return this.client.request('POST', '/investigations', data);
  }
}

class NarrativeResource {
  constructor(private client: VeritasClient) {}
  list() { return this.client.request('GET', '/narratives'); }
  get(id: string) { return this.client.request('GET', `/narratives/${id}`); }
}

class SourceResource {
  constructor(private client: VeritasClient) {}
  list() { return this.client.request('GET', '/sources'); }
}

class EventResource {
  constructor(private client: VeritasClient) {}
  listCatalog() { return this.client.request('GET', '/platform/events'); }
  subscribe(eventType: string, webhookUrl: string) {
    return this.client.request('POST', '/platform/events/subscribe', { event_type: eventType, url: webhookUrl });
  }
}
