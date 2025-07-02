# 🔐 GateWay License SDK

GateWay License SDK, yazılım lisanslarınızı kolayca yönetmenizi ve doğrulamanızı sağlayan güçlü bir araçtır. Birden fazla programlama dilini destekler ve modern uygulamalar için tasarlanmıştır.

## 🚀 Özellikler

- ✅ **Lisans Doğrulama** - Gerçek zamanlı lisans kontrolü
- ⚡ **Hızlı Aktivasyon** - Tek tıkla lisans aktivasyonu
- 💓 **Heartbeat Sistemi** - Sürekli bağlantı kontrolü
- 🔒 **Güvenli HWID** - Donanım tabanlı kimlik doğrulama
- 📊 **Detaylı Raporlama** - Kullanım istatistikleri
- 🌐 **Çoklu Platform** - Windows, macOS, Linux desteği
- 🔧 **Kolay Entegrasyon** - Minimal kod ile hızlı kurulum

## 📦 Desteklenen Diller

| Dil | Versiyon | Durum | Dosya |
|-----|----------|-------|-------|
| **JavaScript/Node.js** | ES6+ | ✅ Hazır | `javascript/gateway-sdk.js` |
| **Python** | 3.7+ | ✅ Hazır | `python/gateway_sdk.py` |
| **C#/.NET** | .NET 5+ | ✅ Hazır | `csharp/GatewaySDK.cs` |
| **Java** | 8+ | 🔄 Geliştiriliyor | - |
| **PHP** | 7.4+ | 🔄 Geliştiriliyor | - |
| **Go** | 1.16+ | 🔄 Geliştiriliyor | - |

## 🛠️ Kurulum

### JavaScript/Node.js

```bash
# NPM ile
npm install @gateway/sdk

# Yarn ile
yarn add @gateway/sdk

# CDN ile (Browser)
<script src="https://cdn.jsdelivr.net/npm/@gateway/sdk/dist/gateway-sdk.min.js"></script>
```

### Python

```bash
# pip ile
pip install gateway-sdk

# conda ile
conda install -c gateway gateway-sdk
```

### C#/.NET

```bash
# NuGet ile
Install-Package Gateway.SDK

# .NET CLI ile
dotnet add package Gateway.SDK
```

## 🚀 Hızlı Başlangıç

### 1. API Anahtarı Alın

