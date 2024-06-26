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
                    trackPageView();
                    break;
                case "click":
                case "discover":
                    this.trackClick(event);
                    break;
            }
        }
    }

    private trackClick(event: AnalyticsEvent): void {
        let to: string = event.attributes?.to as string ?? '';
        const hasDomain = new RegExp(/[A-Za-z0-9-]{1,63}\.[A-Za-z]{2,6}/).test(to);
        const isMailto = to.startsWith('mailto:');

        // add the baseUrl to relative path links (this is largely to remain consistent with previous analytics)
        if (!hasDomain && !isMailto) {
            to = (to.startsWith('/'))? this.baseUrl + to : this.baseUrl + '/' + to;
        }

        trackLinkClick({ targetUrl: to, elementContent: event.subject });
    }

    private trackSearch(event: AnalyticsEvent): void {
        // trim whitespace, split into non-empty terms
        trackSiteSearch({ terms: event.subject.trim().split(" ").filter( t => t ) });
    }

    private captureSearch(event: AnalyticsEvent): void {
        // cancel any pending trackSearch call
        if (this.cancelProc) {
            clearTimeout(this.cancelProc);
        }

        // track event once the debounceTime has elapsed
        this.cancelProc = setTimeout(() => {
            this.trackSearch(event);
            this.cancelProc = null;
        }, this.debounceTime);
    }

}