/**
 * Simplified app params - no base44 configuration needed
 * This file previously managed base44 authentication and configuration
 * Now it's a simple placeholder for potential future configuration
 */

const isNode = typeof window === 'undefined';

const getAppParams = () => {
  if (isNode) {
    return {
      appId: 'standalone-app',
      token: null,
      fromUrl: '',
      functionsVersion: null,
      appBaseUrl: '/'
    };
  }

  return {
    appId: 'standalone-app',
    token: null,
    fromUrl: window.location.href,
    functionsVersion: null,
    appBaseUrl: '/'
  };
};

export const appParams = {
  ...getAppParams()
};
