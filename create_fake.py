import cv2
import matplotlib.pyplot as plt
import urllib.request
import requests
import sys
# %matplotlib inline

import numpy as np
import urllib

def url_to_image(url):
    # download the image, convert it to a NumPy array, and then read
    # it into OpenCV format

    resp = urllib.request.urlopen(url)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # return the image
    return image

# image = url_to_image(sys.argv[1])
# _, img_encoded = cv2.imencode('.jpg', image)

# height, width, channels = img_color.shape 

def set_filter(url,template):
    data = {
        'image_url[1]': url,
        'template_name': template
    }
    r = requests.post("http://api-hack.photolab.me/photolab_process.php",data=data);
    return r.text
url = set_filter(sys.argv[1],'2172')

url = set_filter(url,'2561')

url = set_filter(url,'2097')

img_rgb = url_to_image(url)
cv2.imwrite("cartoon.jpg", cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR))
print(url);