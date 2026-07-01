import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/home')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})