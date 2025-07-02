#!/usr/bin/env python3
"""
GateWay License SDK - Python Example
Bu örnek, GateWay License SDK'sının Python ile nasıl kullanılacağını gösterir.
"""

import sys
import os
import asyncio
import time

# SDK'yı import et
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'python'))
from gateway_sdk import GatewaySDK

class LicenseManager:
    def __init__(self, api_key: str, license_key: str):
        """
        Lisans yöneticisini başlat
        
        Args:
            api_key (str): API anahtarınız
            license_key (str): Lisans anahtarınız
        """
        self.sdk = GatewaySDK(api_key)
        self.license_key = license_key
        self.hwid = self.sdk.generate_hwid()
        self.is_running = False
        
        print(f"🔧 Lisans Yöneticisi başlatıldı")
        print(f"📱 Donanım ID: {self.hwid}")
        print(f"🔑 Lisans Anahtarı: {license_key}")
        print("-" * 50)
    
    def validate_license(self):
        """Lisansı doğrula"""
        try:
            print("🔍 Lisans doğrulanıyor...")
            result = self.sdk.validate_license(self.license_key, self.hwid)
            
            if result.get('valid'):
                license_info = result['license']
                print("✅ Lisans geçerli!")
                print(f"   📦 Ürün: {license_info['product']['name']} v{license_info['product']['version']}")
                print(f"   👤 Kullanıcı: {license_info['user']['name']}")
                print(f"   📊 Durum: {license_info['status']}")
                print(f"   📅 Bitiş: {license_info.get('expires_at', 'Süresiz')}")
                print(f"   🔢 Aktivasyon: {license_info['current_activations']}/{license_info['max_activations']}")
                return True
            else:
                print(f"❌ Lisans geçersiz: {result.get('error')}")
                return False
                
        except Exception as e:
            print(f"❌ Doğrulama hatası: {e}")
            return False
    
    def activate_license(self):
        """Lisansı aktive et"""
        try:
            print("⚡ Lisans aktive ediliyor...")
            result = self.sdk.activate_license(
                self.license_key, 
                self.hwid, 
                f"Python-Demo-{os.getlogin()}"
            )
            
            if result.get('success'):
                print(f"✅ {result['message']}")
                print(f"   🆔 Aktivasyon ID: {result.get('activation_id')}")
                print(f"   ⏰ Aktivasyon Zamanı: {result.get('activated_at')}")
                return True
            else:
                print(f"❌ Aktivasyon başarısız: {result.get('error')}")
                return False
                
        except Exception as e:
            print(f"❌ Aktivasyon hatası: {e}")
            return False
    
    def get_license_info(self):
        """Lisans bilgilerini al"""
        try:
            print("ℹ️ Lisans bilgileri alınıyor...")
            result = self.sdk.get_license_info(self.license_key)
            
            if 'license' in result:
                license_info = result['license']
                print("📋 Lisans Detayları:")
                print(f"   🆔 ID: {license_info['id']}")
                print(f"   🔑 Anahtar: {license_info['license_key']}")
                print(f"   📊 Durum: {license_info['status']}")
                print(f"   📦 Ürün: {license_info['product']['name']} v{license_info['product']['version']}")
                print(f"   👤 Kullanıcı: {license_info['user']['name']}")
                print(f"   🏢 Şirket: {license_info['user'].get('company', 'Belirtilmemiş')}")
                print(f"   📅 Bitiş: {license_info.get('expires_at', 'Süresiz')}")
                print(f"   🔢 Aktivasyonlar: {license_info['current_activations']}/{license_info['max_activations']}")
                
                # Aktif cihazları göster
                active_devices = [a for a in license_info.get('activations', []) if a.get('is_active')]
                print(f"   📱 Aktif Cihazlar: {len(active_devices)}")
                for i, device in enumerate(active_devices, 1):
                    print(f"      {i}. HWID: {device['hwid'][:16]}... (Aktive: {device['activated_at']})")
                
                return True
            else:
                print(f"❌ Lisans bulunamadı: {result.get('error')}")
                return False
                
        except Exception as e:
            print(f"❌ Bilgi alma hatası: {e}")
            return False
    
    def send_heartbeat(self):
        """Heartbeat gönder"""
        try:
            result = self.sdk.send_heartbeat(self.license_key, self.hwid, 'running')
            
            if result.get('success'):
                print(f"💓 Heartbeat gönderildi - Sunucu zamanı: {result.get('server_time')}")
                return True
            else:
                print(f"❌ Heartbeat başarısız: {result.get('error')}")
                return False
                
        except Exception as e:
            print(f"❌ Heartbeat hatası: {e}")
            return False
    
    def start_application(self):
        """Uygulamayı başlat"""
        print("\n🚀 Uygulama başlatılıyor...")
        
        # Lisansı doğrula
        if not self.validate_license():
            print("❌ Lisans doğrulanamadı. Uygulama sonlandırılıyor.")
            return False
        
        # Lisansı aktive et
        if not self.activate_license():
            print("⚠️ Aktivasyon başarısız, ancak uygulama devam ediyor...")
        
        # Otomatik heartbeat başlat
        print("💓 Otomatik heartbeat başlatılıyor...")
        self.sdk.start_heartbeat(self.license_key, self.hwid, interval=60)  # Her dakika
        
        self.is_running = True
        print("✅ Uygulama başarıyla başlatıldı!")
        print("   Ctrl+C ile durdurmak için...")
        
        return True
    
    def stop_application(self):
        """Uygulamayı durdur"""
        print("\n🛑 Uygulama durduruluyor...")
        
        # Heartbeat'i durdur
        self.sdk.stop_heartbeat()
        print("💓 Heartbeat durduruldu")
        
        # Lisansı deaktive et
        try:
            result = self.sdk.deactivate_license(self.license_key, self.hwid)
            if result.get('success'):
                print(f"✅ {result['message']}")
            else:
                print(f"⚠️ Deaktivasyon uyarısı: {result.get('error')}")
        except Exception as e:
            print(f"⚠️ Deaktivasyon hatası: {e}")
        
        self.is_running = False
        print("✅ Uygulama başarıyla durduruldu!")
    
    def run_demo(self):
        """Demo uygulamasını çalıştır"""
        try:
            # Uygulamayı başlat
            if not self.start_application():
                return
            
            # Ana döngü
            counter = 0
            while self.is_running:
                counter += 1
                print(f"\n📊 Uygulama çalışıyor... (Döngü: {counter})")
                
                # Her 5 döngüde bir lisans bilgilerini kontrol et
                if counter % 5 == 0:
                    print("🔄 Lisans durumu kontrol ediliyor...")
                    self.validate_license()
                
                # 10 saniye bekle
                time.sleep(10)
                
        except KeyboardInterrupt:
            print("\n⚠️ Kullanıcı tarafından durduruldu...")
        except Exception as e:
            print(f"\n❌ Beklenmeyen hata: {e}")
        finally:
            self.stop_application()