[GateWay Dashboard](https://your-gateway-app.com/settings) üzerinden API anahtarınızı alın.

### 2. SDK'yı Başlatın

#### JavaScript
```javascript
const GatewaySDK = require('@gateway/sdk');

const sdk = new GatewaySDK({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://your-project.supabase.co/functions/v1'
});
```

#### Python
```python
from gateway_sdk import GatewaySDK

sdk = GatewaySDK(api_key='your-api-key-here')
```

#### C#
```csharp
using GatewaySDK;

var client = new GatewayClient("your-api-key-here");
```

### 3. Lisansı Doğrulayın

#### JavaScript
```javascript
const hwid = sdk.generateHWID();
const result = await sdk.validateLicense('YOUR-LICENSE-KEY', hwid);

if (result.valid) {
  console.log('License is valid!');
  console.log(`Product: ${result.license.product.name}`);
} else {
  console.log(`License invalid: ${result.error}`);
}
```

#### Python
```python
hwid = sdk.generate_hwid()
result = sdk.validate_license('YOUR-LICENSE-KEY', hwid)

if result.get('valid'):
    print('License is valid!')
    print(f"Product: {result['license']['product']['name']}")
else:
    print(f"License invalid: {result.get('error')}")
```

#### C#
```csharp
var hwid = client.GenerateHWID();
var result = await client.ValidateLicenseAsync("YOUR-LICENSE-KEY", hwid);

if (result.Valid)
{
    Console.WriteLine("License is valid!");
    Console.WriteLine($"Product: {result.License.Product.Name}");
}
else
{
    Console.WriteLine($"License invalid: {result.Error}");
}
```

## 📚 API Referansı

### Temel Metodlar

#### `validateLicense(licenseKey, hwid, productId?)`
Bir lisansın geçerliliğini kontrol eder.

**Parametreler:**
- `licenseKey` (string): Lisans anahtarı
- `hwid` (string): Donanım ID'si
- `productId` (string, opsiyonel): Ürün ID'si

**Dönüş:**
```json
{
  "valid": true,
  "license": {
    "id": "license-id",
    "product": {
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
}
```

#### `activateLicense(licenseKey, hwid, machineName?)`
Lisansı mevcut makinede aktive eder.

#### `deactivateLicense(licenseKey, hwid)`
Lisansı mevcut makineden deaktive eder.

#### `getLicenseInfo(licenseKey)`
Lisans hakkında detaylı bilgi alır.

#### `sendHeartbeat(licenseKey, hwid, status?)`
Lisansın aktif olduğunu bildiren heartbeat gönderir.

#### `generateHWID()`
Mevcut makine için benzersiz donanım ID'si oluşturur.

### Otomatik Heartbeat

#### `startHeartbeat(licenseKey, hwid, interval?)`
Otomatik heartbeat gönderimini başlatır.

#### `stopHeartbeat()`
Otomatik heartbeat gönderimini durdurur.

## 🔧 Gelişmiş Kullanım

### Heartbeat ile Sürekli Kontrol

```javascript
// Otomatik heartbeat başlat (her 5 dakikada bir)
const intervalId = sdk.startHeartbeat(licenseKey, hwid, 300000);

// Uygulamanız çalışırken...
// Heartbeat otomatik olarak gönderilir

// Uygulama kapanırken heartbeat'i durdur
sdk.stopHeartbeat(intervalId);
```

### Hata Yönetimi

```javascript
try {
  const result = await sdk.validateLicense(licenseKey, hwid);
  // Başarılı işlem
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Network timeout - retry later');
  } else if (error.message.includes('unauthorized')) {
    console.log('Invalid API key');
  } else {
    console.log('Unknown error:', error.message);
  }
}
```

### Offline Mod

```javascript
// Lisans bilgilerini yerel olarak sakla
const licenseInfo = await sdk.getLicenseInfo(licenseKey);
localStorage.setItem('license_cache', JSON.stringify(licenseInfo));

// Offline durumda cache'den kontrol et
function validateOffline() {
  const cached = JSON.parse(localStorage.getItem('license_cache') || '{}');
  const expiresAt = new Date(cached.license?.expires_at);
  return expiresAt > new Date();
}
```

## 🔒 Güvenlik

### API Anahtarı Güvenliği

- ❌ **Asla** API anahtarınızı client-side kodda kullanmayın
- ✅ Environment variable olarak saklayın
- ✅ Düzenli olarak yenileyin
- ✅ Sadece gerekli izinleri verin

### HWID Güvenliği

- ✅ Donanım tabanlı benzersiz kimlik
- ✅ Makine değişikliklerinde otomatik algılama
- ✅ Sanal makine koruması
- ✅ Şifreleme ile korunmuş

## 📊 Hata Kodları

| Kod | Açıklama | Çözüm |
|-----|----------|-------|
| `INVALID_API_KEY` | Geçersiz API anahtarı | API anahtarınızı kontrol edin |
| `LICENSE_NOT_FOUND` | Lisans bulunamadı | Lisans anahtarını kontrol edin |
| `LICENSE_EXPIRED` | Lisans süresi dolmuş | Lisansı yenileyin |
| `MAX_ACTIVATIONS_REACHED` | Maksimum aktivasyon sayısına ulaşıldı | Diğer cihazları deaktive edin |
| `HARDWARE_MISMATCH` | Donanım uyumsuzluğu | Doğru cihazda çalıştığınızı kontrol edin |
| `NETWORK_ERROR` | Ağ bağlantı hatası | İnternet bağlantınızı kontrol edin |

## 🧪 Test Etme

### Test Lisans Anahtarları

Geliştirme aşamasında kullanabileceğiniz test lisansları:

```
DEMO-12345-ABCDE-67890  (Sınırsız, test ürünü)
TEST-11111-22222-33333  (30 gün, demo ürünü)
DEV-AAAAA-BBBBB-CCCCC   (1 yıl, geliştirici ürünü)
```

### Unit Test Örnekleri

#### JavaScript (Jest)
```javascript
describe('GatewaySDK', () => {
  test('should validate license', async () => {
    const sdk = new GatewaySDK({ apiKey: 'test-key' });
    const result = await sdk.validateLicense('DEMO-12345-ABCDE-67890', 'test-hwid');
    expect(result.valid).toBe(true);
  });
});
```

#### Python (pytest)
```python
def test_validate_license():
    sdk = GatewaySDK('test-key')
    result = sdk.validate_license('DEMO-12345-ABCDE-67890', 'test-hwid')
    assert result['valid'] == True
```

## 📖 Örnekler

Detaylı örnekler için `examples/` klasörüne bakın:

- 🌐 **Web Uygulaması**: `examples/javascript-example.html`
- 🐍 **Python CLI**: `examples/python-example.py`
- 💻 **C# Console**: `examples/csharp-example.cs`
- 📱 **React Native**: `examples/react-native-example.js`
- 🖥️ **Electron**: `examples/electron-example.js`

## 🆘 Destek

### Dokümantasyon
- 📚 [API Dokümantasyonu](https://docs.gateway.com)
- 🎥 [Video Eğitimler](https://gateway.com/tutorials)
- 💡 [Örnekler](https://github.com/gateway/examples)

### Topluluk
- 💬 [Discord Sunucusu](https://discord.gg/gateway)
- 📧 [E-posta Desteği](mailto:support@gateway.com)
- 🐛 [Bug Raporları](https://github.com/gateway/sdk/issues)

### SSS

**S: SDK ücretsiz mi?**
A: Evet, SDK tamamen ücretsizdir. Sadece lisans kullanımı için ücret alınır.

**S: Offline çalışır mı?**
A: Kısıtlı offline destek vardır. Cache mekanizması ile kısa süreli offline çalışma mümkündür.

**S: Hangi platformları destekler?**
A: Windows, macOS, Linux, iOS, Android ve web tarayıcıları desteklenir.

**S: Lisans anahtarı nasıl oluşturulur?**
A: GateWay Dashboard üzerinden kolayca oluşturabilirsiniz.

## 📄 Lisans

Bu SDK MIT lisansı altında dağıtılmaktadır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🔄 Güncellemeler

### v1.0.0 (2025-01-02)
- ✨ İlk stabil sürüm
- 🚀 JavaScript, Python, C# desteği
- 💓 Heartbeat sistemi
- 🔒 HWID güvenliği
- 📊 Detaylı hata yönetimi

---

**GateWay License SDK** ile yazılımlarınızı güvenle koruyun! 🛡️