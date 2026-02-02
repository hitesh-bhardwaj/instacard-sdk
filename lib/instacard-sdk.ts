/**
 * Instacard SDK Bridge
 *
 * This module handles communication between the native app and the PWA WebView.
 * Banks will integrate a similar SDK to open the card addition flow.
 */

export type CardType = "debit" | "credit" | "prepaid" | "gift";

export type InstacardEventType =
  | "READY"
  | "CARD_ADDED"
  | "CARD_ADDITION_FAILED"
  | "USER_CANCELLED"
  | "OTP_REQUESTED"
  | "OTP_VERIFIED"
  | "NAVIGATION"
  | "ERROR";

export interface InstacardEvent {
  type: "INSTACARD_EVENT";
  payload: {
    event: InstacardEventType;
    data?: Record<string, unknown>;
    error?: {
      code: string;
      message: string;
    };
  };
}

export interface CardAddedData {
  cardId: string;
  cardType: CardType;
  lastFourDigits: string;
}

export interface SDKConfig {
  /** Base URL for the PWA (e.g., http://localhost:3000 for dev) */
  pwaBaseUrl: string;
  /**
   * Optional route/path inside the PWA, e.g. '/card-detail' or 'card-detail'.
   * If not provided, '/' (root) will be used.
   */
  route?: string;
  /** JWT token for authentication */
  userToken: string;
  /** Optional: Pre-select card type */
  cardType?: CardType;
  /** Optional: Bank identifier */
  bankId?: string;
  /** Environment */
  environment?: "development" | "staging" | "production";
}

export interface SDKResult {
  success: boolean;
  data?: CardAddedData;
  error?: {
    code: string;
    message: string;
  };
  cancelled?: boolean;
}

/**
 * Build the PWA URL with authentication parameters and optional route
 */
export function buildPWAUrl(config: SDKConfig): string {
  const url = new URL(config.pwaBaseUrl);

  // Apply optional route (fallback to root if none provided)
  if (config.route && config.route.trim() !== "") {
    const normalized = config.route.startsWith("/")
      ? config.route
      : `/${config.route}`;
    url.pathname = normalized;
  }

  // Add authentication token
  url.searchParams.set("token", config.userToken);

  // Add optional parameters
  if (config.cardType) {
    url.searchParams.set("cardType", config.cardType);
  }
  if (config.bankId) {
    url.searchParams.set("bankId", config.bankId);
  }
  if (config.environment) {
    url.searchParams.set("env", config.environment);
  }

  return url.toString();
}

/**
 * Parse a message from the PWA WebView
 */
export function parseWebViewMessage(data: string): InstacardEvent | null {
  try {
    const parsed = JSON.parse(data);
    if (parsed?.type === "INSTACARD_EVENT") {
      return parsed as InstacardEvent;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Create a message to send to the PWA WebView
 * Used for native-to-PWA communication (e.g., back button events)
 */
export function createWebViewMessage(
  event: InstacardEventType,
  data?: Record<string, unknown>,
): string {
  const message: InstacardEvent = {
    type: "INSTACARD_EVENT",
    payload: {
      event,
      data,
    },
  };
  return JSON.stringify(message);
}

/**
 * Generate a mock JWT token for development
 */
export function generateDevToken(): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: "dev-user-123",
      name: "Dev User",
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      iat: Math.floor(Date.now() / 1000),
    }),
  );
  const signature = btoa("dev-signature");
  return `${header}.${payload}.${signature}`;
}

/**
 * Default SDK configuration for development
 */
export const DEV_SDK_CONFIG: SDKConfig = {
  // pwaBaseUrl: 'http://localhost:3000',
  // pwaBaseUrl: "http://192.168.3.1:3000",
  pwaBaseUrl: "https://instacard-pwa.vercel.app/",
  userToken: generateDevToken(),
  environment: "development",
};
