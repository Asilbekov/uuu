import { cookies } from 'next/headers';
import AppRoot from '@/components/app-root';

// Server-rendered boot: the auth cookie (set by the client after the first
// login) lets the very first HTML already paint the DASHBOARD shell — header,
// every button and the feed skeletons — while the client bundle hydrates.
// Returning users never see a splash/loading screen (TikTok-style instant
// entry); visitors without the cookie get the login screen pre-rendered.
export default async function Page() {
  const authed = (await cookies()).get('uuu_authed')?.value === '1';
  return <AppRoot authed={authed} />;
}
