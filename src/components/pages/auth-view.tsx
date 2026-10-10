'use client';

import React from 'react';
import { FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * AUTH PAGE — login / sign-up card. Form state lives in src/app/page.tsx
 * (handleAuth needs the shared toast + session plumbing).
 */
export interface AuthViewProps {
  authMode: 'login' | 'signup';
  setAuthMode: (m: 'login' | 'signup') => void;
  name: string;
  email: string;
  password: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  loading: boolean;
  handleAuth: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export default function AuthView({
  authMode,
  setAuthMode,
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  loading,
  handleAuth,
  t,
}: AuthViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 screen-enter">
      <Card className="w-full max-w-md rounded-4xl border border-black shadow-lg bg-white">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-cta rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <FlaskConical className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            ChemTest
          </CardTitle>
          <CardDescription>
            {authMode === 'login' ? t('signInToAccount') : t('createNewAccount')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authMode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">{t('fullName')}</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input id="password" type="password" placeholder={t('min6chars')} value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAuth()} />
          </div>
          <Button className="w-full h-11 rounded-full text-base font-semibold" onClick={handleAuth} disabled={loading}>
            {loading ? t('loading') : authMode === 'login' ? t('signIn') : t('signUp')}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {authMode === 'login' ? (
              <>{t('noAccount')} <button className="text-primary underline" onClick={() => setAuthMode('signup')}>{t('signUpLink')}</button></>
            ) : (
              <>{t('haveAccount')} <button className="text-primary underline" onClick={() => setAuthMode('login')}>{t('signInLink')}</button></>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
