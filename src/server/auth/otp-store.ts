// Armazenamento em memória de OTPs pendentes
// Formato: email -> { code: string, expiresAt: number, attempts: number }
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

export function getPendingOtp(email: string) {
  return otpStore.get(email.trim().toLowerCase());
}

export function setPendingOtp(email: string, code: string, expiresAt: number) {
  otpStore.set(email.trim().toLowerCase(), { code, expiresAt, attempts: 0 });
}

export function deletePendingOtp(email: string) {
  otpStore.delete(email.trim().toLowerCase());
}
