import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    // TODO: Replace this with the actual auth check once auth is implemented.
    // Example: const { isAuthenticated } = useAuthStore.getState()
    const isAuthenticated = true

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          returnTo: location.href,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
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