def main():
    """Ana fonksiyon"""
    print("🔐 GateWay License SDK - Python Demo")
    print("=" * 50)
    
    # Konfigürasyon
    API_KEY = "your-api-key-here"  # Buraya API anahtarınızı girin
    LICENSE_KEY = "DEMO-12345-ABCDE-67890"  # Buraya lisans anahtarınızı girin
    
    # Lisans yöneticisini başlat
    license_manager = LicenseManager(API_KEY, LICENSE_KEY)
    
    # Menü
    while True:
        print("\n📋 Menü:")
        print("1. 🔍 Lisansı Doğrula")
        print("2. ⚡ Lisansı Aktive Et")
        print("3. ℹ️ Lisans Bilgilerini Al")
        print("4. 💓 Heartbeat Gönder")
        print("5. 🚀 Demo Uygulamasını Çalıştır")
        print("6. ❌ Lisansı Deaktive Et")
        print("0. 🚪 Çıkış")
        
        choice = input("\nSeçiminizi yapın (0-6): ").strip()
        
        if choice == "1":
            license_manager.validate_license()
        elif choice == "2":
            license_manager.activate_license()
        elif choice == "3":
            license_manager.get_license_info()
        elif choice == "4":
            license_manager.send_heartbeat()
        elif choice == "5":
            license_manager.run_demo()
        elif choice == "6":
            try:
                result = license_manager.sdk.deactivate_license(license_manager.license_key, license_manager.hwid)
                if result.get('success'):
                    print(f"✅ {result['message']}")
                else:
                    print(f"❌ Deaktivasyon başarısız: {result.get('error')}")
            except Exception as e:
                print(f"❌ Deaktivasyon hatası: {e}")
        elif choice == "0":
            print("👋 Görüşmek üzere!")
            break
        else:
            print("❌ Geçersiz seçim!")

if __name__ == "__main__":
    main()