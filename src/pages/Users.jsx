import React from 'react'
import { motion } from 'framer-motion'
import { Users as UsersIcon, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'

const Users = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Users</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <UsersIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
              Users page coming soon
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              This page will contain user management functionality
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Users