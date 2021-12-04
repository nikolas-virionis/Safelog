from getmac import get_mac_address as mac_addr

try:
    import pyperclip
    pyperclip.copy(mac_addr())
    print(mac_addr())
except Exception:
    print(mac_addr())
    
