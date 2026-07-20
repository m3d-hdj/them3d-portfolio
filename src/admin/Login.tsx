import { useState, type FormEvent } from 'react'
import { sb } from '../lib/supabase'
import type { Notify } from '../pages/Admin'

export default function Login({ notify }: { notify: Notify }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) notify(error.message, 'err')
  }

  return (
    <div className="flex min-h-[calc(100svh-70px)] items-center justify-center p-5">
      <div className="admin-card w-[min(420px,94vw)]">
        <h1 className="font-disp text-2xl uppercase">Sign in</h1>
        <p className="mb-4 text-[0.92rem] text-muted">Admin access only.</p>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="field"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="field-label" htmlFor="login-pass">
            Password
          </label>
          <input
            id="login-pass"
            type="password"
            className="field"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-solid mt-6 w-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
