from getmac import get_mac_address as mac_addr

print(mac_addr())
try:
    import pyperclip
    pyperclip.copy(mac_addr())
except Exception:
    print("Opa, como q vai esse linux ae")
