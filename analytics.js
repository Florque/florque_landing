import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAUZbxLIjrzvKEU97mQ1e5mRcMa9qqHHU",
  authDomain: "florque-121d6.firebaseapp.com",
  projectId: "florque-121d6",
  storageBucket: "florque-121d6.firebasestorage.app",
  messagingSenderId: "954856304895",
  appId: "1:954856304895:web:fd0e42c3dd8fe4f6811cca",
  measurementId: "G-K9ETE8PHFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Analytics Proxy Service
// This abstraction allows swapping or extending providers (e.g. Mixpanel, Plausible) without touching app code.
class AnalyticsService {
    static logEvent(eventName, eventParams = {}) {
        try {
            // Firebase implementation
            logEvent(analytics, eventName, eventParams);
            
            // Add future providers here
            // Mixpanel.track(eventName, eventParams);
            
            console.debug(`[Analytics] Event: ${eventName}`, eventParams);
        } catch (error) {
            console.error(`[Analytics] Error logging event: ${eventName}`, error);
        }
    }

    static trackPageView() {
        this.logEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
}

// Make globally accessible
window.Analytics = AnalyticsService;

// Automatically track the page view when loaded
AnalyticsService.trackPageView();

// Automatically track all elements with data-analytics-event attribute
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-analytics-event]');
        if (target) {
            const eventName = target.getAttribute('data-analytics-event');
            const eventParams = target.getAttribute('data-analytics-params');
            
            let parsedParams = {};
            if (eventParams) {
                try {
                    parsedParams = JSON.parse(eventParams);
                } catch (err) {
                    console.warn('[Analytics] Failed to parse event params', eventParams);
                }
            }
            
            AnalyticsService.logEvent(eventName, parsedParams);
        }
    });
});