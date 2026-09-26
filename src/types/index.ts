export type Role = 'CEO' | 'CVO' | 'CMO' | 'CTO' | 'CDO'

export type DepartmentSlug = 'news-channel' | 'marketing' | 'business-acquisition' | 'institutional-solutions'

export type Status = 'green' | 'yellow' | 'red'

export interface Department {
  id: string
  slug: DepartmentSlug
  name: string
  focus_area: string
  official_name: string
  official_role: Role
  team: string[]
}

export interface TeamMember {
  id: string
  department_id: string
  name: string
  role_title: string
  created_at: string
}

export interface Profile {
  id: string
  full_name: string
  email: string
  role: Role
  department_id: string | null
}

export interface DailyUpdate {
  id: string
  department_id: string
  created_by: string
  date: string
  overall_status: Status
  work_completed: string
  work_in_progress: string
  leads_generated: number
  calls_completed: number
  meetings: number
  projects_started: number
  projects_completed: number
  tasks_completed: number
  revenue: number
  blockers: string
  support_needed: string
  tomorrow_priorities: string
  notes: string
  created_at: string
}

export interface WeeklyReport {
  id: string
  department_id: string
  created_by: string
  week_start: string
  week_end: string
  achievements: string
  leads: number
  sales: number
  projects_completed: number
  team_productivity_notes: string
  completed_work: string
  pending_work: string
  problems: string
  next_week_priorities: string
  created_at: string
}

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical'
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved'

export interface Issue {
  id: string
  department_id: string
  created_by: string
  title: string
  priority: IssuePriority
  description: string
  expected_resolution_date: string | null
  status: IssueStatus
  created_at: string
}

export interface Feedback {
  id: string
  department_id: string
  from_ceo: string
  to_official: string
  related_report_id: string | null
  message: string
  created_at: string
  read: boolean
}

export interface AppNotification {
  id: string
  user_id: string
  type: 'daily_report' | 'weekly_report' | 'issue' | 'critical_issue' | 'feedback' | 'missed_report' | 'status_change'
  title: string
  body: string
  read: boolean
  created_at: string
}

export interface DepartmentSummary {
  department: Department
  status: Status
  today_progress: string
  weekly_progress: string
  monthly_progress: string
  key_metric_label: string
  key_metric_value: string
  pending_items: number
  open_issues: number
}
