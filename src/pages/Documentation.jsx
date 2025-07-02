import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Book,
  Code,
  Key,
  Globe,
  Copy,
  CheckCircle,
  ExternalLink,
  Download,
  Play,
  Terminal,
  Zap
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [copiedCode, setCopiedCode] = useState('')

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    toast.success('Kod kopyalandı!')
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const sections = [
    { id: 'getting-started', name: 'Başlangıç', icon: Play },
    { id: 'authentication', name: 'Kimlik Doğrulama', icon: Key },
    { id: 'license-validation', name: 'Lisans Doğrulama', icon: CheckCircle },
    { id: 'api-reference', name: 'API Referansı', icon: Code },
    { id: 'webhooks', name: 'Webhooks', icon: Zap },
    { id: 'examples', name: 'Örnekler', icon: Terminal }
  ]

  const codeExamples = {
    javascript: `// JavaScript/Node.js Örneği
const GatewaySDK = require('@gateway/sdk');

const gateway = new GatewaySDK({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.gateway.com'
});

// Lisans doğrulama
async function validateLicense(licenseKey, hwid) {
  try {
    const result = await gateway.licenses.validate({
      licenseKey: licenseKey,
      hwid: hwid
    });
    
    if (result.valid) {
      console.log('Lisans geçerli!');
      return true;
    } else {
      console.log('Lisans geçersiz:', result.reason);
      return false;
    }
  } catch (error) {
    console.error('Hata:', error.message);
    return false;
  }
}`,

    python: `# Python Örneği
import requests
import hashlib
import platform

class GatewayClient:
    def __init__(self, api_key, base_url="https://api.gateway.com"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def get_hwid(self):
        """Donanım ID'si oluştur"""
        machine_id = platform.node() + platform.machine()
        return hashlib.md5(machine_id.encode()).hexdigest()
    
    def validate_license(self, license_key):
        """Lisans doğrulama"""
        hwid = self.get_hwid()
        
        payload = {
            'license_key': license_key,
            'hwid': hwid
        }
        
        response = requests.post(
            f'{self.base_url}/api/v1/licenses/validate',
            json=payload,
            headers=self.headers
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get('valid', False)
        else:
            return False

# Kullanım
client = GatewayClient('your-api-key')
is_valid = client.validate_license('LICENSE-KEY-HERE')`,

    csharp: `// C# Örneği
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Management;

public class GatewayClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _baseUrl;

    public GatewayClient(string apiKey, string baseUrl = "https://api.gateway.com")
    {
        _apiKey = apiKey;
        _baseUrl = baseUrl;
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
    }

    public string GetHWID()
    {
        string hwid = "";
        ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT * FROM Win32_ComputerSystemProduct");
        
        foreach (ManagementObject obj in searcher.Get())
        {
            hwid = obj["UUID"].ToString();
            break;
        }
        
        return hwid;
    }

    public async Task<bool> ValidateLicenseAsync(string licenseKey)
    {
        var payload = new
        {
            license_key = licenseKey,
            hwid = GetHWID()
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync($"{_baseUrl}/api/v1/licenses/validate", content);
            
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<ValidationResult>(responseContent);
                return result.Valid;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Hata: {ex.Message}");
        }

        return false;
    }
}

public class ValidationResult
{
    public bool Valid { get; set; }
    public string Reason { get; set; }
}`
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Hızlı Başlangıç
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                GateWay lisans sisteminizi uygulamanıza entegre etmek için bu adımları takip edin.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>1. API Anahtarınızı Alın</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Öncelikle ayarlar sayfasından API anahtarınızı kopyalayın.
                </p>
                <Button variant="secondary" onClick={() => window.open('/settings', '_blank')}>
                  <Key className="w-4 h-4 mr-2" />
                  Ayarlar Sayfasına Git
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. SDK'yı Yükleyin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">JavaScript/Node.js</h4>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
                        <code>npm install @gateway/sdk</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard('npm install @gateway/sdk', 'npm')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'npm' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Python</h4>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
                        <code>pip install gateway-sdk</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard('pip install gateway-sdk', 'pip')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'pip' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">C# (.NET)</h4>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
                        <code>Install-Package Gateway.SDK</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard('Install-Package Gateway.SDK', 'nuget')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'nuget' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. İlk Entegrasyonunuzu Yapın</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Aşağıdaki örnek kod ile lisans doğrulamasını test edebilirsiniz:
                </p>
                <div className="relative">
                  <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{codeExamples.javascript}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(codeExamples.javascript, 'example')}
                    className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                  >
                    {copiedCode === 'example' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'authentication':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Kimlik Doğrulama
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                API isteklerinizi doğrulamak için API anahtarınızı kullanın.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Anahtarı Kullanımı</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Tüm API isteklerinde Authorization header'ında Bearer token olarak API anahtarınızı gönderin:
                </p>
                <div className="relative">
                  <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
                    <code>{`Authorization: Bearer your-api-key-here`}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard('Authorization: Bearer your-api-key-here', 'auth')}
                    className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                  >
                    {copiedCode === 'auth' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Güvenlik Önerileri</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                  <li>• API anahtarınızı asla client-side kodda kullanmayın</li>
                  <li>• API anahtarınızı environment variable olarak saklayın</li>
                  <li>• Düzenli olarak API anahtarınızı yenileyin</li>
                  <li>• Rate limiting kullanarak API'nizi koruyun</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )

      case 'license-validation':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Lisans Doğrulama
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Kullanıcı lisanslarını doğrulamak için API endpoint'lerini kullanın.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lisans Doğrulama Endpoint'i</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">POST /api/v1/licenses/validate</h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                      Bir lisans anahtarını ve donanım ID'sini doğrular.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Request Body:</h5>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`{
  "license_key": "XXXXX-XXXXX-XXXXX-XXXXX",
  "hwid": "hardware-id-here"
}`}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard('{\n  "license_key": "XXXXX-XXXXX-XXXXX-XXXXX",\n  "hwid": "hardware-id-here"\n}', 'request')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'request' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Response:</h5>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`{
  "valid": true,
  "license": {
    "id": "license-id",
    "product": "Product Name",
    "expires_at": "2025-12-31T23:59:59Z",
    "max_activations": 1,
    "current_activations": 1
  }
}`}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard('{\n  "valid": true,\n  "license": {\n    "id": "license-id",\n    "product": "Product Name",\n    "expires_at": "2025-12-31T23:59:59Z",\n    "max_activations": 1,\n    "current_activations": 1\n  }\n}', 'response')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'response' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donanım ID (HWID) Oluşturma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Her cihaz için benzersiz bir donanım ID'si oluşturmanız gerekir:
                </p>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">JavaScript (Node.js):</h5>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`const crypto = require('crypto');
