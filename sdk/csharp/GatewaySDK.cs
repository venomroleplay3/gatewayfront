/*
 * GateWay License SDK for C#/.NET
 * Version: 1.0.0
 */

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Management;
using System.Net.NetworkInformation;
using System.Threading;

namespace GatewaySDK
{
    public class GatewayClient : IDisposable
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private Timer _heartbeatTimer;
        private bool _disposed = false;

        public GatewayClient(string apiKey, string baseUrl = null, int timeoutSeconds = 30)
        {
            if (string.IsNullOrEmpty(apiKey))
                throw new ArgumentException("API key is required", nameof(apiKey));

            _apiKey = apiKey;
            _baseUrl = baseUrl ?? "https://your-project.supabase.co/functions/v1";
            
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(timeoutSeconds)
            };
            
            _httpClient.DefaultRequestHeaders.Add("x-api-key", _apiKey);
        }

        /// <summary>
        /// Validate a license
        /// </summary>
        public async Task<LicenseValidationResult> ValidateLicenseAsync(string licenseKey, string hwid, string productId = null)
        {
            try
            {
                var payload = new
                {
                    license_key = licenseKey,
                    hwid = hwid,
                    product_id = productId
                };

                var response = await MakeRequestAsync("/license-api/validate", HttpMethod.Post, payload);
                return JsonSerializer.Deserialize<LicenseValidationResult>(response, GetJsonOptions());
            }
            catch (Exception ex)
            {
                throw new GatewayException($"License validation failed: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Activate a license on current machine
        /// </summary>
        public async Task<LicenseActivationResult> ActivateLicenseAsync(string licenseKey, string hwid, string machineName = null)
        {
            try
            {
                var payload = new
                {
                    license_key = licenseKey,
                    hwid = hwid,
                    machine_name = machineName ?? Environment.MachineName
                };

                var response = await MakeRequestAsync("/license-api/activate", HttpMethod.Post, payload);
                return JsonSerializer.Deserialize<LicenseActivationResult>(response, GetJsonOptions());
            }
            catch (Exception ex)
            {
                throw new GatewayException($"License activation failed: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Deactivate a license from current machine
        /// </summary>
        public async Task<LicenseDeactivationResult> DeactivateLicenseAsync(string licenseKey, string hwid)
        {
            try
            {
                var payload = new
                {
                    license_key = licenseKey,
                    hwid = hwid
                };

                var response = await MakeRequestAsync("/license-api/deactivate", HttpMethod.Post, payload);
                return JsonSerializer.Deserialize<LicenseDeactivationResult>(response, GetJsonOptions());
            }
            catch (Exception ex)
            {
                throw new GatewayException($"License deactivation failed: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Get license information
        /// </summary>
        public async Task<LicenseInfoResult> GetLicenseInfoAsync(string licenseKey)
        {
            try
            {
                var response = await MakeRequestAsync($"/license-api/info?license_key={licenseKey}", HttpMethod.Get);
                return JsonSerializer.Deserialize<LicenseInfoResult>(response, GetJsonOptions());
            }
            catch (Exception ex)
            {
                throw new GatewayException($"Failed to get license info: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Send heartbeat to keep license active
        /// </summary>
        public async Task<HeartbeatResult> SendHeartbeatAsync(string licenseKey, string hwid, string status = "running")
        {
            try
            {
                var payload = new
                {
                    license_key = licenseKey,
                    hwid = hwid,
                    status = status
                };

                var response = await MakeRequestAsync("/license-api/heartbeat", HttpMethod.Post, payload);
                return JsonSerializer.Deserialize<HeartbeatResult>(response, GetJsonOptions());
            }
            catch (Exception ex)
            {
                throw new GatewayException($"Heartbeat failed: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Generate hardware ID for current machine
        /// </summary>
        public string GenerateHWID()
        {
            try
            {
                var identifiers = new List<string>
                {
                    Environment.MachineName,
                    Environment.ProcessorCount.ToString(),
                    GetMotherboardSerial(),
                    GetMacAddress()
                };

                var combined = string.Join("|", identifiers);
                return ComputeMD5Hash(combined);
            }
            catch
            {
                // Fallback to GUID if hardware info fails
                return ComputeMD5Hash(Guid.NewGuid().ToString());
            }
        }

        /// <summary>
        /// Start automatic heartbeat
        /// </summary>
        public void StartHeartbeat(string licenseKey, string hwid, int intervalSeconds = 300)
        {
            StopHeartbeat();

            _heartbeatTimer = new Timer(async _ =>
            {
                try
                {
                    await SendHeartbeatAsync(licenseKey, hwid);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Heartbeat error: {ex.Message}");
                }
            }, null, TimeSpan.Zero, TimeSpan.FromSeconds(intervalSeconds));
        }

        /// <summary>
        /// Stop automatic heartbeat
        /// </summary>
        public void StopHeartbeat()
        {
            _heartbeatTimer?.Dispose();
            _heartbeatTimer = null;
        }

        private async Task<string> MakeRequestAsync(string endpoint, HttpMethod method, object data = null)
        {
            var url = $"{_baseUrl}{endpoint}";
            var request = new HttpRequestMessage(method, url);

            if (data != null && method != HttpMethod.Get)
            {
                var json = JsonSerializer.Serialize(data, GetJsonOptions());
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            }

            var response = await _httpClient.SendAsync(request);
            
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"HTTP {(int)response.StatusCode}: {response.ReasonPhrase}");
            }

            return await response.Content.ReadAsStringAsync();
        }

        private string GetMotherboardSerial()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_BaseBoard");
                foreach (ManagementObject obj in searcher.Get())
                {
                    return obj["SerialNumber"]?.ToString() ?? "Unknown";
                }
            }
            catch
            {
                // Ignore errors
            }
            return "Unknown";
        }

        private string GetMacAddress()
        {
            try
            {
                foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (nic.OperationalStatus == OperationalStatus.Up && 
                        nic.NetworkInterfaceType != NetworkInterfaceType.Loopback)
                    {
                        return nic.GetPhysicalAddress().ToString();
                    }
                }
            }
            catch
            {
                // Ignore errors
            }
            return "Unknown";
        }

        private string ComputeMD5Hash(string input)
        {
            using var md5 = MD5.Create();
            var inputBytes = Encoding.UTF8.GetBytes(input);
            var hashBytes = md5.ComputeHash(inputBytes);
            return Convert.ToHexString(hashBytes).ToLower();
        }

        private JsonSerializerOptions GetJsonOptions()
        {
            return new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            };
        }

        public void Dispose()
        {
            if (!_disposed)
            {
                StopHeartbeat();
                _httpClient?.Dispose();
                _disposed = true;
            }
        }
    }

    // Data Models
    public class LicenseValidationResult
    {
        public bool Valid { get; set; }
        public string Error { get; set; }
        public LicenseInfo License { get; set; }
    }

    public class LicenseActivationResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Error { get; set; }
        public string ActivationId { get; set; }
        public DateTime ActivatedAt { get; set; }
    }

    public class LicenseDeactivationResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Error { get; set; }
    }

    public class LicenseInfoResult
    {
        public LicenseInfo License { get; set; }
        public string Error { get; set; }
    }

    public class HeartbeatResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Error { get; set; }
        public DateTime ServerTime { get; set; }
    }

    public class LicenseInfo
    {
        public string Id { get; set; }
        public string LicenseKey { get; set; }
        public string Status { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public int MaxActivations { get; set; }
        public int CurrentActivations { get; set; }
        public ProductInfo Product { get; set; }
        public UserInfo User { get; set; }
    }

    public class ProductInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Version { get; set; }
    }

    public class UserInfo
    {
        public string Name { get; set; }
        public string Company { get; set; }
    }

    public class GatewayException : Exception
    {
        public GatewayException(string message) : base(message) { }
        public GatewayException(string message, Exception innerException) : base(message, innerException) { }
    }
}

// Example usage
/*
class Program
{
    static async Task Main(string[] args)
    {
        using var client = new GatewayClient("your-api-key-here");
        
        // Generate HWID
        var hwid = client.GenerateHWID();
        Console.WriteLine($"Hardware ID: {hwid}");
        
        try
        {
            // Validate license
            var result = await client.ValidateLicenseAsync("YOUR-LICENSE-KEY", hwid);
            
            if (result.Valid)
            {
                Console.WriteLine("License is valid!");
                Console.WriteLine($"Product: {result.License.Product.Name}");
                
                // Start heartbeat
                client.StartHeartbeat("YOUR-LICENSE-KEY", hwid);
                
                // Your application logic here
                Console.WriteLine("Application running...");
                await Task.Delay(10000); // Simulate work
                
                // Stop heartbeat
                client.StopHeartbeat();
            }
            else
            {
                Console.WriteLine($"License invalid: {result.Error}");
            }
        }
        catch (GatewayException ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
*/