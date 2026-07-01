import { createFileRoute } from '@tanstack/react-router'
import { DashboardShell } from '@/features/recommendations/components/dashboard-shell'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return <DashboardShell />
}
