/**
 * Глобальный обработчик ошибок API — показывается уведомлением (Ant Design message).
 * Устанавливается в корне приложения (Providers).
 */
let apiErrorHandler: (msg: string) => void = () => {};

export function setApiErrorHandler(handler: (msg: string) => void): void {
  apiErrorHandler = handler;
}

function notifyError(msg: string): void {
  apiErrorHandler(msg);
}

/**
 * Обёртка над fetch: при ответе с !res.ok показывает уведомление и бросает ошибку.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);
  if (!res.ok) {
    let msg = res.statusText || "Ошибка";
    try {
      const data = await res.json();
      msg = data.error ?? data.message ?? msg;
    } catch {
      const text = await res.text();
      if (text) msg = text;
    }
    notifyError(typeof msg === "string" ? msg : "Ошибка запроса");
    throw new Error(msg);
  }
  return res;
}