const os = require('os');

function getHWID() {
  const networkInterfaces = os.networkInterfaces();
  const macAddress = Object.values(networkInterfaces)
    .flat()
    .find(i => !i.internal && i.mac !== '00:00:00:00:00:00')?.mac;
  
  const machineId = os.hostname() + os.arch() + macAddress;
  return crypto.createHash('md5').update(machineId).digest('hex');
}`}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`const crypto = require('crypto');\nconst os = require('os');\n\nfunction getHWID() {\n  const networkInterfaces = os.networkInterfaces();\n  const macAddress = Object.values(networkInterfaces)\n    .flat()\n    .find(i => !i.internal && i.mac !== '00:00:00:00:00:00')?.mac;\n  \n  const machineId = os.hostname() + os.arch() + macAddress;\n  return crypto.createHash('md5').update(machineId).digest('hex');\n}`, 'hwid-js')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'hwid-js' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'api-reference':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                API Referansı
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Tüm API endpoint'lerinin detaylı dokümantasyonu.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Base URL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg">
                    <code>https://api.gateway.com/v1</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard('https://api.gateway.com/v1', 'base-url')}
                    className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                  >
                    {copiedCode === 'base-url' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lisans Endpoint'leri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                        <code className="text-sm">/licenses/validate</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Lisans doğrulama</p>
                    </div>
                    
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                        <code className="text-sm">/licenses/{id}</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Lisans detayları</p>
                    </div>
                    
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                        <code className="text-sm">/licenses/activate</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Lisans aktivasyonu</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ürün Endpoint'leri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                        <code className="text-sm">/products</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Ürün listesi</p>
                    </div>
                    
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                        <code className="text-sm">/products/{id}</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Ürün detayları</p>
                    </div>
                    
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                        <code className="text-sm">/products</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Ürün oluşturma</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'webhooks':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Webhooks
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Önemli olaylar gerçekleştiğinde otomatik bildirimler alın.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Webhook Kurulumu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Ayarlar sayfasından webhook URL'nizi yapılandırabilirsiniz. Aşağıdaki olaylar için webhook gönderilir:
                </p>
                <ul className="space-y-2 text-secondary-600 dark:text-secondary-400">
                  <li>• <code>license.created</code> - Yeni lisans oluşturulduğunda</li>
                  <li>• <code>license.activated</code> - Lisans aktive edildiğinde</li>
                  <li>• <code>license.expired</code> - Lisans süresi dolduğunda</li>
                  <li>• <code>license.suspended</code> - Lisans askıya alındığında</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhook Payload Örneği</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`{
  "event": "license.activated",
  "timestamp": "2025-01-02T10:30:00Z",
  "data": {
    "license": {
      "id": "license-id",
      "license_key": "XXXXX-XXXXX-XXXXX-XXXXX",
      "product": "Product Name",
      "user": "user@example.com",
      "hwid": "hardware-id",
      "activated_at": "2025-01-02T10:30:00Z"
    }
  }
}`}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard('{\n  "event": "license.activated",\n  "timestamp": "2025-01-02T10:30:00Z",\n  "data": {\n    "license": {\n      "id": "license-id",\n      "license_key": "XXXXX-XXXXX-XXXXX-XXXXX",\n      "product": "Product Name",\n      "user": "user@example.com",\n      "hwid": "hardware-id",\n      "activated_at": "2025-01-02T10:30:00Z"\n    }\n  }\n}', 'webhook')}
                    className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                  >
                    {copiedCode === 'webhook' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'examples':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                Kod Örnekleri
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Farklı programlama dilleri için hazır kod örnekleri.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>JavaScript/Node.js</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.javascript}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(codeExamples.javascript, 'js-example')}
                      className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                    >
                      {copiedCode === 'js-example' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Python</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.python}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(codeExamples.python, 'py-example')}
                      className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                    >
                      {copiedCode === 'py-example' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>C# (.NET)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.csharp}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(codeExamples.csharp, 'cs-example')}
                      className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                    >
                      {copiedCode === 'cs-example' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
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
          <h1 className="text-3xl font-bold gradient-text">API Dokümantasyonu</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            GateWay API'sini uygulamanıza entegre etmek için rehber
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => window.open('https://postman.com', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Postman Collection
          </Button>
          <Button onClick={() => window.open('/settings', '_blank')}>
            <Key className="w-4 h-4 mr-2" />
            API Anahtarı Al
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.name}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default Documentation