import crypto from "crypto";

/**
 * Проверка подлинности initData от Telegram Web App.
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramInitData(initData: string, botToken: string): boolean {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    urlParams.delete("hash");

    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    return calculatedHash === hash;
  } catch {
    return false;
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export function parseTelegramInitData(initData: string): { user?: TelegramUser } {
  const params = new URLSearchParams(initData);
  const userStr = params.get("user");
  if (!userStr) return {};
  try {
    const user = JSON.parse(decodeURIComponent(userStr)) as TelegramUser;
    return { user };
  } catch {
    return {};
  }
}
