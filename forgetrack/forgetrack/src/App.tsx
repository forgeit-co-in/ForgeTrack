import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRouter } from '@/routes/RoleRouter'
import { Login } from '@/pages/Login'
import { NotFound } from '@/pages/NotFound'
import { Notifications } from '@/pages/Notifications'

import { CeoLayout } from '@/layouts/CeoLayout'
import { CeoDashboard } from '@/pages/ceo/CeoDashboard'
import { DepartmentsIndex, DepartmentDetail } from '@/pages/ceo/Departments'
import { CeoAnalytics } from '@/pages/ceo/Analytics'
import { CeoReports } from '@/pages/ceo/Reports'
import { CeoIssues } from '@/pages/ceo/CeoIssues'
import { CeoFeedback } from '@/pages/ceo/CeoFeedback'

import { OfficialLayout } from '@/layouts/OfficialLayout'
import { OfficialDashboard } from '@/pages/official/OfficialDashboard'
import { Team } from '@/pages/official/Team'
import { DailyUpdate } from '@/pages/official/DailyUpdate'
import { WeeklyReport } from '@/pages/official/WeeklyReport'
import { OfficialIssues } from '@/pages/official/OfficialIssues'
import { OfficialFeedback } from '@/pages/official/OfficialFeedback'
import { DepartmentAnalytics } from '@/pages/official/DepartmentAnalytics'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RoleRouter />} />

          <Route element={<ProtectedRoute allow={['CEO']} />}>
            <Route path="/ceo" element={<CeoLayout />}>
              <Route index element={<CeoDashboard />} />
              <Route path="departments" element={<DepartmentsIndex />} />
              <Route path="departments/:slug" element={<DepartmentDetail />} />
              <Route path="analytics" element={<CeoAnalytics />} />
              <Route path="reports" element={<CeoReports />} />
              <Route path="issues" element={<CeoIssues />} />
              <Route path="feedback" element={<CeoFeedback />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allow={['CVO', 'CMO', 'CTO', 'CDO']} />}>
            <Route path="/department" element={<OfficialLayout />}>
              <Route index element={<OfficialDashboard />} />
              <Route path="team" element={<Team />} />
              <Route path="daily-update" element={<DailyUpdate />} />
              <Route path="weekly-report" element={<WeeklyReport />} />
              <Route path="analytics" element={<DepartmentAnalytics />} />
              <Route path="issues" element={<OfficialIssues />} />
              <Route path="feedback" element={<OfficialFeedback />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
