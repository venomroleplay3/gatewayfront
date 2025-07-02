import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Key,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'

const Licenses = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const licenses = [
    {
      id: 'LIC-001',
      product: 'Premium Software',
      user: 'john@example.com',
      status: 'active',
      expiresAt: '2024-12-31',
      createdAt: '2024-01-15',
      hwid: 'ABC123DEF456'
    },
    {
      id: 'LIC-002',
      product: 'Basic Plan',
      user: 'jane@example.com',
      status: 'expired',
      expiresAt: '2024-01-30',
      createdAt: '2023-12-01',
      hwid: 'XYZ789GHI012'
    },
    {
      id: 'LIC-003',
      product: 'Enterprise Suite',
      user: 'admin@company.com',
      status: 'pending',
      expiresAt: '2024-06-30',
      createdAt: '2024-02-01',
      hwid: 'DEF456JKL789'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success-500" />
      case 'expired':
        return <XCircle className="w-4 h-4 text-error-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-warning-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400'
      case 'expired':
        return 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400'
      case 'pending':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
      default:
        return 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300'
    }
  }

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || license.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Licenses</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Manage and monitor all your software licenses
          </p>
        </div>
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create License
        </Button>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search licenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pl-10 pr-8 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Licenses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            License Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-800/50">
                <tr>
                  <th className="text-left p-4 font-medium text-secondary-700 dark:text-secondary-300">
                    License ID
                  </th>
                  <th className="text-left p-4 font-medium text-secondary-700 dark:text-secondary-300">
                    Product
                  </th>
                  <th className="text-left p-4 font-medium text-secondary-700 dark:text-secondary-300">
                    User
                  </th>
                  <th className="text-left p-4 font-medium text-secondary-700 dark:text-secondary-300">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-secondary-700 dark:text-secondary-300">
                    Expires
                  </th>
                  <th className="text-left p-4 font-medium text-secondary-700 dark:text-secondary-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLicenses.map((license, index) => (
                  <motion.tr
                    key={license.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-mono text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {license.id}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-secondary-900 dark:text-secondary-100">
                        {license.product}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-secondary-600 dark:text-secondary-400">
                        {license.user}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(license.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(license.status)}`}>
                          {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-secondary-600 dark:text-secondary-400">
                        {license.expiresAt}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-error-500" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredLicenses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Key className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            No licenses found
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first license'
            }
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create License
          </Button>
        </motion.div>
      )}
    </div>
  )
}

export default Licenses