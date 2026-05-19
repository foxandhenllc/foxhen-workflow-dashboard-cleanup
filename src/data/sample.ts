export type Role = {
  id: string;
  name: string;
  focus: string;
  load: number;
};

export type LaneId = 'intake' | 'triage' | 'repair' | 'handoff';

export type IssueStatus = 'stuck' | 'active' | 'watching' | 'ready';

export type WorkflowIssue = {
  id: string;
  title: string;
  summary: string;
  lane: LaneId;
  roleId: string;
  severity: 1 | 2 | 3 | 4 | 5;
  effort: 1 | 2 | 3 | 4 | 5;
  confidence: number;
  status: IssueStatus;
  before: string;
  after: string;
  acceptanceCheckIds: string[];
};

export type AcceptanceCheck = {
  id: string;
  label: string;
  detail: string;
  required: boolean;
};

export type ImpactMetric = {
  label: string;
  before: string;
  after: string;
  delta: string;
};

export type HandoffNote = {
  title: string;
  body: string;
};

export type Scenario = {
  id: string;
  name: string;
  subtitle: string;
  brief: string;
  operatorGoal: string;
  serviceMapping: string;
  activeIssueIds: string[];
  recommendedIssueId: string;
  impactMetrics: ImpactMetric[];
  handoffNotes: HandoffNote[];
};

export type DemoData = {
  product: string;
  eyebrow: string;
  title: string;
  tagline: string;
  repo: string;
  liveUrl: string;
  accent: string;
  lanes: Record<LaneId, string>;
  roles: Role[];
  checks: AcceptanceCheck[];
  issues: WorkflowIssue[];
  scenarios: Scenario[];
};

export const priorityScore = (issue: WorkflowIssue) =>
  Math.round((issue.severity * 18 + (6 - issue.effort) * 9 + issue.confidence * 0.55) / 1.35);

