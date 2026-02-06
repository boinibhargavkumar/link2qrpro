import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { pagesConfig } from '@/pages.config';

/**
 * NavigationTracker - Simplified version without external logging
 * You can add your own analytics here (Google Analytics, Plausible, etc.)
 */
export default function NavigationTracker() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { Pages, mainPage } = pagesConfig;
    const mainPageKey = mainPage ?? Object.keys(Pages)[0];

    // Track page views
    useEffect(() => {
        const pathname = location.pathname;
        let pageName;

        if (pathname === '/' || pathname === '') {
            pageName = mainPageKey;
        } else {
            // Remove leading slash and get the first segment
            const pathSegment = pathname.replace(/^\//, '').split('/')[0];

            // Try case-insensitive lookup in Pages config
            const pageKeys = Object.keys(Pages);
            const matchedKey = pageKeys.find(
                key => key.toLowerCase() === pathSegment.toLowerCase()
            );

            pageName = matchedKey || null;
        }

        if (pageName) {
            // Optional: Add your own analytics tracking here
            // For example:
            // - Google Analytics: window.gtag('event', 'page_view', { page_path: pathname })
            // - Plausible: window.plausible('pageview')
            // - Custom analytics: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ page: pageName }) })
            
            console.log('Page view:', pageName, pathname);
        }
    }, [location, isAuthenticated, Pages, mainPageKey]);

    return null;
}
