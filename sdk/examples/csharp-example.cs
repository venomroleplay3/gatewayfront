/*
 * GateWay License SDK - C# Example
 * Bu örnek, GateWay License SDK'sının C# ile nasıl kullanılacağını gösterir.
 */

using System;
using System.Threading.Tasks;
using GatewaySDK;

namespace GatewayExample
{
    class Program
    {
        private static readonly string API_KEY = "your-api-key-here"; // Buraya API anahtarınızı girin
        private static readonly string LICENSE_KEY = "DEMO-12345-ABCDE-67890"; // Buraya lisans anahtarınızı girin
        
        static async Task Main(string[] args)
        {
            Console.WriteLine("🔐 GateWay License SDK - C# Demo");
            Console.WriteLine("=" + new string('=', 49));
            
            using var client = new GatewayClient(API_KEY);
            var hwid = client.GenerateHWID();
            
            Console.WriteLine($"🔧 SDK başlatıldı");
            Console.WriteLine($"📱 Donanım ID: {hwid}");
            Console.WriteLine($"🔑 Lisans Anahtarı: {LICENSE_KEY}");
            Console.WriteLine(new string('-', 50));
            
            while (true)
            {
                ShowMenu();
                var choice = Console.ReadLine()?.Trim();
                
                try
                {
                    switch (choice)
                    {
                        case "1":
                            await ValidateLicense(client, hwid);
                            break;
                        case "2":
                            await ActivateLicense(client, hwid);
                            break;
                        case "3":
                            await GetLicenseInfo(client);
                            break;
                        case "4":
                            await SendHeartbeat(client, hwid);
                            break;
                        case "5":
                            await RunDemoApplication(client, hwid);
                            break;
                        case "6":
                            await DeactivateLicense(client, hwid);
                            break;
                        case "0":
                            Console.WriteLine("👋 Görüşmek üzere!");
                            return;
                        default:
                            Console.WriteLine("❌ Geçersiz seçim!");
                            break;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Hata: {ex.Message}");
                }
                
                Console.WriteLine("\nDevam etmek için bir tuşa basın...");
                Console.ReadKey();
            }
        }
        
        static void ShowMenu()
        {
            Console.WriteLine("\n📋 Menü:");
            Console.WriteLine("1. 🔍 Lisansı Doğrula");
            Console.WriteLine("2. ⚡ Lisansı Aktive Et");
            Console.WriteLine("3. ℹ️ Lisans Bilgilerini Al");
            Console.WriteLine("4. 💓 Heartbeat Gönder");
            Console.WriteLine("5. 🚀 Demo Uygulamasını Çalıştır");
            Console.WriteLine("6. ❌ Lisansı Deaktive Et");
            Console.WriteLine("0. 🚪 Çıkış");
            Console.Write("\nSeçiminizi yapın (0-6): ");
        }
        
        static async Task ValidateLicense(GatewayClient client, string hwid)
        {
            Console.WriteLine("🔍 Lisans doğrulanıyor...");
            
            var result = await client.ValidateLicenseAsync(LICENSE_KEY, hwid);
            
            if (result.Valid)
            {
                Console.WriteLine("✅ Lisans geçerli!");
                Console.WriteLine($"   📦 Ürün: {result.License.Product.Name} v{result.License.Product.Version}");
                Console.WriteLine($"   👤 Kullanıcı: {result.License.User.Name}");
                Console.WriteLine($"   📊 Durum: {result.License.Status}");
                Console.WriteLine($"   📅 Bitiş: {(result.License.ExpiresAt?.ToString("dd.MM.yyyy") ?? "Süresiz")}");
                Console.WriteLine($"   🔢 Aktivasyon: {result.License.CurrentActivations}/{result.License.MaxActivations}");
            }
            else
            {
                Console.WriteLine($"❌ Lisans geçersiz: {result.Error}");
            }
        }
        
        static async Task ActivateLicense(GatewayClient client, string hwid)
        {
            Console.WriteLine("⚡ Lisans aktive ediliyor...");
            
            var result = await client.ActivateLicenseAsync(LICENSE_KEY, hwid, $"CSharp-Demo-{Environment.UserName}");
            
            if (result.Success)
            {
                Console.WriteLine($"✅ {result.Message}");
                Console.WriteLine($"   🆔 Aktivasyon ID: {result.ActivationId}");
                Console.WriteLine($"   ⏰ Aktivasyon Zamanı: {result.ActivatedAt:dd.MM.yyyy HH:mm:ss}");
            }
            else
            {
                Console.WriteLine($"❌ Aktivasyon başarısız: {result.Error}");
            }
        }
        
        static async Task GetLicenseInfo(GatewayClient client)
        {
            Console.WriteLine("ℹ️ Lisans bilgileri alınıyor...");
            
            var result = await client.GetLicenseInfoAsync(LICENSE_KEY);
            
            if (result.License != null)
            {
                var license = result.License;
                Console.WriteLine("📋 Lisans Detayları:");
                Console.WriteLine($"   🆔 ID: {license.Id}");
                Console.WriteLine($"   🔑 Anahtar: {license.LicenseKey}");
                Console.WriteLine($"   📊 Durum: {license.Status}");
                Console.WriteLine($"   📦 Ürün: {license.Product.Name} v{license.Product.Version}");
                Console.WriteLine($"   👤 Kullanıcı: {license.User.Name}");
                Console.WriteLine($"   🏢 Şirket: {license.User.Company ?? "Belirtilmemiş"}");
                Console.WriteLine($"   📅 Bitiş: {(license.ExpiresAt?.ToString("dd.MM.yyyy") ?? "Süresiz")}");
                Console.WriteLine($"   🔢 Aktivasyonlar: {license.CurrentActivations}/{license.MaxActivations}");
            }
            else
            {
                Console.WriteLine($"❌ Lisans bulunamadı: {result.Error}");
            }
        }
        
        static async Task SendHeartbeat(GatewayClient client, string hwid)
        {
            Console.WriteLine("💓 Heartbeat gönderiliyor...");
            
            var result = await client.SendHeartbeatAsync(LICENSE_KEY, hwid, "running");
            
            if (result.Success)
            {
                Console.WriteLine($"💓 {result.Message}");
                Console.WriteLine($"   ⏰ Sunucu Zamanı: {result.ServerTime:dd.MM.yyyy HH:mm:ss}");
            }
            else
            {
                Console.WriteLine($"❌ Heartbeat başarısız: {result.Error}");
            }
        }
        
        static async Task DeactivateLicense(GatewayClient client, string hwid)
        {
            Console.WriteLine("❌ Lisans deaktive ediliyor...");
            
            var result = await client.DeactivateLicenseAsync(LICENSE_KEY, hwid);
            
            if (result.Success)
            {
                Console.WriteLine($"✅ {result.Message}");
            }
            else
            {
                Console.WriteLine($"❌ Deaktivasyon başarısız: {result.Error}");
            }
        }
        
        static async Task RunDemoApplication(GatewayClient client, string hwid)
        {
            Console.WriteLine("\n🚀 Demo uygulaması başlatılıyor...");
            
            // Lisansı doğrula
            Console.WriteLine("🔍 Lisans doğrulanıyor...");
            var validation = await client.ValidateLicenseAsync(LICENSE_KEY, hwid);
            
            if (!validation.Valid)
            {
                Console.WriteLine($"❌ Lisans doğrulanamadı: {validation.Error}");
                Console.WriteLine("❌ Uygulama sonlandırılıyor.");
                return;
            }
            
            Console.WriteLine("✅ Lisans geçerli!");
            
            // Lisansı aktive et
            Console.WriteLine("⚡ Lisans aktive ediliyor...");
            var activation = await client.ActivateLicenseAsync(LICENSE_KEY, hwid);
            
            if (!activation.Success)
            {
                Console.WriteLine($"⚠️ Aktivasyon başarısız: {activation.Error}");
                Console.WriteLine("⚠️ Ancak uygulama devam ediyor...");
            }
            else
            {
                Console.WriteLine("✅ Lisans aktive edildi!");
            }
            
            // Otomatik heartbeat başlat
            Console.WriteLine("💓 Otomatik heartbeat başlatılıyor...");
            client.StartHeartbeat(LICENSE_KEY, hwid, 60); // Her dakika
            
            Console.WriteLine("✅ Demo uygulaması başarıyla başlatıldı!");
            Console.WriteLine("   ESC tuşuna basarak durdurun...");
            
            // Ana döngü
            int counter = 0;
            ConsoleKeyInfo keyInfo;
            
            do
            {
                counter++;
                Console.WriteLine($"\n📊 Uygulama çalışıyor... (Döngü: {counter})");
                
                // Her 5 döngüde bir lisans durumunu kontrol et
                if (counter % 5 == 0)
                {
                    Console.WriteLine("🔄 Lisans durumu kontrol ediliyor...");
                    var check = await client.ValidateLicenseAsync(LICENSE_KEY, hwid);
                    
                    if (check.Valid)
                    {
                        Console.WriteLine("✅ Lisans hala geçerli");
                    }
                    else
                    {
                        Console.WriteLine($"⚠️ Lisans problemi: {check.Error}");
                    }
                }
                
                // 3 saniye bekle veya tuş basılmasını bekle
                Console.WriteLine("   (ESC ile çıkış, diğer tuşlarla devam...)");
                
                var start = DateTime.Now;
                while ((DateTime.Now - start).TotalSeconds < 3)
                {
                    if (Console.KeyAvailable)
                    {
                        keyInfo = Console.ReadKey(true);
                        goto KeyPressed;
                    }
                    await Task.Delay(100);
                }
                
                keyInfo = new ConsoleKeyInfo();
                
                KeyPressed:;
                
            } while (keyInfo.Key != ConsoleKey.Escape);
            
            // Temizlik
            Console.WriteLine("\n🛑 Demo uygulaması durduruluyor...");
            
            // Heartbeat'i durdur
            client.StopHeartbeat();
            Console.WriteLine("💓 Heartbeat durduruldu");
            
            // Lisansı deaktive et
            try
            {
                var deactivation = await client.DeactivateLicenseAsync(LICENSE_KEY, hwid);
                if (deactivation.Success)
                {
                    Console.WriteLine($"✅ {deactivation.Message}");
                }
                else
                {
                    Console.WriteLine($"⚠️ Deaktivasyon uyarısı: {deactivation.Error}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Deaktivasyon hatası: {ex.Message}");
            }
            
            Console.WriteLine("✅ Demo uygulaması başarıyla durduruldu!");
        }
    }
}