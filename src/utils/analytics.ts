class ExtensionAnalytics {
  private measurementId: string;
  private apiSecret: string;
  private baseURL: string;
  private clientId: string | null;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(measurementId: string, apiSecret: string) {
    this.measurementId = measurementId;
    this.apiSecret = apiSecret;
    this.baseURL = 'https://www.google-analytics.com/mp/collect';
    this.clientId = null;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async init(): Promise<boolean> {
    try {
      this.clientId = await this.getOrCreateClientId();

      if (!this.measurementId.startsWith('G-')) {
        throw new Error('Invalid measurement ID format. Should start with G-');
      }

      console.warn('Analytics initialized with clientId:', this.clientId);
      return true;
    } catch (error) {
      console.error(
        'Analytics initialization failed:',
        (error as Error).message,
      );
      return false;
    }
  }

  async trackActiveUsers(): Promise<boolean> {
    if (!this.clientId) {
      const initResult = await this.init();
      if (!initResult) return false;
    }

    const payload = {
      client_id: this.clientId,
      events: [
        {
          name: 'page_view',
          params: {
            engagement_time_msec: '100',
            session_id: await this.getOrCreateSessionId(),
            page_title: document.title,
            page_location: window.location.href,
          },
        },
      ],
    };

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await fetch(
          `${this.baseURL}?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.warn('Analytics event sent successfully', payload);
        return true;
      } catch (error) {
        console.error(`Analytics attempt ${attempt + 1} failed:`, error);
        if (attempt < this.retryAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }
    return false;
  }

  async getOrCreateClientId(): Promise<string> {
    const result = await chrome.storage.local.get('clientId');
    let clientId = result.clientId as string | undefined;
    if (!clientId) {
      clientId = self.crypto.randomUUID();
      await chrome.storage.local.set({ clientId });
    }
    return clientId;
  }

  async getOrCreateSessionId(): Promise<string> {
    const SESSION_EXPIRATION_IN_MIN = 30;
    const result = await chrome.storage.session.get('sessionData');
    const sessionData = result.sessionData as
      | { session_id: string; timestamp: number }
      | undefined;
    const currentTimeInMs = Date.now();

    if (sessionData && sessionData.timestamp) {
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        return await this.createNewSession(currentTimeInMs);
      }
      sessionData.timestamp = currentTimeInMs;
      await chrome.storage.session.set({ sessionData });
      return sessionData.session_id;
    }

    return await this.createNewSession(currentTimeInMs);
  }

  private async createNewSession(currentTimeInMs: number): Promise<string> {
    const sessionData = {
      session_id: currentTimeInMs.toString(),
      timestamp: currentTimeInMs,
    };
    await chrome.storage.session.set({ sessionData });
    return sessionData.session_id;
  }
}

export default ExtensionAnalytics;
