import psutil
import time
# from functools import reduce
from connectdb import *

print('='*10, 'INÍCIO DAS MEDIÇÕES', '='*10)
print('-'*10, 'Ctrl+C para parar', '-'*10, '\n')


# def flush(sent):
#     # let b = sent.map(lista => (lista.reduce((ac, el) => ac + el)/lista.length).toFixed(2))
#     # b = list(map(lambda a: round((reduce((lambda x, y: x+y), a)/len(a)), 2), sent))
#     # print('Avg bytes sent:', b, 'MB')
#     insert_db(sent)


try:
    sent = []
    while True:
        ram = (psutil.virtual_memory().percent)
        cpu_percent = psutil.cpu_percent()
        disco = psutil.disk_usage('/').percent
        data_medicao = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        sent.append(float(f'{cpu_percent:.2f}'))
        sent.append(float(f'{ram:.2f}'))
        sent.append(float(f'{disco:.2f}'))
        print("mem_used:", float('{0:.2f}'.format(ram)), "|cpu:", float(
            '{0:.2f}'.format(cpu_percent)), "| date:", data_medicao)
        insert_db(sent)
        # flush(sent)
        sent = []
        time.sleep(3)
except KeyboardInterrupt:
    pass

# flush(sent)
