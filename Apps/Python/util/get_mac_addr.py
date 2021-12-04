from getmac import get_mac_address as mac_addr

try:
    import pyperclip
    pyperclip.copy(mac_addr())
except Exception:
    print()
    
print(mac_addr())
