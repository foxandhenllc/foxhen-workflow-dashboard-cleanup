import { useMemo, useState } from 'react';
import { priorityScore, type DemoData, type IssueStatus, type LaneId, type WorkflowIssue } from '../data/sample';

type DemoShellProps = {
  demo: DemoData;
};

const statusLabels: Record<IssueStatus | 'all', string> = {
  all: 'All issues',
  stuck: 'Stuck',
  active: 'Active',
  watching: 'Watching',
  ready: 'Ready',
};

const laneOrder: LaneId[] = ['intake', 'triage', 'repair', 'handoff'];

function statusTone(status: IssueStatus) {
  if (status === 'stuck') return 'border-rose-400/40 bg-rose-400/10 text-rose-100';
  if (status === 'active') return 'border-amber-300/40 bg-amber-300/10 text-amber-100';
  if (status === 'ready') return 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100';
  return 'border-sky-300/35 bg-sky-300/10 text-sky-100';
}

function priorityTone(score: number) {
  if (score >= 86) return 'text-rose-950 bg-rose-200';
  if (score >= 76) return 'text-amber-950 bg-amber-200';
  return 'text-emerald-950 bg-emerald-200';
}

function getSelectedChecks(issueIds: string[], issues: WorkflowIssue[]) {
  return new Set(
    issues
      .filter((issue) => issueIds.includes(issue.id))
      .flatMap((issue) => issue.acceptanceCheckIds),
  );
}

