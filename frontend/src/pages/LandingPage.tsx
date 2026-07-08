import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Code2,
  Combine,
  Cpu,
  Database,
  Globe,
  Package,
  PenTool,
  Rocket,
  Search,
  Shield,
  Smartphone,
  Sun,
  Users,
  Users2,
  Workflow,
  Zap,
} from 'lucide-react'
import { useAppSelector } from '../redux/hooks'

type Service = {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  accent: string
  badge?: string
}

type ProcessStep = {
  icon: LucideIcon
  title: string
  description: string
}

const services: Service[] = [
  {
    icon: Globe,
    title: 'Business Websites',
    description: 'Fast, conversion-focused websites that turn visitors into customers.',
    features: ['Business websites', 'Landing pages', 'SEO optimization'],
    accent: 'text-violet-300 bg-violet-400/10 border-violet-300/20',
    badge: 'Most popular',
  },
  {
    icon: BarChart3,
    title: 'Web Applications',
    description: 'Scalable platforms built for speed, security and real workflows.',
    features: ['Custom web apps', 'Admin dashboards', 'API integrations'],
    accent: 'text-sky-300 bg-sky-400/10 border-sky-300/20',
  },
  {
    icon: Smartphone,
    title: 'Mobile Applications',
    description: 'Native-quality Android and iOS experiences your users will enjoy.',
    features: ['Android and iOS apps', 'Cross-platform apps', 'App modernization'],
    accent: 'text-emerald-300 bg-emerald-400/10 border-emerald-300/20',
  },
  {
    icon: Database,
    title: 'ERP Systems',
    description: 'Unified operations software for finance, teams, inventory and reports.',
    features: ['Finance modules', 'Supply chain', 'Reporting analytics'],
    accent: 'text-cyan-300 bg-cyan-400/10 border-cyan-300/20',
  },
  {
    icon: Users2,
    title: 'CRM Systems',
    description: 'Relationship platforms that help teams sell smarter and retain better.',
    features: ['Lead management', 'Sales pipeline', 'Customer insights'],
    accent: 'text-amber-300 bg-amber-400/10 border-amber-300/20',
  },
  {
    icon: Users,
    title: 'HRMS',
    description: 'Complete HR management from hiring to payroll and performance.',
    features: ['Employee records', 'Payroll attendance', 'Performance reviews'],
    accent: 'text-rose-300 bg-rose-400/10 border-rose-300/20',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Real-time stock tracking, warehouse management and reorder flows.',
    features: ['Stock tracking', 'Warehouse ops', 'Purchase orders'],
    accent: 'text-teal-300 bg-teal-400/10 border-teal-300/20',
  },
  {
    icon: Combine,
    title: 'Business Management',
    description: 'Operating systems that connect teams, data, approvals and decisions.',
    features: ['Workflow automation', 'Internal portals', 'Role-based access'],
    accent: 'text-blue-300 bg-blue-400/10 border-blue-300/20',
  },
  {
    icon: Cpu,
    title: 'AI Solutions',
    description: 'Automation, predictive analytics and AI-powered business tools.',
    features: ['AI chatbots', 'Predictive analytics', 'Process automation'],
    accent: 'text-fuchsia-300 bg-fuchsia-400/10 border-fuchsia-300/20',
    badge: 'New',
  },
]

const processSteps: ProcessStep[] = [
  {
    icon: Search,
    title: 'Discover',
    description: 'We learn your business, users, goals and what success really means.',
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'We map the experience and craft an interface that feels clearly yours.',
  },
  {
    icon: Code2,
    title: 'Build',
    description: 'We develop, integrate and test with clear weekly progress updates.',
  },
  {
    icon: Rocket,
    title: 'Launch and grow',
    description: 'We launch with confidence, measure results and keep improving.',
  },
]

