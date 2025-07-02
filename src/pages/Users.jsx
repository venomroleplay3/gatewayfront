import React from 'react'
import { motion } from 'framer-motion'
import { Users as UsersIcon, Plus, Mail, Building, Shield, User } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useApi } from '../hooks/useApi'
import { usersService } from '../services/api'
import { format } from 'date-fns'

const Users = () => {
  const { data: users, loading } = useApi(() => usersService.getAll(), [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

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
            User Management ({users?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300'
                    }`}>
                      {user.role === 'admin' ? (
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Admin
                        </div>
                      ) : (
                        'User'
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                    {user.full_name || 'Unnamed User'}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{user.id}</span>
                    </div>
                    
                    {user.company && (
                      <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                        <Building className="w-4 h-4" />
                        <span className="truncate">{user.company}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                    <p className="text-xs text-secondary-500">
                      Joined {format(new Date(user.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                No users found
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Users will appear here as they register
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Users