export function DemoShell({ demo }: DemoShellProps) {
  const [scenarioId, setScenarioId] = useState(demo.scenarios[0].id);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [selectedIssueId, setSelectedIssueId] = useState(demo.scenarios[0].recommendedIssueId);
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [copied, setCopied] = useState(false);

  const scenario = demo.scenarios.find((item) => item.id === scenarioId) ?? demo.scenarios[0];
  const scenarioIssues = useMemo(
    () =>
      scenario.activeIssueIds
        .map((id) => demo.issues.find((issue) => issue.id === id))
        .filter((issue): issue is WorkflowIssue => Boolean(issue))
        .sort((left, right) => priorityScore(right) - priorityScore(left)),
    [demo.issues, scenario.activeIssueIds],
  );
  const filteredIssues = statusFilter === 'all' ? scenarioIssues : scenarioIssues.filter((issue) => issue.status === statusFilter);
  const selectedIssue = scenarioIssues.find((issue) => issue.id === selectedIssueId) ?? scenarioIssues[0];
  const visibleCheckIds = getSelectedChecks(scenario.activeIssueIds, demo.issues);
  const requiredChecks = demo.checks.filter((check) => check.required);
  const passedRequiredChecks = requiredChecks.filter((check) => visibleCheckIds.has(check.id));
  const readiness = Math.round((passedRequiredChecks.length / requiredChecks.length) * 100);
  const avgPriority = Math.round(scenarioIssues.reduce((sum, issue) => sum + priorityScore(issue), 0) / scenarioIssues.length);
  const ownerMap = new Map(demo.roles.map((role) => [role.id, role]));

  function selectScenario(nextScenarioId: string) {
    const nextScenario = demo.scenarios.find((item) => item.id === nextScenarioId) ?? demo.scenarios[0];
    setScenarioId(nextScenario.id);
    setSelectedIssueId(nextScenario.recommendedIssueId);
    setStatusFilter('all');
    setCopied(false);
  }

  function simulateCopy() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0d1110] text-stone-50">
      <section className="relative min-h-screen px-5 py-5 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(246,179,91,0.2),transparent_28%),radial-gradient(circle_at_72%_8%,rgba(119,164,138,0.18),transparent_30%),linear-gradient(135deg,#101614_0%,#0d1110_52%,#17110b_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
        <div className="relative z-10 mx-auto flex max-w-[90rem] items-center justify-between border-b border-white/10 pb-5">
          <a href={demo.liveUrl} className="group flex items-center gap-3" aria-label="Workflow cleanup demo">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-amber-200/40 bg-amber-200 text-sm font-black text-stone-950 shadow-[0_0_24px_rgba(246,179,91,0.32)] transition-transform group-hover:scale-105">
              F&H
            </span>
            <span>
              <span className="block text-sm font-black tracking-tight">{demo.product}</span>
              <span className="block text-xs text-stone-400">{demo.eyebrow}</span>
            </span>
          </a>
          <div className="hidden items-center gap-2 text-sm text-stone-300 md:flex">
            <a className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white" href="#command">
              Command view
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white" href="#handoff">
              Handoff
            </a>
            <a className="rounded-full border border-white/10 px-3 py-2 transition hover:border-amber-200/40 hover:text-amber-100" href={demo.repo}>
              Repository
            </a>
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-[90rem] gap-8 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:py-14">
          <div className="animate-rise">
            <p className="inline-flex rounded-full border border-amber-200/25 bg-amber-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.26em] text-amber-100">
              {scenario.name}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.06em] text-white sm:text-7xl xl:text-8xl">
              {demo.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300 sm:text-xl">{demo.tagline}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="rounded-full bg-amber-200 px-6 py-3 text-center text-sm font-black text-stone-950 shadow-[0_18px_60px_rgba(246,179,91,0.22)] transition hover:-translate-y-0.5 hover:bg-amber-100" href="#command">
                Operate the demo
              </a>
              <button
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                type="button"
                onClick={simulateCopy}
              >
                {copied ? 'Handoff copied' : 'Simulate handoff copy'}
              </button>
            </div>
          </div>

          <div className="animate-rise [animation-delay:120ms]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="rounded-[1.55rem] border border-white/10 bg-[#111715]/95 p-4">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.26em] text-stone-500">Current simulation</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight">{scenario.brief}</h2>
                  </div>
                  <span className="w-fit rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">
                    Static local data
                  </span>
                </div>

                <div className="grid gap-3 py-4 sm:grid-cols-3">
                  {scenario.impactMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:bg-white/[0.07]">
                      <p className="text-sm text-stone-400">{metric.label}</p>
                      <p className="mt-3 text-3xl font-black tracking-tight">
                        {metric.before} <span className="text-amber-200">→</span> {metric.after}
                      </p>
                      <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">{metric.delta}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-[0.7fr_1fr_0.75fr]">
                  <div className="rounded-3xl border border-white/10 bg-black/18 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-500">Readiness</p>
                    <p className="mt-3 text-5xl font-black tracking-[-0.06em]">{readiness}%</p>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-amber-200 transition-all duration-500" style={{ width: `${readiness}%` }} />
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/18 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-500">Operator goal</p>
                    <p className="mt-3 text-sm leading-6 text-stone-200">{scenario.operatorGoal}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/18 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-500">Avg priority</p>
                    <p className="mt-3 text-5xl font-black tracking-[-0.06em]">{avgPriority}</p>
                    <p className="mt-2 text-sm text-stone-400">Score blends severity, effort, and confidence.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="command" className="relative px-5 pb-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[90rem]">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-amber-200">Command view</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">Choose a scenario, then work the queue.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-stone-400">
              Every interaction is powered by fictional TypeScript data in the browser: no accounts, forms, server calls, or production systems.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
            <aside className="space-y-3">
              {demo.scenarios.map((item) => (
                <button
                  key={item.id}
                  className={`w-full rounded-3xl border p-4 text-left transition ${
                    item.id === scenario.id
                      ? 'border-amber-200/60 bg-amber-200 text-stone-950 shadow-[0_18px_60px_rgba(246,179,91,0.18)]'
                      : 'border-white/10 bg-white/[0.05] text-stone-100 hover:border-white/25 hover:bg-white/[0.08]'
                  }`}
                  type="button"
                  onClick={() => selectScenario(item.id)}
                >
                  <span className="text-sm font-black">{item.name}</span>
                  <span className={`mt-2 block text-sm leading-5 ${item.id === scenario.id ? 'text-stone-700' : 'text-stone-400'}`}>{item.subtitle}</span>
                </button>
              ))}
            </aside>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(statusLabels) as Array<IssueStatus | 'all'>).map((status) => (
                      <button
                        key={status}
                        className={`rounded-full px-4 py-2 text-sm font-black transition ${
                          statusFilter === status ? 'bg-white text-stone-950' : 'border border-white/10 bg-black/15 text-stone-300 hover:bg-white/10'
                        }`}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                  <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
                    {(['before', 'after'] as const).map((item) => (
                      <button
                        key={item}
                        className={`rounded-full px-4 py-2 text-sm font-black capitalize transition ${mode === item ? 'bg-amber-200 text-stone-950' : 'text-stone-400 hover:text-white'}`}
                        type="button"
                        onClick={() => setMode(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  {filteredIssues.map((issue) => {
                    const role = ownerMap.get(issue.roleId);
                    const score = priorityScore(issue);

                    return (
                      <button
                        key={issue.id}
                        className={`group rounded-3xl border p-4 text-left transition duration-300 ${
                          selectedIssue.id === issue.id
                            ? 'border-amber-200/60 bg-white/[0.12] shadow-[0_18px_70px_rgba(0,0,0,0.28)]'
                            : 'border-white/10 bg-black/15 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]'
                        }`}
                        type="button"
                        onClick={() => setSelectedIssueId(issue.id)}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`rounded-full px-3 py-1 text-xs font-black ${priorityTone(score)}`}>P{score}</span>
                              <span className={`rounded-full border px-3 py-1 text-xs font-black capitalize ${statusTone(issue.status)}`}>{issue.status}</span>
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-stone-300">{demo.lanes[issue.lane]}</span>
                            </div>
                            <h3 className="mt-4 text-xl font-black tracking-tight text-white">{issue.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-stone-400">{issue.summary}</p>
                          </div>
                          <div className="min-w-32 rounded-2xl border border-white/10 bg-black/20 p-3">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">Owner</p>
                            <p className="mt-2 text-sm font-black text-stone-100">{role?.name}</p>
                          </div>
                        </div>
                        <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-stone-300">
                          <span className="font-black text-amber-100">{mode === 'before' ? 'Before: ' : 'After: '}</span>
                          {mode === 'before' ? issue.before : issue.after}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-stone-500">Selected fix</p>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-white">{selectedIssue.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-400">{scenario.serviceMapping}</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-black/20 p-3">
                      <p className="text-xs text-stone-500">Severity</p>
                      <p className="mt-1 text-2xl font-black">{selectedIssue.severity}/5</p>
                    </div>
                    <div className="rounded-2xl bg-black/20 p-3">
                      <p className="text-xs text-stone-500">Effort</p>
                      <p className="mt-1 text-2xl font-black">{selectedIssue.effort}/5</p>
                    </div>
                    <div className="rounded-2xl bg-black/20 p-3">
                      <p className="text-xs text-stone-500">Confidence</p>
                      <p className="mt-1 text-2xl font-black">{selectedIssue.confidence}%</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-stone-500">Status lanes</p>
                  <div className="mt-4 space-y-3">
                    {laneOrder.map((lane) => {
                      const count = scenarioIssues.filter((issue) => issue.lane === lane).length;
                      return (
                        <div key={lane} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3">
                          <span className="text-sm font-bold text-stone-300">{demo.lanes[lane]}</span>
                          <span className="h-2 overflow-hidden rounded-full bg-white/10">
                            <span className="block h-full rounded-full bg-amber-200 transition-all duration-500" style={{ width: `${Math.max(12, count * 28)}%` }} />
                          </span>
                          <span className="text-right text-sm font-black">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-stone-500">Role load</p>
                  <div className="mt-4 space-y-4">
                    {demo.roles.map((role) => (
                      <div key={role.id}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-black text-stone-100">{role.name}</p>
                          <p className="text-sm text-stone-400">{role.load}%</p>
                        </div>
                        <p className="mt-1 text-xs text-stone-500">{role.focus}</p>
                        <div className="mt-2 h-1.5 rounded-full bg-white/10">
                          <div className="h-1.5 rounded-full bg-white/70" style={{ width: `${role.load}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section id="handoff" className="px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[90rem] gap-5 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#f3eadc] p-5 text-stone-950 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-stone-500">Acceptance checks</p>
                <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">Handoff readiness checklist</h2>
              </div>
              <div className="rounded-full bg-stone-950 px-4 py-2 text-sm font-black text-white">{readiness}% ready</div>
            </div>
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {demo.checks.map((check) => {
                const isMet = visibleCheckIds.has(check.id);
                return (
                  <div key={check.id} className={`rounded-3xl border p-5 transition ${isMet ? 'border-emerald-700/20 bg-white' : 'border-stone-950/10 bg-stone-950/[0.04]'}`}>
                    <div className="flex items-start gap-3">
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-black ${isMet ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-600'}`}>
                        {isMet ? '✓' : '–'}
                      </span>
                      <div>
                        <h3 className="font-black">{check.label}</h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">{check.detail}</p>
                        {check.required && <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-stone-500">Required</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-200/20 bg-amber-200 p-5 text-stone-950 shadow-[0_24px_90px_rgba(246,179,91,0.18)] sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-stone-700">Export preview</p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">A concise handoff the buyer can inspect.</h2>
            <div className="mt-6 space-y-3">
              {scenario.handoffNotes.map((note) => (
                <div key={note.title} className="rounded-3xl bg-stone-950 p-5 text-white">
                  <h3 className="font-black">{note.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{note.body}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-6 w-full rounded-full bg-stone-950 px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-stone-800"
              type="button"
              onClick={simulateCopy}
            >
              {copied ? 'Copied simulated handoff state' : 'Copy simulated handoff'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
