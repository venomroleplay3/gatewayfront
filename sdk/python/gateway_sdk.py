"""
GateWay License SDK for Python
Version: 1.0.0
"""

import requests
import hashlib
import platform
import uuid
import time
import threading
from typing import Optional, Dict, Any

class GatewaySDK:
    def __init__(self, api_key: str, base_url: str = None, timeout: int = 30):
        """
        Initialize GateWay SDK
        
        Args:
            api_key (str): Your API key
            base_url (str): Base URL for API (optional)
            timeout (int): Request timeout in seconds
        """
        if not api_key:
            raise ValueError("API key is required")
            
        self.api_key = api_key
        self.base_url = base_url or "https://your-project.supabase.co/functions/v1"
        self.timeout = timeout
        self._heartbeat_thread = None
        self._heartbeat_stop = False
        
    def validate_license(self, license_key: str, hwid: str, product_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Validate a license
        
        Args:
            license_key (str): The license key to validate
            hwid (str): Hardware ID of the machine
            product_id (str, optional): Product ID for additional validation
            
        Returns:
            dict: Validation result
        """
        try:
            response = self._make_request('/license-api/validate', 'POST', {
                'license_key': license_key,
                'hwid': hwid,
                'product_id': product_id
            })
            return response
        except Exception as e:
            raise Exception(f"License validation failed: {str(e)}")
    
    def activate_license(self, license_key: str, hwid: str, machine_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Activate a license on current machine
        
        Args:
            license_key (str): The license key to activate
            hwid (str): Hardware ID of the machine
            machine_name (str, optional): Machine name
            
        Returns:
            dict: Activation result
        """
        try:
            response = self._make_request('/license-api/activate', 'POST', {
                'license_key': license_key,
                'hwid': hwid,
                'machine_name': machine_name or platform.node()
            })
            return response
        except Exception as e:
            raise Exception(f"License activation failed: {str(e)}")
    
    def deactivate_license(self, license_key: str, hwid: str) -> Dict[str, Any]:
        """
        Deactivate a license from current machine
        
        Args:
            license_key (str): The license key to deactivate
            hwid (str): Hardware ID of the machine
            
        Returns:
            dict: Deactivation result
        """
        try:
            response = self._make_request('/license-api/deactivate', 'POST', {
                'license_key': license_key,
                'hwid': hwid
            })
            return response
        except Exception as e:
            raise Exception(f"License deactivation failed: {str(e)}")
    
    def get_license_info(self, license_key: str) -> Dict[str, Any]:
        """
        Get license information
        
        Args:
            license_key (str): The license key
            
        Returns:
            dict: License information
        """
        try:
            response = self._make_request(f'/license-api/info?license_key={license_key}', 'GET')
            return response
        except Exception as e:
            raise Exception(f"Failed to get license info: {str(e)}")
    
    def send_heartbeat(self, license_key: str, hwid: str, status: str = 'running') -> Dict[str, Any]:
        """
        Send heartbeat to keep license active
        
        Args:
            license_key (str): The license key
            hwid (str): Hardware ID of the machine
            status (str): Current application status
            
        Returns:
            dict: Heartbeat result
        """
        try:
            response = self._make_request('/license-api/heartbeat', 'POST', {
                'license_key': license_key,
                'hwid': hwid,
                'status': status
            })
            return response
        except Exception as e:
            raise Exception(f"Heartbeat failed: {str(e)}")
    
    def generate_hwid(self) -> str:
        """
        Generate hardware ID for current machine
        
        Returns:
            str: Hardware ID
        """
        try:
            # Get MAC address
            mac = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff) 
                           for elements in range(0, 2*6, 2)][::-1])
            
            # Combine machine identifiers
            machine_id = f"{platform.node()}-{platform.machine()}-{platform.processor()}-{mac}"
            
            # Create hash
            return hashlib.md5(machine_id.encode()).hexdigest()
        except Exception:
            # Fallback to UUID if hardware info fails
            return hashlib.md5(str(uuid.uuid4()).encode()).hexdigest()
    
    def start_heartbeat(self, license_key: str, hwid: str, interval: int = 300) -> None:
        """
        Start automatic heartbeat
        
        Args:
            license_key (str): The license key
            hwid (str): Hardware ID
            interval (int): Heartbeat interval in seconds (default: 5 minutes)
        """
        if self._heartbeat_thread and self._heartbeat_thread.is_alive():
            self.stop_heartbeat()
        
        self._heartbeat_stop = False
        self._heartbeat_thread = threading.Thread(
            target=self._heartbeat_worker,
            args=(license_key, hwid, interval),
            daemon=True
        )
        self._heartbeat_thread.start()
    
    def stop_heartbeat(self) -> None:
        """Stop automatic heartbeat"""
        self._heartbeat_stop = True
        if self._heartbeat_thread:
            self._heartbeat_thread.join(timeout=5)
    
    def _heartbeat_worker(self, license_key: str, hwid: str, interval: int) -> None:
        """Worker thread for heartbeat"""
        while not self._heartbeat_stop:
            try:
                self.send_heartbeat(license_key, hwid)
            except Exception as e:
                print(f"Heartbeat error: {e}")
            
            # Sleep in small intervals to allow quick stopping
            for _ in range(interval):
                if self._heartbeat_stop:
                    break
                time.sleep(1)
    
    def _make_request(self, endpoint: str, method: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Make HTTP request to API"""
        url = f"{self.base_url}{endpoint}"
        
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': self.api_key
        }
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=self.timeout)
            elif method == 'POST':
                response = requests.post(url, headers=headers, json=data, timeout=self.timeout)
            elif method == 'PUT':
                response = requests.put(url, headers=headers, json=data, timeout=self.timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=self.timeout)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.Timeout:
            raise Exception("Request timeout")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Request failed: {str(e)}")
        except ValueError as e:
            raise Exception(f"Invalid response: {str(e)}")

# Example usage
if __name__ == "__main__":
    # Initialize SDK
    sdk = GatewaySDK(api_key="your-api-key-here")
    
    # Generate HWID
    hwid = sdk.generate_hwid()
    print(f"Hardware ID: {hwid}")
    
    # Validate license
    try:
        result = sdk.validate_license("YOUR-LICENSE-KEY", hwid)
        if result.get('valid'):
            print("License is valid!")
            print(f"Product: {result['license']['product']['name']}")
        else:
            print(f"License invalid: {result.get('error')}")
    except Exception as e:
        print(f"Error: {e}")