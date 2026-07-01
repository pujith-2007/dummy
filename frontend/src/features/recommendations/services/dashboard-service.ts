import { MOCK_DASHBOARD_DATA } from '../data/mock-data'
import type { DashboardData } from '../types'

/**
 * Simulates a network call to retrieve the SRE Readiness Dashboard metrics.
 * Incorporates a 500ms response delay to demonstrate loading skeleton UI components.
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DASHBOARD_DATA)
    }, 500)
  })
}
