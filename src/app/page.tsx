import { cookies } from 'next/headers';
import AppRoot from '@/components/app-root';

// Server-rendered boot: the httpOnly session cookie (set by the server on
// login) lets the very first HTML already paint the DASHBOARD shell — header,
// every button and the feed skeletons — while the client bundle hydrates.
// Returning users never see a splash/loading screen (TikTok-style instant
// entry); visitors without the cookie get the login screen pre-rendered.
// The cookie holds only an opaque session token — zero user data on the
// device; /api/auth/me-style confirmation happens client-side via /api/me.
export default async function Page() {
  const authed = !!((await cookies()).get('uuu_session')?.value);
  return <AppRoot authed={authed} />;
}
