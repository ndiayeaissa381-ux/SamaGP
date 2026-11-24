import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Field, Input, Textarea } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'

export default function Contact() {
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)

  const submit = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Indiquez votre nom.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Adresse email invalide.'
    if (!form.message.trim()) errs.message = 'Écrivez votre message.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setForm({ name: '', email: '', subject: '', message: '' })
      toast('Votre message a bien été envoyé. Nous vous répondrons rapidement.')
    }, 700)
  }

  return (
    <main>
      <section className="bg-[#0F2450] py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Contact</h1>
          <p className="mt-3 text-slate-300">
            Une question, une suggestion ou un problème ? Notre équipe est là pour vous aider.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          {[
            { icon: <Mail size={17} />, label: 'Email', value: 'contact@samagp.sn' },
            { icon: <Phone size={17} />, label: 'Téléphone', value: '+221 77 000 00 00' },
            { icon: <MapPin size={17} />, label: 'Adresse', value: 'Dakar, Sénégal' },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2F8] text-[#1B3A70]">
                {c.icon}
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#64748B]">{c.label}</p>
                <p className="text-sm font-semibold text-slate-800">{c.value}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-[#059669] p-5 text-sm text-[#D1FAE5]">
            <p className="font-display font-bold text-white">Horaires d'assistance</p>
            <p className="mt-1.5">Lundi – Vendredi : 9 h – 18 h</p>
            <p>Samedi : 10 h – 15 h</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-[#0F2450]">Envoyez-nous un message</h2>
          <form
            className="mt-6 space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Votre nom" error={errors.name}>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Awa Ndiaye" />
              </Field>
              <Field label="Votre email" error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="awa@exemple.sn" />
              </Field>
            </div>
            <Field label="Sujet">
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Support, partenariat…" />
            </Field>
            <Field label="Message" error={errors.message}>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Décrivez votre demande…" />
            </Field>
            <Button type="submit" size="lg" loading={sending}>
              <Send size={16} /> Envoyer le message
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}