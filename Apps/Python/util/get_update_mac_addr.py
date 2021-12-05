from get_mac_addr import mac_addr

print(f"UPDATE maquina SET id_maquina = '{mac_addr()}' WHERE nome = 'ec2';")
