class ExtensionAnalytics {
    constructor(measurementId, apiSecret) {
        this.measurementId = measurementId;
        this.apiSecret = apiSecret;
        this.baseURL = "https://www.google-analytics.com/mp/collect";
        this.clientId = null;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    async init() {
        try {
            this.clientId = await this.getOrCreateClientId();
            
            if (!this.measurementId.startsWith("G-")) {
                throw new Error("Invalid measurement ID format. Should start with G-");
            }

            console.debug("Analytics initialized with clientId:", this.clientId);
            return true;
        } catch (error) {
            console.error("Analytics initialization failed:", error.message);
            return false;
        }
    }

    async trackActiveUsers() {
        if (!this.clientId) {
            const initResult = await this.init();
            if (!initResult) return;
        }

        const payload = {
            client_id: this.clientId,
            events: [{
                name: "page_view",
                params: {
                    engagement_time_msec: "100",
                    session_id: await this.getOrCreateSessionId(),
                    page_title: document.title,
                    page_location: window.location.href,
                }
            }]
        };

        for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
            try {
                const response = await fetch(
                    `${this.baseURL}?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                console.debug("Analytics event sent successfully", payload);
                return true;
            } catch (error) {
                console.error(`Analytics attempt ${attempt + 1} failed:`, error);
                if (attempt < this.retryAttempts - 1) {
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                }
            }
        }
        return false;
    }

    async getOrCreateClientId() {
        const result = await chrome.storage.local.get('clientId');
        let clientId = result.clientId;
        if (!clientId) {
            clientId = self.crypto.randomUUID();
            await chrome.storage.local.set({ clientId });
        }
        return clientId;
    }

    async getOrCreateSessionId() {
        const SESSION_EXPIRATION_IN_MIN = 30;
        let { sessionData } = await chrome.storage.session.get('sessionData');
        const currentTimeInMs = Date.now();

        if (sessionData && sessionData.timestamp) {
            const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
            if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
                sessionData = null;
            } else {
                sessionData.timestamp = currentTimeInMs;
                await chrome.storage.session.set({ sessionData });
            }
        }

        if (!sessionData) {
            sessionData = {
                session_id: currentTimeInMs.toString(),
                timestamp: currentTimeInMs,
            };
            await chrome.storage.session.set({ sessionData });
        }

        return sessionData.session_id;
    }
}

export default ExtensionAnalytics;