export const demo: DemoData = {
  product: 'Fox & Hen / Workflow Cleanup',
  eyebrow: '48-hour public-safe command center',
  title: 'A real operating view for a messy workflow rescue.',
  tagline:
    'Switch scenarios, triage invented issues, compare the repaired dashboard state, and package a handoff note without a backend or sensitive data.',
  repo: 'https://github.com/foxandhenllc/foxhen-workflow-dashboard-cleanup',
  liveUrl: 'https://foxhen-workflow-dashboard-cleanup.vercel.app',
  accent: '#f6b35b',
  lanes: {
    intake: 'Intake',
    triage: 'Triage',
    repair: 'Repair pass',
    handoff: 'Handoff',
  },
  roles: [
    { id: 'ops', name: 'Ops lead', focus: 'Decisions, due dates, ownership', load: 78 },
    { id: 'builder', name: 'Dashboard builder', focus: 'Views, formulas, status logic', load: 64 },
    { id: 'reviewer', name: 'Reviewer', focus: 'Acceptance checks and signoff', load: 42 },
    { id: 'handoff', name: 'Handoff owner', focus: 'Training note and next steps', load: 35 },
  ],
  checks: [
    {
      id: 'owner',
      label: 'Every active row has one owner',
      detail: 'No shared or blank ownership in the repaired view.',
      required: true,
    },
    {
      id: 'next',
      label: 'Next action is visible in one scan',
      detail: 'A reviewer can tell what moves each item forward.',
      required: true,
    },
    {
      id: 'source',
      label: 'One source of status truth',
      detail: 'Duplicate trackers are retired or marked reference-only.',
      required: true,
    },
    {
      id: 'aging',
      label: 'Aging rule flags stale work',
      detail: 'Items older than the agreed window surface automatically.',
      required: false,
    },
    {
      id: 'handoff',
      label: 'Handoff note includes decisions',
      detail: 'The final note explains what changed, why, and what to review next.',
      required: true,
    },
  ],
  issues: [
    {
      id: 'duplicate-trackers',
      title: 'Three trackers disagree on status',
      summary: 'The same request appears in an inbox sheet, a task board, and a weekly notes table.',
      lane: 'triage',
      roleId: 'ops',
      severity: 5,
      effort: 2,
      confidence: 92,
      status: 'stuck',
      before: 'Operators reconcile rows manually before every review.',
      after: 'One dashboard becomes the current view; older sources are reference-only.',
      acceptanceCheckIds: ['source', 'owner', 'handoff'],
    },
    {
      id: 'approval-shadow',
      title: 'Approval wait state has no reviewer',
      summary: 'Work pauses when a review is needed, but no lane distinguishes waiting from blocked.',
      lane: 'repair',
      roleId: 'reviewer',
      severity: 4,
      effort: 2,
      confidence: 86,
      status: 'active',
      before: 'Items sit in progress until someone asks who owns review.',
      after: 'A waiting-for-review lane shows reviewer, age, and requested decision.',
      acceptanceCheckIds: ['owner', 'next', 'aging'],
    },
    {
      id: 'hidden-priority',
      title: 'Urgent work is sorted by arrival date',
      summary: 'A low-impact old request ranks above newer items that affect launch readiness.',
      lane: 'triage',
      roleId: 'builder',
      severity: 5,
      effort: 3,
      confidence: 81,
      status: 'active',
      before: 'The queue rewards age instead of business impact.',
      after: 'Priority score blends severity, effort, and confidence for a visible first pass.',
      acceptanceCheckIds: ['next', 'handoff'],
    },
    {
      id: 'missing-acceptance',
      title: 'Done means different things by role',
      summary: 'Builders, reviewers, and operators each use a different completion standard.',
      lane: 'handoff',
      roleId: 'handoff',
      severity: 4,
      effort: 1,
      confidence: 89,
      status: 'watching',
      before: 'Completed rows reopen because expectations were implicit.',
      after: 'Acceptance checks sit beside every fix and power the readiness score.',
      acceptanceCheckIds: ['owner', 'next', 'handoff'],
    },
    {
      id: 'manual-weekly-rollup',
      title: 'Weekly rollup takes two hours',
      summary: 'A status summary is rewritten from scratch because the dashboard lacks stable sections.',
      lane: 'repair',
      roleId: 'builder',
      severity: 3,
      effort: 3,
      confidence: 76,
      status: 'watching',
      before: 'The operator writes a fresh narrative before each standup.',
      after: 'Metrics, hot issues, and handoff notes are export-ready from one screen.',
      acceptanceCheckIds: ['source', 'handoff'],
    },
    {
      id: 'handoff-context',
      title: 'New helper lacks context',
      summary: 'The next person can see tasks, but not why the repair choices were made.',
      lane: 'handoff',
      roleId: 'handoff',
      severity: 3,
      effort: 1,
      confidence: 94,
      status: 'ready',
      before: 'A helper needs a call before touching the dashboard.',
      after: 'A concise handoff note includes decisions, checks, and open watch items.',
      acceptanceCheckIds: ['handoff', 'next'],
    },
  ],
  scenarios: [
    {
      id: 'launch-readiness',
      name: 'Launch readiness',
      subtitle: 'Best for a founder who needs clarity before a deadline.',
      brief: 'The workflow has the right work, but launch-critical rows are buried under stale tasks.',
      operatorGoal: 'Make the next 48 hours obvious: what matters, who owns it, and what is ready to hand off.',
      serviceMapping: 'Audit queue logic, score blockers, and package a launch-focused handoff.',
      activeIssueIds: ['hidden-priority', 'approval-shadow', 'missing-acceptance', 'handoff-context'],
      recommendedIssueId: 'hidden-priority',
      impactMetrics: [
        { label: 'Review prep', before: '2.5 hr', after: '38 min', delta: '75% faster' },
        { label: 'Rows with owner', before: '58%', after: '100%', delta: '+42 pts' },
        { label: 'Ready-to-handoff', before: '31%', after: '86%', delta: '+55 pts' },
      ],
      handoffNotes: [
        {
          title: 'Decision rule',
          body: 'Sort launch work by priority score first, then age. Revisit scores after the first review cycle.',
        },
        {
          title: 'Watch item',
          body: 'Approval wait state needs a named reviewer before the repair can be considered stable.',
        },
      ],
    },
    {
      id: 'ops-reset',
      name: 'Ops reset',
      subtitle: 'Best for a team that outgrew a lightweight tracker.',
      brief: 'The team uses too many sources, so the same work is interpreted differently by each role.',
      operatorGoal: 'Turn scattered status into one calm operating surface that supports weekly review.',
      serviceMapping: 'Retire duplicate status sources, normalize lanes, and document ownership.',
      activeIssueIds: ['duplicate-trackers', 'manual-weekly-rollup', 'missing-acceptance', 'approval-shadow'],
      recommendedIssueId: 'duplicate-trackers',
      impactMetrics: [
        { label: 'Status sources', before: '3', after: '1', delta: '-2 sources' },
        { label: 'Manual touchpoints', before: '14', after: '5', delta: '-64%' },
        { label: 'Stale rows surfaced', before: '0', after: '9', delta: 'visible' },
      ],
      handoffNotes: [
        {
          title: 'Source rule',
          body: 'The command center is current. Legacy tables stay linked for history, not daily decisions.',
        },
        {
          title: 'Review habit',
          body: 'Run the weekly review from metrics, hot issues, and acceptance checks in that order.',
        },
      ],
    },
    {
      id: 'handoff-sprint',
      name: 'Handoff sprint',
      subtitle: 'Best when a project needs to become maintainable fast.',
      brief: 'The dashboard works for its creator, but not for the next helper who inherits it.',
      operatorGoal: 'Clarify decisions, checks, and next steps so a new operator can continue without a meeting.',
      serviceMapping: 'Create a documented handoff package with readiness checks and open risks.',
      activeIssueIds: ['handoff-context', 'missing-acceptance', 'manual-weekly-rollup', 'duplicate-trackers'],
      recommendedIssueId: 'handoff-context',
      impactMetrics: [
        { label: 'Ramp-up call', before: '60 min', after: '10 min', delta: 'lighter' },
        { label: 'Checks documented', before: '1/5', after: '5/5', delta: 'complete' },
        { label: 'Open decisions', before: 'unknown', after: '2', delta: 'named' },
      ],
      handoffNotes: [
        {
          title: 'Training path',
          body: 'Start with the before/after board, then use acceptance checks to explain how done is defined.',
        },
        {
          title: 'Open risk',
          body: 'If duplicate sources return, the handoff owner should mark one as current and archive the rest.',
        },
      ],
    },
  ],
};
