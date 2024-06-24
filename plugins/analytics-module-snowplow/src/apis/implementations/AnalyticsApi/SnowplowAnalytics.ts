import { Config } from '@backstage/config';
import {
    AnalyticsApi,
    AnalyticsEvent,
} from '@backstage/core-plugin-api';
import { newTracker, trackPageView, enableActivityTracking } from '@snowplow/browser-tracker';
import { LinkClickTrackingPlugin, trackLinkClick } from '@snowplow/browser-plugin-link-click-tracking';
import { SiteTrackingPlugin, trackSiteSearch } from '@snowplow/browser-plugin-site-tracking';

export class SnowplowAnalytics implements AnalyticsApi {
    private readonly enabled: boolean;
    private readonly baseUrl: string;
    private stack: AnalyticsEvent[];
    private readonly debounceTime: number;
    private cancelProc: NodeJS.Timeout | null;

    private constructor(options: {
        enabled: boolean,
        baseUrl: string,
        trackerId: string,
        endpoint: string,
        appId: string,
        cookieLifetime: number,
        debounceTime: number
    }) {
        const {
            enabled,
            baseUrl,
            trackerId,
            endpoint,
            appId,
            cookieLifetime,
            debounceTime
        } = options;

        this.enabled = enabled;
        this.baseUrl = baseUrl;
        this.stack = [];
        this.cancelProc = null;
        this.debounceTime = debounceTime;
        
        // create the Snowplow tracker
        console.log("**********Setting up analytics (or not...)********");
        if (this.enabled) {
            console.log("**********Analytics enabled...********");

            newTracker(trackerId, endpoint, {
                appId: appId,
                cookieLifetime: cookieLifetime,
                platform: "web",
                contexts: {
                    webPage: true
                },
                plugins: [LinkClickTrackingPlugin(), SiteTrackingPlugin()]
            });

            enableActivityTracking({
                minimumVisitLength: 30,
                heartbeatDelay: 30
            });
        }
    }
  
    static fromConfig(config: Config): SnowplowAnalytics {
        const enabled = config.getBoolean('app.analytics.snowplow.enabled');
        const baseUrl = config.getString('app.baseUrl');
        const endpoint = config.getString('app.analytics.snowplow.collectorUrl');
        const appId = config.getOptionalString('app.analytics.snowplow.appId') || 'Snowplow_standalone_OCIO' ;
        const trackerId = config.getOptionalString('app.analytics.snowplow.trackerId') || 'rt';
        const cookieLifetime = config.getOptionalNumber('app.analytics.snowplow.cookieLifetime') ?? 86400 * 548;
        const debounceTime = config.getOptionalNumber('app.analytics.snowplow.debounceTime') ?? 3000;

        return new SnowplowAnalytics({
            enabled,
            baseUrl,
            trackerId,
            endpoint,
            appId,
            cookieLifetime,
            debounceTime
        });
    }
    
    captureEvent(event: AnalyticsEvent): void {
        if (this.enabled) {
            switch (event.action) {
                case "search":
                    this.captureSearch(event);
                    break;
                case "navigate":
                    this.trackPageView();
                    break;
                case "click":
                case "discover":
                    this.trackClick(event);
                    break;
            }
        }
    }

    private trackPageView(): void {
        trackPageView();
    }

    private trackClick(event: AnalyticsEvent): void {
        let to: string = event.attributes?.to as string;
        const isDomain = to.startsWith('https:');
        const isMailto = to.startsWith('mailto:');

        if (!isDomain && !isMailto) {
            to = (to.startsWith('/'))? this.baseUrl + to : this.baseUrl + '/' + to;
        }

        trackLinkClick({ targetUrl: to, elementContent: event.subject });
    }

    private trackSearch(event: AnalyticsEvent): void {
        trackSiteSearch({ terms: event.subject.split(" ") });
    }

    private captureSearch(event: AnalyticsEvent): void {
        // push new events on the stack so the most recent is first
        this.stack.unshift(event);

        // cancel any pending process call
        if (this.cancelProc) {
            clearTimeout(this.cancelProc);
        }

        // process events, and reset stack once the debounceTime has elapsed
        this.cancelProc = setTimeout(() => {
            this.process(this.stack);
            this.stack = [];
            this.cancelProc = null;
        }, this.debounceTime);
    }

    private process(events: AnalyticsEvent[]): void {
        if (events) {
            const sendList: AnalyticsEvent[] = [];

             // walk event list starting with most recent
            events.forEach(e => {
                // skip substrings. ex. events that fired while the user was typing
                if (!sendList.some( query => query.subject.startsWith(e.subject) )) {
                    // if a previous event is a substring then swap. ex. the user backspaced off typos
                    let index = sendList.findIndex( query => e.subject.startsWith(query.subject) );
                    if (index >= 0) {
                        sendList[index] = e;
                    } else {
                        sendList.unshift(e);
                    }
                }
            });

            // track pruned event list
            sendList.forEach(this.trackSearch);
        }
    }

}