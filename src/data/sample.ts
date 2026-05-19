export type Metric = readonly [label: string, value: string, note: string];

export type WorkCard = {
  title: string;
  stage: string;
  detail: string;
  health: number;
};

export type DemoSection = readonly [title: string, body: string];

export type DemoData = {
  title: string;
  offer: string;
  service: string;
  tagline: string;
  demoLabel: string;
  accent: string;
  warm: string;
  bg: string;
  repo: string;
  liveUrl: string;
  metrics: Metric[];
  pipeline: string[];
  cards: WorkCard[];
  sections: DemoSection[];
  deliverables: string[];
};

export const demo: DemoData = {
  "title": "Workflow Dashboard Cleanup",
  "offer": "Fixed 48-hour workflow/dashboard cleanup",
  "service": "Workflow repair command center",
  "tagline": "Turn a scattered workflow into a clean operating view with intake, triage, before/after state, and a handoff plan.",
  "demoLabel": "Workflow repair demo",
  "accent": "#345c3b",
  "warm": "#be8f5d",
  "bg": "#f7f3ea",
  "repo": "https://github.com/foxandhenllc/foxhen-workflow-dashboard-cleanup",
  "liveUrl": "https://foxhen-workflow-dashboard-cleanup.vercel.app",
  "metrics": [
    [
      "Manual touchpoints",
      "14 → 5",
      "Reduced handoff drag"
    ],
    [
      "Status clarity",
      "42% → 91%",
      "Owners and next steps are visible"
    ],
    [
      "Weekly review time",
      "2.5h → 45m",
      "A single dashboard replaces scattered notes"
    ]
  ],
  "pipeline": [
    "Intake received",
    "Bottleneck mapped",
    "Fix path selected",
    "Handoff ready"
  ],
  "cards": [
    {
      "title": "Duplicate status sources",
      "stage": "Before",
      "detail": "Three trackers disagree on owner and next action.",
      "health": 38
    },
    {
      "title": "Approval wait state",
      "stage": "Triage",
      "detail": "Two tasks need a named reviewer before work resumes.",
      "health": 64
    },
    {
      "title": "Clean handoff lane",
      "stage": "After",
      "detail": "Every item now has owner, status, and next checkpoint.",
      "health": 92
    }
  ],
  "sections": [
    [
      "Audit focus",
      "Map the current workflow, identify duplicate fields, and mark the smallest useful repair."
    ],
    [
      "Repair pass",
      "Consolidate noisy states into a readable dashboard with visible ownership."
    ],
    [
      "Handoff",
      "Package the final view with notes, checks, and next recommended improvement."
    ]
  ],
  "deliverables": [
    "Before/after workflow map",
    "Priority issue queue",
    "Handoff report"
  ]
};
