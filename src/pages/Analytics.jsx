import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Plus, Download, TrendingUp, Users, Key, Package } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import StatCard from '../components/ui/StatCard'
import { useApi, useAsyncAction } from '../hooks/useApi'
import { analyticsService, reportsService } from '../services/api'
import { format } from 'date-fns'

const Analytics = () => {
  const { data: stats, loading } = useApi(() => analyticsService.getDashboardStats(), [])
  const { execute: executeReport } = useAsyncAction()

  const handleGenerateReport = async () => {
    const result = await executeReport(
      () => reportsService.generateLicenseReport(),
      {
        successMessage: 'Analytics report generated successfully'
      }
    )

    if (result.success) {
      // Download the report as JSON
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const analyticsStats = [
    {
      title: 'Total Licenses',
      value: stats?.totalLicenses?.toString() || '0',
      change: '+5.2%',
      icon: Key,
      trend: 'up',
      color: 'primary'
    },
    {
      title: 'Active Users',
      value: stats?.totalUsers?.toString() || '0',
      change: '+12.1%',
      icon: Users,
      trend: 'up',
      color: 'success'
    },
    {
      title: 'Products',
      value: stats?.totalProducts?.toString() || '0',
      change: '+2',
      icon: Package,
      trend: 'up',
      color: 'accent'
    },
    {
      title: 'Growth Rate',
      value: '15.3%',
      change: '+2.1%',
      icon: TrendingUp,
      trend: 'up',
      color: 'warning'
    }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            View detailed analytics and reports
          </p>
        </div>
        
        <Button onClick={handleGenerateReport}>
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </motion.div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              License Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <p className="text-secondary-600 dark:text-secondary-400">
                  Chart component will be integrated here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-success-50 to-warning-50 dark:from-success-900/20 dark:to-warning-900/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-success-500 mx-auto mb-4" />
                <p className="text-secondary-600 dark:text-secondary-400">
                  Revenue chart will be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analytics Events</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentActivities?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivities.slice(0, 5).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800/50"
                >
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100">
                      {activity.event_type.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="text-sm text-secondary-500">
                    License: {activity.licenses?.license_key || 'N/A'}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
              <p className="text-sm text-secondary-500">No analytics events yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics