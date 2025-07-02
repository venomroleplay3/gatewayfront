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
  Zap,
  Shield,
  Smartphone,
  Monitor,
  Server
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
    { id: 'getting-started', name: 'Hızlı Başlangıç', icon: Play },
    { id: 'authentication', name: 'API Kimlik Doğrulama', icon: Key },
    { id: 'license-validation', name: 'Lisans Doğrulama', icon: CheckCircle },
    { id: 'sdk-integration', name: 'SDK Entegrasyonu', icon: Code },
    { id: 'api-reference', name: 'API Referansı', icon: Server },
    { id: 'webhooks', name: 'Webhooks', icon: Zap },
    { id: 'examples', name: 'Kod Örnekleri', icon: Terminal },
    { id: 'platforms', name: 'Platform Desteği', icon: Monitor }
  ]

  const codeExamples = {
    javascript: `// JavaScript/Node.js SDK Kullanımı
const GatewaySDK = require('@gateway/sdk');

const sdk = new GatewaySDK({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://your-project.supabase.co/functions/v1'
});

// Donanım ID'si oluştur
const hwid = sdk.generateHWID();

// Lisans doğrulama
async function validateLicense(licenseKey) {
  try {
    const result = await sdk.validateLicense(licenseKey, hwid);
    
    if (result.valid) {
      console.log('✅ Lisans geçerli!');
      console.log(\`Ürün: \${result.license.product.name}\`);
      console.log(\`Kullanıcı: \${result.license.user.name}\`);
      
      // Otomatik heartbeat başlat
      sdk.startHeartbeat(licenseKey, hwid, 300000); // 5 dakika
      
      return true;
    } else {
      console.log(\`❌ Lisans geçersiz: \${result.error}\`);
      return false;
    }
  } catch (error) {
    console.error('Doğrulama hatası:', error.message);
    return false;
  }
}

// Lisans aktivasyonu
async function activateLicense(licenseKey) {
  try {
    const result = await sdk.activateLicense(licenseKey, hwid, 'My App');
    
    if (result.success) {
      console.log('✅ Lisans aktive edildi!');
      return result.activation_id;
    } else {
      console.log(\`❌ Aktivasyon başarısız: \${result.error}\`);
      return null;
    }
  } catch (error) {
    console.error('Aktivasyon hatası:', error.message);
    return null;
  }
}`,

    python: `# Python SDK Kullanımı
from gateway_sdk import GatewaySDK
import time

# SDK'yı başlat
sdk = GatewaySDK(api_key='your-api-key-here')

# Donanım ID'si oluştur
hwid = sdk.generate_hwid()

def validate_license(license_key):
    """Lisans doğrulama fonksiyonu"""
    try:
        result = sdk.validate_license(license_key, hwid)
        
        if result.get('valid'):
            print('✅ Lisans geçerli!')
            print(f"Ürün: {result['license']['product']['name']}")
            print(f"Kullanıcı: {result['license']['user']['name']}")
            
            # Otomatik heartbeat başlat
            sdk.start_heartbeat(license_key, hwid, interval=300)  # 5 dakika
            
            return True
        else:
            print(f"❌ Lisans geçersiz: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"Doğrulama hatası: {e}")
        return False

def activate_license(license_key):
    """Lisans aktivasyon fonksiyonu"""
    try:
        result = sdk.activate_license(license_key, hwid, 'My Python App')
        
        if result.get('success'):
            print('✅ Lisans aktive edildi!')
            return result.get('activation_id')
        else:
            print(f"❌ Aktivasyon başarısız: {result.get('error')}")
            return None
            
    except Exception as e:
        print(f"Aktivasyon hatası: {e}")
        return None

# Ana uygulama döngüsü
def main():
    license_key = "YOUR-LICENSE-KEY"
    
    if validate_license(license_key):
        activate_license(license_key)
        
        # Uygulama mantığınız burada
        print("Uygulama çalışıyor...")
        
        try:
            while True:
                # Ana uygulama döngüsü
                time.sleep(10)
                
                # Periyodik lisans kontrolü
                if not validate_license(license_key):
                    print("Lisans geçersiz, uygulama sonlandırılıyor...")
                    break
                    
        except KeyboardInterrupt:
            print("Uygulama durduruldu")
        finally:
            # Temizlik
            sdk.stop_heartbeat()
            sdk.deactivate_license(license_key, hwid)

if __name__ == "__main__":
    main()`,

    csharp: `// C#/.NET SDK Kullanımı
using System;
using System.Threading.Tasks;
using GatewaySDK;

public class LicenseManager
{
    private readonly GatewayClient _client;
    private readonly string _hwid;
    
    public LicenseManager(string apiKey)
    {
        _client = new GatewayClient(apiKey);
        _hwid = _client.GenerateHWID();
    }
    
    public async Task<bool> ValidateLicenseAsync(string licenseKey)
    {
        try
        {
            var result = await _client.ValidateLicenseAsync(licenseKey, _hwid);
            
            if (result.Valid)
            {
                Console.WriteLine("✅ Lisans geçerli!");
                Console.WriteLine($"Ürün: {result.License.Product.Name}");
                Console.WriteLine($"Kullanıcı: {result.License.User.Name}");
                
                // Otomatik heartbeat başlat
                _client.StartHeartbeat(licenseKey, _hwid, 300); // 5 dakika
                
                return true;
            }
            else
            {
                Console.WriteLine($"❌ Lisans geçersiz: {result.Error}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Doğrulama hatası: {ex.Message}");
            return false;
        }
    }
    
    public async Task<string> ActivateLicenseAsync(string licenseKey)
    {
        try
        {
            var result = await _client.ActivateLicenseAsync(licenseKey, _hwid, "My C# App");
            
            if (result.Success)
            {
                Console.WriteLine("✅ Lisans aktive edildi!");
                return result.ActivationId;
            }
            else
            {
                Console.WriteLine($"❌ Aktivasyon başarısız: {result.Error}");
                return null;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Aktivasyon hatası: {ex.Message}");
            return null;
        }
    }
    
    public void Dispose()
    {
        _client?.StopHeartbeat();
        _client?.Dispose();
    }
}

// Kullanım örneği
class Program
{
    static async Task Main(string[] args)
    {
        using var licenseManager = new LicenseManager("your-api-key-here");
        
        const string licenseKey = "YOUR-LICENSE-KEY";
        
        if (await licenseManager.ValidateLicenseAsync(licenseKey))
        {
            await licenseManager.ActivateLicenseAsync(licenseKey);
            
            Console.WriteLine("Uygulama çalışıyor...");
            
            // Ana uygulama döngüsü
            while (true)
            {
                await Task.Delay(10000); // 10 saniye bekle
                
                // Periyodik lisans kontrolü
                if (!await licenseManager.ValidateLicenseAsync(licenseKey))
                {
                    Console.WriteLine("Lisans geçersiz, uygulama sonlandırılıyor...");
                    break;
                }
            }
        }
        else
        {
            Console.WriteLine("Lisans doğrulanamadı, uygulama başlatılamıyor.");
        }
    }
}`
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                🚀 Hızlı Başlangıç Rehberi
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                GateWay lisans sistemini uygulamanıza entegre etmek için bu adımları takip edin.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>1. API Anahtarınızı Alın</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Öncelikle GateWay Dashboard'dan API anahtarınızı oluşturun ve kopyalayın.
                </p>
                <Button variant="secondary" onClick={() => window.open('/settings', '_blank')}>
                  <Key className="w-4 h-4 mr-2" />
                  API Anahtarı Al
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. SDK'yı İndirin ve Kurun</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      JavaScript/Node.js
                    </h4>
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
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Python
                    </h4>
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
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      C# (.NET)
                    </h4>
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

            <Card>
              <CardHeader>
                <CardTitle>4. SDK Dosyalarını İndirin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Manuel entegrasyon için SDK dosyalarını doğrudan indirebilirsiniz:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    JavaScript SDK
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Python SDK
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    C# SDK
                  </Button>
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
                🔐 API Kimlik Doğrulama
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
                  Tüm API isteklerinde <code>x-api-key</code> header'ında API anahtarınızı gönderin:
                </p>
                <div className="relative">
                  <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
                    <code>{`// HTTP Header
x-api-key: your-api-key-here

// veya Authorization header ile
Authorization: Bearer your-api-key-here`}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard('x-api-key: your-api-key-here', 'auth')}
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
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-error-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Client-Side Kullanımı</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">API anahtarınızı asla client-side kodda (JavaScript, mobil uygulamalar) kullanmayın.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-success-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Environment Variables</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">API anahtarınızı environment variable olarak saklayın.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-warning-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Düzenli Yenileme</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Güvenlik için API anahtarınızı düzenli olarak yenileyin.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Rate Limiting</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">API'nizi korumak için rate limiting kullanın.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'license-validation':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                ✅ Lisans Doğrulama
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
                    <h4 className="font-medium mb-2">POST /functions/v1/license-api/validate</h4>
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
  "hwid": "hardware-id-here",
  "product_id": "optional-product-id"
}`}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard('{\n  "license_key": "XXXXX-XXXXX-XXXXX-XXXXX",\n  "hwid": "hardware-id-here",\n  "product_id": "optional-product-id"\n}', 'request')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'request' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Success Response:</h5>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`{
  "valid": true,
  "license": {
    "id": "license-id",
    "license_key": "XXXXX-XXXXX-XXXXX-XXXXX",
    "product": {
      "id": "product-id",
      "name": "Product Name",
      "version": "1.0.0"
    },
    "user": {
      "name": "User Name",
      "company": "Company Name"
    },
    "status": "active",
    "expires_at": "2025-12-31T23:59:59Z",
    "max_activations": 1,
    "current_activations": 1
  }
}`}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard('{\n  "valid": true,\n  "license": {\n    "id": "license-id",\n    "license_key": "XXXXX-XXXXX-XXXXX-XXXXX",\n    "product": {\n      "id": "product-id",\n      "name": "Product Name",\n      "version": "1.0.0"\n    },\n    "user": {\n      "name": "User Name",\n      "company": "Company Name"\n    },\n    "status": "active",\n    "expires_at": "2025-12-31T23:59:59Z",\n    "max_activations": 1,\n    "current_activations": 1\n  }\n}', 'response')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'response' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Error Response:</h5>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`{
  "valid": false,
  "error": "License not found"
}`}</code>
                      </pre>
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
                    <h5 className="font-medium mb-2">JavaScript (Browser):</h5>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`function generateHWID() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Hardware fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  return hashString(fingerprint);
}`}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`function generateHWID() {\n  const canvas = document.createElement('canvas');\n  const ctx = canvas.getContext('2d');\n  ctx.textBaseline = 'top';\n  ctx.font = '14px Arial';\n  ctx.fillText('Hardware fingerprint', 2, 2);\n  \n  const fingerprint = [\n    navigator.userAgent,\n    navigator.language,\n    screen.width + 'x' + screen.height,\n    new Date().getTimezoneOffset(),\n    canvas.toDataURL()\n  ].join('|');\n  \n  return hashString(fingerprint);\n}`, 'hwid-js')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'hwid-js' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Python:</h5>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`import hashlib
import platform
import uuid

def generate_hwid():
    # MAC adresini al
    mac = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff) 
                   for elements in range(0, 2*6, 2)][::-1])
    
    # Makine bilgilerini birleştir
    machine_id = f"{platform.node()}-{platform.machine()}-{platform.processor()}-{mac}"
    
    # Hash oluştur
    return hashlib.md5(machine_id.encode()).hexdigest()`}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`import hashlib\nimport platform\nimport uuid\n\ndef generate_hwid():\n    # MAC adresini al\n    mac = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff) \n                   for elements in range(0, 2*6, 2)][::-1])\n    \n    # Makine bilgilerini birleştir\n    machine_id = f"{platform.node()}-{platform.machine()}-{platform.processor()}-{mac}"\n    \n    # Hash oluştur\n    return hashlib.md5(machine_id.encode()).hexdigest()`, 'hwid-py')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'hwid-py' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'sdk-integration':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                🔧 SDK Entegrasyonu
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                GateWay SDK'sını farklı platformlarda nasıl entegre edeceğinizi öğrenin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-yellow-500" />
                    JavaScript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    Web uygulamaları ve Node.js projeleri için
                  </p>
                  <div className="space-y-2">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      SDK İndir
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Örnek Proje
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-500" />
                    Python
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    Desktop uygulamaları ve backend servisleri için
                  </p>
                  <div className="space-y-2">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      SDK İndir
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Örnek Proje
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-500" />
                    C# (.NET)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    Windows uygulamaları ve .NET projeleri için
                  </p>
                  <div className="space-y-2">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      SDK İndir
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Örnek Proje
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Temel Entegrasyon Adımları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100">SDK'yı Kurun</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Paket yöneticisi ile SDK'yı projenize ekleyin.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100">API Anahtarını Yapılandırın</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Environment variable olarak API anahtarınızı ayarlayın.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Lisans Doğrulamasını Ekleyin</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Uygulama başlangıcında lisans kontrolü yapın.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Heartbeat Sistemi</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Sürekli lisans kontrolü için heartbeat ekleyin.</p>
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
                📖 API Referansı
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
                    <code>https://your-project.supabase.co/functions/v1</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard('https://your-project.supabase.co/functions/v1', 'base-url')}
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
                        <code className="text-sm">/license-api/validate</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Lisans doğrulama</p>
                    </div>
                    
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                        <code className="text-sm">/license-api/activate</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Lisans aktivasyonu</p>
                    </div>
                    
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                        <code className="text-sm">/license-api/deactivate</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Lisans deaktivasyonu</p>
                    </div>
                    
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">GET</span>
                        <code className="text-sm">/license-api/info</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Lisans bilgileri</p>
                    </div>
                    
                    <div className="p-3 rounded border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">POST</span>
                        <code className="text-sm">/license-api/heartbeat</code>
                      </div>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">Heartbeat gönderimi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">HTTP Status Kodları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-mono">200</span>
                      <span className="text-sm">Başarılı işlem</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-mono">400</span>
                      <span className="text-sm">Geçersiz istek</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-mono">401</span>
                      <span className="text-sm">Yetkisiz erişim</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-mono">404</span>
                      <span className="text-sm">Bulunamadı</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-mono">500</span>
                      <span className="text-sm">Sunucu hatası</span>
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
                ⚡ Webhooks
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
                  <li>• <code>license.deactivated</code> - Lisans deaktive edildiğinde</li>
                  <li>• <code>license.expired</code> - Lisans süresi dolduğunda</li>
                  <li>• <code>license.suspended</code> - Lisans askıya alındığında</li>
                  <li>• <code>license.validated</code> - Lisans doğrulandığında</li>
                  <li>• <code>license.heartbeat</code> - Heartbeat alındığında</li>
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
      "product": {
        "id": "product-id",
        "name": "Product Name",
        "version": "1.0.0"
      },
      "user": {
        "name": "User Name",
        "email": "user@example.com",
        "company": "Company Name"
      },
      "hwid": "hardware-id",
      "status": "active",
      "activated_at": "2025-01-02T10:30:00Z",
      "expires_at": "2025-12-31T23:59:59Z"
    },
    "activation": {
      "id": "activation-id",
      "hwid": "hardware-id",
      "ip_address": "192.168.1.100",
      "user_agent": "MyApp/1.0.0",
      "machine_name": "User-PC"
    }
  }
}`}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard('{\n  "event": "license.activated",\n  "timestamp": "2025-01-02T10:30:00Z",\n  "data": {\n    "license": {\n      "id": "license-id",\n      "license_key": "XXXXX-XXXXX-XXXXX-XXXXX",\n      "product": {\n        "id": "product-id",\n        "name": "Product Name",\n        "version": "1.0.0"\n      },\n      "user": {\n        "name": "User Name",\n        "email": "user@example.com",\n        "company": "Company Name"\n      },\n      "hwid": "hardware-id",\n      "status": "active",\n      "activated_at": "2025-01-02T10:30:00Z",\n      "expires_at": "2025-12-31T23:59:59Z"\n    },\n    "activation": {\n      "id": "activation-id",\n      "hwid": "hardware-id",\n      "ip_address": "192.168.1.100",\n      "user_agent": "MyApp/1.0.0",\n      "machine_name": "User-PC"\n    }\n  }\n}', 'webhook')}
                    className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                  >
                    {copiedCode === 'webhook' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhook Handler Örneği</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Node.js/Express:</h5>
                    <div className="relative">
                      <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{`const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook/gateway', (req, res) => {
  const { event, timestamp, data } = req.body;
  
  console.log(\`Webhook alındı: \${event} - \${timestamp}\`);
  
  switch (event) {
    case 'license.activated':
      console.log(\`Lisans aktive edildi: \${data.license.license_key}\`);
      // Aktivasyon işlemleriniz
      break;
      
    case 'license.expired':
      console.log(\`Lisans süresi doldu: \${data.license.license_key}\`);
      // Süre dolma işlemleriniz
      break;
      
    case 'license.heartbeat':
      console.log(\`Heartbeat alındı: \${data.license.license_key}\`);
      // Heartbeat işlemleriniz
      break;
      
    default:
      console.log(\`Bilinmeyen olay: \${event}\`);
  }
  
  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook sunucusu 3000 portunda çalışıyor');
});`}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`const express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.post('/webhook/gateway', (req, res) => {\n  const { event, timestamp, data } = req.body;\n  \n  console.log(\`Webhook alındı: \${event} - \${timestamp}\`);\n  \n  switch (event) {\n    case 'license.activated':\n      console.log(\`Lisans aktive edildi: \${data.license.license_key}\`);\n      // Aktivasyon işlemleriniz\n      break;\n      \n    case 'license.expired':\n      console.log(\`Lisans süresi doldu: \${data.license.license_key}\`);\n      // Süre dolma işlemleriniz\n      break;\n      \n    case 'license.heartbeat':\n      console.log(\`Heartbeat alındı: \${data.license.license_key}\`);\n      // Heartbeat işlemleriniz\n      break;\n      \n    default:\n      console.log(\`Bilinmeyen olay: \${event}\`);\n  }\n  \n  res.status(200).json({ received: true });\n});\n\napp.listen(3000, () => {\n  console.log('Webhook sunucusu 3000 portunda çalışıyor');\n});`, 'webhook-handler')}
                        className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 transition-colors"
                      >
                        {copiedCode === 'webhook-handler' ? <CheckCircle className="w-4 h-4 text-success-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
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
                💻 Kod Örnekleri
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                Farklı programlama dilleri için hazır kod örnekleri.
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-yellow-500" />
                    JavaScript/Node.js
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
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
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-500" />
                    Python
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
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
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-500" />
                    C# (.NET)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
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

            <Card>
              <CardHeader>
                <CardTitle>Canlı Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  SDK'yı canlı olarak test etmek için interaktif demo sayfamızı kullanabilirsiniz:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Web Demo
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    CLI Demo
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Desktop Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'platforms':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
                🌐 Platform Desteği
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                GateWay SDK'sı geniş platform desteği sunar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Web Tarayıcıları
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Chrome 80+</li>
                    <li>✅ Firefox 75+</li>
                    <li>✅ Safari 13+</li>
                    <li>✅ Edge 80+</li>
                    <li>✅ Opera 67+</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-gray-500" />
                    Desktop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Windows 10/11</li>
                    <li>✅ macOS 10.15+</li>
                    <li>✅ Linux (Ubuntu, CentOS)</li>
                    <li>✅ Electron Apps</li>
                    <li>✅ .NET Framework</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-green-500" />
                    Mobil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✅ React Native</li>
                    <li>✅ Ionic</li>
                    <li>✅ Cordova/PhoneGap</li>
                    <li>🔄 Flutter (Geliştiriliyor)</li>
                    <li>🔄 Xamarin (Geliştiriliyor)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-500" />
                    Backend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Node.js 14+</li>
                    <li>✅ Python 3.7+</li>
                    <li>✅ .NET 5+</li>
                    <li>🔄 Java 8+ (Geliştiriliyor)</li>
                    <li>🔄 PHP 7.4+ (Geliştiriliyor)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-orange-500" />
                    Framework'ler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✅ React/Next.js</li>
                    <li>✅ Vue.js/Nuxt.js</li>
                    <li>✅ Angular</li>
                    <li>✅ Express.js</li>
                    <li>✅ Django/Flask</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Özel Entegrasyonlar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Unity 3D</li>
                    <li>✅ Unreal Engine</li>
                    <li>✅ WPF Applications</li>
                    <li>✅ Console Applications</li>
                    <li>✅ Windows Services</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Özel Notlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">🌐 Web Tarayıcıları</h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      CORS politikaları nedeniyle, API anahtarınızı client-side kodda kullanmayın. 
                      Proxy sunucu veya serverless function kullanın.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">📱 Mobil Uygulamalar</h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Mobil cihazlarda HWID oluşturma için cihaz ID'si ve uygulama imzası kullanılır.
                      Platform özel izinler gerekebilir.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">🖥️ Desktop Uygulamaları</h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      En güvenli platform. Donanım bilgilerine tam erişim mevcut. 
                      Offline mod desteği en iyi şekilde çalışır.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            GateWay SDK'sını uygulamanıza entegre etmek için kapsamlı rehber
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => window.open('https://github.com/gateway/sdk', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            GitHub Repo
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