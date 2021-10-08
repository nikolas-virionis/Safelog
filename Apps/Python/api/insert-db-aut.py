import psutil
import time
# from functools import reduce
from connectdb import *

print('='*10, 'INÍCIO DAS MEDIÇÕES', '='*10)
print('-'*10, 'Ctrl+C para parar', '-'*10, '\n')

try:
    while True:
        ram = (psutil.virtual_memory().percent)
        cpu_percent = psutil.cpu_percent()
        disco = psutil.disk_usage('/').percent
        data_medicao = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        print("mem_used:", float('{0:.2f}'.format(ram)), "|cpu:", float(
            '{0:.2f}'.format(cpu_percent)), "| date:", data_medicao)
        insert_db([float(f'{cpu_percent:.2f}'), float(
            f'{ram:.2f}'), float(f'{disco:.2f}')])
        time.sleep(3)
except KeyboardInterrupt:
    pass
