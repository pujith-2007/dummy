import { createFileRoute } from '@tanstack/react-router'
import { MultiRoleAuth } from '../features/authentication/components/multi-role-auth'

export const Route = createFileRoute('/')({
  component: MultiRoleAuth,
})

