import { useEffect } from 'react';
import { generateCSPContent } from './utils/security';

/**
 * Security Headers Component
 * Adds security-related meta tags and performs security checks
 */
export default function SecurityHeaders() {
  useEffect(() => {
    // Content Security Policy
    let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = generateCSPContent();
      document.head.appendChild(cspMeta);
    }

    // X-Content-Type-Options
    let xContentType = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
    if (!xContentType) {
      xContentType = document.createElement('meta');
      xContentType.httpEquiv = 'X-Content-Type-Options';
      xContentType.content = 'nosniff';
      document.head.appendChild(xContentType);
    }

    // X-Frame-Options (clickjacking protection)
    let xFrameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    if (!xFrameOptions) {
      xFrameOptions = document.createElement('meta');
      xFrameOptions.httpEquiv = 'X-Frame-Options';
      xFrameOptions.content = 'DENY';
      document.head.appendChild(xFrameOptions);
    }

    // Referrer Policy
    let referrerPolicy = document.querySelector('meta[name="referrer"]');
    if (!referrerPolicy) {
      referrerPolicy = document.createElement('meta');
      referrerPolicy.name = 'referrer';
      referrerPolicy.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerPolicy);
    }

    // Permissions Policy
    let permissionsPolicy = document.querySelector('meta[http-equiv="Permissions-Policy"]');
    if (!permissionsPolicy) {
      permissionsPolicy = document.createElement('meta');
      permissionsPolicy.httpEquiv = 'Permissions-Policy';
      permissionsPolicy.content = 'geolocation=(), microphone=(), camera=(), payment=()';
      document.head.appendChild(permissionsPolicy);
    }

    // Robots meta (for security pages)
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.content = 'index, follow';
      document.head.appendChild(robotsMeta);
    }

    // Prevent clickjacking via CSS
    const style = document.createElement('style');
    style.textContent = `
      html { 
        display: none; 
      }
      html.js-enabled { 
        display: block; 
      }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add('js-enabled');

    // Cleanup
    return () => {
      // Note: We don't remove meta tags on cleanup as they should persist
    };
  }, []);

  return null; // This is a non-rendering component
}