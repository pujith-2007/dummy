import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true'

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  )
}
