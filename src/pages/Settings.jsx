import React from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'

const Settings = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Configure your application settings
          </p>
        </div>
        
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <SettingsIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
              Settings page coming soon
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              This page will contain application configuration options
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings