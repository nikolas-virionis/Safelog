import psutil
import time
from functools import reduce
from connectdb import *

print('='*10,'INÍCIO DAS MEDIÇÕES','='*10)
print('-'*10,'Ctrl+C para parar','-'*10,'\n')

def flush(sent,count):
    print('\nReadings:',count)
    b = round((reduce((lambda x,y:x+y),sent)/len(sent)),2)
    print('Avg bytes sent:',b,'MB')
    insert_db(b)

try:
    count = 1
    sent = []
    while True:
        mem_used = (psutil.virtual_memory().used)/1000000
        data_hora = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        sent.append(float('{0:.2f}'.format(mem_used)))
        print("mem_used:",float('{0:.2f}'.format(mem_used)),"| data:",data_hora)
        time.sleep(2)
        if(count == 5):
            flush(sent,count)
            count = 1
        count = count + 1
except KeyboardInterrupt:
    pass

flush(sent,count)


