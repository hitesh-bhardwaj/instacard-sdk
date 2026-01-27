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
 * Build the PWA URL with authentication parameters
 */
export function buildPWAUrl(config: SDKConfig): string {
  const url = new URL(config.pwaBaseUrl);

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
  pwaBaseUrl: "http://10.5.50.29:3000",
  userToken: generateDevToken(),
  environment: "development",
};
