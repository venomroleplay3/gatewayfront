import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Key,
  Users,
  Package,
  TrendingUp,
  Activity,
  Shield,
  Clock,
  AlertTriangle,
  Plus
} from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import CreateLicenseModal from '../components/modals/CreateLicenseModal'
import { useApi } from '../hooks/useApi'
import { analyticsService } from '../services/api'
import { format } from 'date-fns'

const Dashboard = () => {
  const [showCreateLicense, setShowCreateLicense] = useState(false)
  const { data: stats, loading, refetch } = useApi(() => analyticsService.getDashboardStats(), [])

  const handleCreateLicense = () => {
    setShowCreateLicense(true)
  }

  const handleLicenseCreated = () => {
    refetch()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const dashboardStats = [
    {
      title: 'Active Licenses',
      value: stats?.activeLicenses?.toString() || '0',
      change: '+12.5%',
      icon: Key,
      trend: 'up',
      color: 'primary'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers?.toString() || '0',
      change: '+8.2%',
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
      title: 'Revenue',
      value: '$24,567',
      change: '+15.3%',
      icon: TrendingUp,
      trend: 'up',
      color: 'warning'
    }
  ]

  const getActivityIcon = (eventType) => {
    switch (eventType) {
      case 'license_created':
        return Key
      case 'user_registered':
        return Users
      case 'license_expired':
        return AlertTriangle
      case 'product_updated':
        return Package
      default:
        return Activity
    }
  }

  const getActivityColor = (eventType) => {
    switch (eventType) {
      case 'license_created':
        return 'success'
      case 'user_registered':
        return 'primary'
      case 'license_expired':
        return 'warning'
      case 'product_updated':
        return 'accent'
      default:
        return 'primary'
    }
  }

  const getActivityMessage = (activity) => {
    switch (activity.event_type) {
      case 'license_created':
        return `New license created for ${activity.licenses?.products?.name || 'product'}`
      case 'user_registered':
        return 'New user registered'
      case 'license_expired':
        return 'License expired'
      case 'product_updated':
        return 'Product updated'
      default:
        return activity.event_type
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Welcome back! Here's what's happening with your licenses.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button size="sm" onClick={handleCreateLicense}>
            <Shield className="w-4 h-4 mr-2" />
            Create License
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>License Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <p className="text-secondary-600 dark:text-secondary-400">
                  Chart component will be integrated here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivities?.length > 0 ? (
                stats.recentActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.event_type)
                  const color = getActivityColor(activity.event_type)
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        color === 'success' ? 'bg-success-100 dark:bg-success-900/20' :
                        color === 'primary' ? 'bg-primary-100 dark:bg-primary-900/20' :
                        color === 'warning' ? 'bg-warning-100 dark:bg-warning-900/20' :
                        'bg-accent-100 dark:bg-accent-900/20'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          color === 'success' ? 'text-success-600' :
                          color === 'primary' ? 'text-primary-600' :
                          color === 'warning' ? 'text-warning-600' :
                          'text-accent-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {getActivityMessage(activity)}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {format(new Date(activity.created_at), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                  <p className="text-sm text-secondary-500">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800 cursor-pointer group"
              onClick={handleCreateLicense}
            >
              <Key className="w-8 h-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                Create License
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Generate a new license for your products
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border border-success-200 dark:border-success-800 cursor-pointer group"
            >
              <Users className="w-8 h-8 text-success-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                Manage Users
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                View and manage user accounts
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 border border-accent-200 dark:border-accent-800 cursor-pointer group"
            >
              <Package className="w-8 h-8 text-accent-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                Add Product
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Create a new product for licensing
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Create License Modal */}
      <CreateLicenseModal
        isOpen={showCreateLicense}
        onClose={() => setShowCreateLicense(false)}
        onSuccess={handleLicenseCreated}
      />
    </div>
  )
}

export default Dashboard