const faqs = [
  {
    q: 'How long does a typical project take?',
    a: 'Most business websites take 3-5 weeks. Apps and custom platforms usually take 6-14 weeks depending on scope. You get a clear timeline before we begin.',
  },
  {
    q: 'Can you work with my existing brand or product?',
    a: 'Yes. We can refresh an existing brand, extend your current product, or build a new experience around what already works.',
  },
  {
    q: 'Do you provide support after launch?',
    a: 'Yes. We offer launch support, maintenance, improvements, analytics review and feature updates.',
  },
  {
    q: 'Will I be able to manage the platform myself?',
    a: 'Yes. We build admin dashboards, documentation and simple content flows so your team can manage daily operations.',
  },
  {
    q: 'How do payments work?',
    a: 'Most projects start with a scoped proposal and milestone payments. Support plans can be monthly or project-based.',
  },
]

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-200">
      <Zap size={14} />
      {children}
    </span>
  )
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-lg border border-white/10 bg-[#111827]/90 shadow-2xl shadow-violet-950/40">
      <div className="flex h-12 items-center justify-between border-b border-white/10 px-5">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div className="rounded-full bg-slate-950/70 px-4 py-1 text-xs text-slate-300">
          app.digiayudh.com
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-sky-200">OVERVIEW</p>
            <h2 className="mt-1 text-lg font-bold text-white">Good morning, Ayudh User</h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
          >
            <ArrowUpRight size={16} />
            New project
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['Revenue', 'INR 8.42L', '+18.2%'],
            ['Projects', '24', '+4 new'],
            ['Conversion', '32.8%', '+6.4%'],
          ].map(([label, value, change]) => (
            <div key={label} className="rounded-lg bg-white/[0.06] p-4">
              <p className="text-xs text-slate-400">{label}</p>
              <p className="mt-1 text-xl font-bold text-white">{value}</p>
              <p className="text-xs font-semibold text-emerald-300">{change}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-white/[0.06] p-4">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-bold text-white">Growth overview</p>
            <p className="text-xs text-slate-400">This year</p>
          </div>
          <div className="relative h-28 overflow-hidden rounded-lg bg-gradient-to-t from-violet-500/20 to-transparent">
            <svg viewBox="0 0 520 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path
                d="M0 82 C42 62 74 72 104 66 C136 58 153 44 194 51 C236 58 252 34 292 40 C336 47 349 24 392 29 C438 34 456 18 520 22"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>

        <div className="rounded-lg bg-white/[0.06] p-4">
          <p className="mb-3 text-sm font-bold text-white">Activity</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-300">Payment received</span>
              <span className="font-semibold text-emerald-300">INR 42,000</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-300">Project deployed</span>
              <span className="font-semibold text-sky-300">Nova Store</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-300">New lead added</span>
              <span className="font-semibold text-violet-300">Organic</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
          <div>
            <p className="font-bold text-emerald-200">You are live</p>
            <p className="text-xs text-emerald-100/70">Deployed successfully</p>
          </div>
          <p className="text-xl font-black text-emerald-300">+42%</p>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  useEffect(() => {
    if (!isAuthenticated || !user) return

    if (user.role === 'admin') navigate('/admin/dashboard')
    else if (user.role === 'employee') navigate('/employee/dashboard')
    else if (user.role === 'client') navigate('/client/dashboard')
  }, [isAuthenticated, user, navigate])

  return (
    <div className="min-h-screen overflow-hidden bg-background text-text">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05070d]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src="/digiayudh-logo.svg" alt="DigiAyudh" className="h-9 w-9 rounded-full border border-white/10" />
            <span className="text-lg font-black text-white">DigiAyudh</span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {['Services', 'Work', 'Process', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-slate-400 transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Theme"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/5 hover:text-white sm:flex"
            >
              <Sun size={18} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-violet-100 sm:px-5"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative min-h-screen border-b border-white/10 px-4 pt-28 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-y-0 right-0 w-full bg-[radial-gradient(circle_at_72%_42%,rgba(124,58,237,0.34),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(20,184,166,0.13),transparent_30%)]" />

          <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-2xl">
              <Pill>Digital Weapons for the Future</Pill>
              <h1 className="mt-8 text-5xl font-black leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                We build digital products that <span className="text-violet-300">move businesses</span> forward.
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                From a powerful first website to a complete business operating system, we design, build and launch digital experiences made for real growth.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center gap-3 rounded-lg bg-violet-600 px-6 py-4 font-bold text-white shadow-xl shadow-violet-950/30 transition hover:bg-violet-500"
                >
                  Build my product
                  <ArrowRight size={20} />
                </button>
                <a
                  href="#work"
                  className="inline-flex items-center gap-3 rounded-lg border border-white/15 px-6 py-4 font-bold text-white transition hover:border-violet-300/50 hover:bg-white/5"
                >
                  See our work
                  <ArrowUpRight size={20} />
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <div className="flex -space-x-3">
                  {['AK', 'RM', 'NS', 'VT', 'PL'].map((initials) => (
                    <span
                      key={initials}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-violet-600 text-xs font-black text-white"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex gap-1 text-amber-300" aria-label="Five star rating">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>*</span>
                    ))}
                    <span className="ml-1 font-bold text-white">4.9</span>
                  </div>
                  <p className="text-sm text-slate-400">Trusted by 120+ growing businesses</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <DashboardPreview />
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm font-medium text-sky-200">Trusted by ambitious teams across industries</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 text-lg font-black text-slate-500">
              {['Northstar', 'Vertex', 'Pulse', 'Mono', 'Kinetic'].map((brand) => (
                <span key={brand} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rotate-45 bg-violet-400" />
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="border-b border-white/10 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <Pill>What we do</Pill>
              <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                Everything you need to win online.
              </h2>
              <p className="mt-5 text-lg text-slate-300">
                Strategy, design, technology and growth working together under one roof.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="group relative rounded-lg border border-white/10 bg-surface p-7 transition hover:-translate-y-1 hover:border-violet-400/45 hover:bg-[#151d31]"
                >
                  {service.badge && (
                    <span className="absolute right-5 top-5 rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-200">
                      {service.badge}
                    </span>
                  )}
                  <div className={`mb-7 flex h-11 w-11 items-center justify-center rounded-lg border ${service.accent}`}>
                    <service.icon size={22} />
                  </div>
                  <h3 className="text-xl font-black text-white">{service.title}</h3>
                  <p className="mt-3 min-h-12 text-[15px] leading-6 text-slate-300">{service.description}</p>
                  <ul className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                        <Check size={16} className="text-violet-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-violet-300">
                    Explore service
                    <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="border-b border-white/10 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <Pill>Simple process</Pill>
              <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                From idea to impact in four clear steps.
              </h2>
            </div>

            <div className="relative mt-16 grid gap-8 md:grid-cols-4">
              <div className="absolute left-10 right-10 top-10 hidden border-t border-white/10 md:block" />
              {processSteps.map((step, index) => (
                <article key={step.title} className="relative">
                  <div className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-lg border border-white/10 bg-surface text-violet-300">
                    <step.icon size={32} />
                    <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-black text-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-6 text-slate-300">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <Pill>Why DigiAyudh</Pill>
              <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                Built like your growth depends on it.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Because it does. We combine sharp design, solid engineering and business thinking to create digital products that perform, not just look good.
              </p>

              <div className="mt-10 space-y-7">
                {[
                  ['Business-first thinking', 'Every screen has a job and every feature supports growth.'],
                  ['One reliable team', 'Strategy, design, code and support without vendor chaos.'],
                  ['Clear and transparent', 'Live updates, simple pricing and no mystery timelines.'],
                ].map(([title, description]) => (
                  <div key={title} className="flex gap-4">
                    <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                      <Check size={17} />
                    </span>
                    <div>
                      <h3 className="font-black text-white">{title}</h3>
                      <p className="mt-1 text-slate-300">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-surface p-7">
              <div className="grid grid-cols-3 gap-5 text-center">
                {[
                  ['98%', 'client satisfaction'],
                  ['120+', 'products launched'],
                  ['3.4x', 'average ROI'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-4xl font-black text-violet-300">{value}</p>
                    <p className="mt-1 text-sm text-slate-300">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-lg border border-white/10 bg-[#182235] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-sky-200">Average launch time</p>
                    <p className="text-3xl font-black text-white">2-4 weeks</p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/20 text-violet-200">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-500" />
                </div>
                <p className="mt-5 flex items-center gap-2 text-sm text-slate-300">
                  <Check size={16} className="text-emerald-300" />
                  Verified enterprise delivery standards
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="border-b border-white/10 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <Pill>Selected work</Pill>
              <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                Products we are proud of.
              </h2>
              <p className="mt-5 text-lg text-slate-300">Real solutions, designed around real business goals.</p>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-2">
              <article className="overflow-hidden rounded-lg border border-violet-400/35 bg-surface lg:col-span-2 lg:grid lg:grid-cols-2">
                <div className="bg-[#f7f5f1] p-10 text-slate-950">
                  <p className="text-sm font-semibold text-slate-500">lumera.store</p>
                  <h3 className="mt-5 text-lg font-black">LUMERA</h3>
                  <div className="mt-4 flex gap-5 text-sm text-slate-600">
                    <span>Shop</span>
                    <span>Collections</span>
                    <span>About</span>
                    <span>Bag (2)</span>
                  </div>
                  <p className="mt-16 text-sm font-semibold text-slate-500">NEW COLLECTION</p>
                  <p className="mt-4 max-w-sm text-4xl leading-tight">Objects for slower living.</p>
                  <p className="mt-6 text-sm font-semibold">Shop collection {'->'}</p>
                </div>
                <div className="flex flex-col justify-center p-10">
                  <p className="text-sm font-black text-violet-300">E-COMMERCE - BRAND</p>
                  <h3 className="mt-3 text-3xl font-black text-white">Lumera Living</h3>
                  <p className="mt-4 text-lg text-slate-300">A calm, premium storefront that increased conversion by 64%.</p>
                  <a href="#contact" className="mt-7 inline-flex items-center gap-2 font-bold text-violet-300">
                    View case study
                    <ArrowUpRight size={18} />
                  </a>
                </div>
              </article>

              <article className="overflow-hidden rounded-lg border border-white/10 bg-surface">
                <div className="bg-emerald-400 p-8 text-white">
                  <p className="text-sm font-semibold">Good morning, Ayush</p>
                  <h3 className="mt-2 text-2xl font-black">Your wellness, in one place.</h3>
                  <p className="mt-4 text-3xl font-black">82 score</p>
                </div>
                <div className="p-8">
                  <p className="text-sm font-black text-violet-300">MOBILE APP - WELLNESS</p>
                  <h3 className="mt-3 text-2xl font-black text-white">Viora Health</h3>
                  <p className="mt-3 text-slate-300">A daily health companion designed around trust and momentum.</p>
                </div>
              </article>

              <article className="rounded-lg border border-white/10 bg-surface p-8">
                <p className="text-sm text-sky-200">PERFORMANCE</p>
                <h3 className="mt-2 text-2xl font-black text-white">Campaign analytics</h3>
                <div className="mt-7 grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-2xl font-black text-white">INR 2.4M</p>
                    <p className="text-sm text-slate-400">Revenue</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">8.7x</p>
                    <p className="text-sm text-slate-400">ROAS</p>
                  </div>
                </div>
                <div className="mt-8 h-32 rounded-lg bg-gradient-to-br from-sky-400/20 via-violet-500/20 to-emerald-400/10" />
                <p className="mt-7 text-sm font-black text-violet-300">SAAS - ANALYTICS</p>
                <h3 className="mt-2 text-2xl font-black text-white">ScaleOS</h3>
              </article>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-6xl font-black text-violet-400">"</p>
            <blockquote className="mt-8 text-2xl font-bold leading-10 text-white sm:text-3xl">
              DigiAyudh did not just build our website. They understood the business, simplified the customer journey and gave us a digital system we can actually grow with.
            </blockquote>
            <div className="mt-10 flex flex-col items-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 font-black text-white">
                AN
              </span>
              <p className="mt-5 font-black text-white">Ayush Narware</p>
              <p className="text-slate-300">Developer, DigiAyudh</p>
              <p className="mt-7 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-2 font-bold text-emerald-300">
                +92% conversion rate after launch
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Pill>Questions</Pill>
              <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                Good questions. Clear answers.
              </h2>
              <p className="mt-5 text-xl text-slate-300">Still wondering about something?</p>
              <a href="#contact" className="mt-7 inline-flex items-center gap-2 font-bold text-violet-300">
                Let us chat
                <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="divide-y divide-white/10">
              {faqs.map((item, index) => (
                <div key={item.q} className="py-6">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span className={`text-lg font-black ${expandedFaq === index ? 'text-white' : 'text-slate-100'}`}>
                      {item.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-slate-400 transition ${expandedFaq === index ? 'rotate-180 text-violet-300' : ''}`}
                    />
                  </button>
                  {expandedFaq === index && <p className="mt-4 max-w-3xl leading-7 text-slate-300">{item.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-surface lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <Pill>Start something great</Pill>
              <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                Have an idea? Let us make it real.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Tell us about your project and we will get back to you within one business day.
              </p>
              <div className="mt-9 space-y-4">
                {['Free 30-minute strategy call', 'No-pressure, practical advice', 'Clear scope and next steps'].map((item) => (
                  <p key={item} className="flex items-center gap-3 text-slate-300">
                    <Check size={18} className="text-emerald-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <form
              className="space-y-6 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.30),transparent_38%)] p-8 sm:p-12"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-white">Full Name</span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-white">Email</span>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-white">Service</span>
                <select
                  defaultValue=""
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-300"
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option>Business Website</option>
                  <option>Web Application</option>
                  <option>Mobile Application</option>
                  <option>ERP, CRM or HRMS</option>
                  <option>AI Solution</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-white">Project Details</span>
                <textarea
                  rows={5}
                  placeholder="Tell us about your project..."
                  className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300"
                />
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-violet-600 px-6 py-4 font-black text-white shadow-xl shadow-violet-950/30 transition hover:bg-violet-500"
              >
                Send Project Brief
                <ArrowUpRight size={18} />
              </button>
              <p className="text-center text-sm text-slate-400">Your information is secure and will never be shared.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-sm text-slate-400 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src="/digiayudh-logo.svg" alt="" className="h-8 w-8 rounded-full border border-white/10" />
            <span className="font-bold text-white">DigiAyudh</span>
          </div>
          <p>Copyright 2026 DigiAyudh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
