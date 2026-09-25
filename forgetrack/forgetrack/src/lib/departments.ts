import { Department } from '@/types'

// Static org chart used to render department config in the UI.
// Actual live data (ids) is joined from the `departments` table at runtime.
export const DEPARTMENT_CONFIG: Record<string, Omit<Department, 'id'>> = {
  'news-channel': {
    slug: 'news-channel',
    name: 'News Channel',
    focus_area: 'News Channel project',
    official_name: 'Sriram',
    official_role: 'CVO',
    team: ['Research Analyst', 'Business Analyst', 'Pitch Deck / UI Designer', 'Salesperson']
  },
  marketing: {
    slug: 'marketing',
    name: 'Marketing',
    focus_area: 'Forgeit marketing & other marketing projects',
    official_name: 'Karthik',
    official_role: 'CMO',
    team: ['Video Editor', 'Video Editor', 'Content Writer', 'Data Analyst', 'Poster Designer']
  },
  'business-acquisition': {
    slug: 'business-acquisition',
    name: 'Business Acquisition',
    focus_area: 'Restaurants, boutiques, beauty, fitness — Chennai-wide lead gen, websites & marketing',
    official_name: 'Tharun V',
    official_role: 'CTO',
    team: ['Cold Caller', 'Cold Caller', 'Cold Caller', 'Web Designer', 'Web Designer', 'Data Analyst', 'Data Analyst', 'Data Analyst']
  },
  'institutional-solutions': {
    slug: 'institutional-solutions',
    name: 'Business & Institutional Solutions',
    focus_area: 'Salons, govt schools, hardware units, hospitals — websites, marketing & software',
    official_name: 'Manobala C',
    official_role: 'CDO',
    team: ['Cold Caller', 'Cold Caller', 'Cold Caller', 'Data Analyst', 'Data Analyst', 'Data Analyst', 'Web Designer', 'Web Designer']
  }
}

export const ROLE_TO_SLUG: Record<string, string> = {
  CVO: 'news-channel',
  CMO: 'marketing',
  CTO: 'business-acquisition',
  CDO: 'institutional-solutions'
}
