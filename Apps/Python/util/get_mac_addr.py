from getmac import get_mac_address as mac_addr
import pyperclip

print(mac_addr())
pyperclip.copy(mac_addr())
