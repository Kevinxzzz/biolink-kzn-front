const AUTH_EXPIRED_EVENT = 'auth:expired';

/**
 * Dispara um evento global customizado indicando que a sessão/token expirou.
 */
export function dispatchAuthExpired(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }
}

/**
 * Inscreve um listener para reagir quando o evento de expiração de autenticação for disparado.
 * Retorna uma função para cancelar a inscrição.
 */
export function onAuthExpired(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener(AUTH_EXPIRED_EVENT, handler);

  return () => {
    window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
  };
}
