import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon,
  Save,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
  Database,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [showApiKey, setShowApiKey] = useState(false)
  
  const [profileData, setProfileData] = useState({
    fullName: user?.profile?.full_name || '',
    email: user?.email || '',
    company: user?.profile?.company || '',
    phone: user?.profile?.phone || ''
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    licenseExpiry: true,
    newActivations: true,
    systemUpdates: false
  })

  const [apiSettings, setApiSettings] = useState({
    apiKey: 'gw_live_sk_1234567890abcdef',
    webhookUrl: '',
    rateLimitEnabled: true
  })

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'notifications', name: 'Bildirimler', icon: Bell },
    { id: 'appearance', name: 'Görünüm', icon: Palette },
    { id: 'api', name: 'API Ayarları', icon: Key },
    { id: 'system', name: 'Sistem', icon: Database }
  ]

  const handleSaveProfile = () => {
    toast.success('Profil bilgileri güncellendi!')
  }

  const handleSaveSecurity = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor!')
      return
    }
    toast.success('Şifre başarıyla güncellendi!')
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleSaveNotifications = () => {
    toast.success('Bildirim ayarları güncellendi!')
  }

  const handleSaveApi = () => {
    toast.success('API ayarları güncellendi!')
  }

  const generateNewApiKey = () => {
    const newKey = 'gw_live_sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setApiSettings(prev => ({ ...prev, apiKey: newKey }))
    toast.success('Yeni API anahtarı oluşturuldu!')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="input-field"
                  placeholder="Adınızı ve soyadınızı girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                  placeholder="E-posta adresiniz"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Şirket
                </label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                  className="input-field"
                  placeholder="Şirket adı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field"
                  placeholder="Telefon numaranız"
                />
              </div>
            </div>
            
            <Button onClick={handleSaveProfile}>
              <Save className="w-4 h-4 mr-2" />
              Profili Kaydet
            </Button>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Mevcut şifrenizi girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Yeni şifrenizi girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Şifre Tekrar
                </label>
                <input
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Yeni şifrenizi tekrar girin"
                />
              </div>
            </div>
            
            <Button onClick={handleSaveSecurity}>
              <Lock className="w-4 h-4 mr-2" />
              Şifreyi Güncelle
            </Button>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-secondary-200 dark:border-secondary-700">
                  <div>
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                      {key === 'emailNotifications' && 'E-posta Bildirimleri'}
                      {key === 'licenseExpiry' && 'Lisans Sona Erme Uyarıları'}
                      {key === 'newActivations' && 'Yeni Aktivasyon Bildirimleri'}
                      {key === 'systemUpdates' && 'Sistem Güncellemeleri'}
                    </h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {key === 'emailNotifications' && 'E-posta ile bildirim alın'}
                      {key === 'licenseExpiry' && 'Lisanslar sona ermeden önce uyarı alın'}
                      {key === 'newActivations' && 'Yeni lisans aktivasyonları için bildirim'}
                      {key === 'systemUpdates' && 'Sistem güncellemeleri hakkında bilgi alın'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
            
            <Button onClick={handleSaveNotifications}>
              <Bell className="w-4 h-4 mr-2" />
              Bildirimleri Kaydet
            </Button>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                      Karanlık Mod
                    </h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Arayüzü karanlık tema ile kullanın
                    </p>
                  </div>
                  <Button onClick={toggleTheme} variant="secondary">
                    {isDark ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                    {isDark ? 'Açık Mod' : 'Karanlık Mod'}
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-secondary-200 dark:border-secondary-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                      Dil
                    </h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Arayüz dilini seçin
                    </p>
                  </div>
                  <select className="input-field w-32">
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  API Anahtarı
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiSettings.apiKey}
                      readOnly
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button onClick={generateNewApiKey} variant="secondary">
                    Yeni Oluştur
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={apiSettings.webhookUrl}
                  onChange={(e) => setApiSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  className="input-field"
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-secondary-200 dark:border-secondary-700">
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                    Rate Limiting
                  </h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    API isteklerini sınırla
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={apiSettings.rateLimitEnabled}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimitEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
            
            <Button onClick={handleSaveApi}>
              <Key className="w-4 h-4 mr-2" />
              API Ayarlarını Kaydet
            </Button>
          </div>
        )

      case 'system':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                    Sistem Durumu
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                    <span className="text-sm text-success-600">Çevrimiçi</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                    Veritabanı
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                    <span className="text-sm text-success-600">Bağlı</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                    Versiyon
                  </h4>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    GateWay v2.0.0
                  </span>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                    Son Güncelleme
                  </h4>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    2 Ocak 2025
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Ayarlar</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Uygulama ayarlarınızı yapılandırın
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tabs.find(tab => tab.id === activeTab)?.icon && (
                <tabs.find(tab => tab.id === activeTab).icon className="w-5 h-5" />
              )}
              {tabs.find(tab => tab.id === activeTab)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderTabContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings