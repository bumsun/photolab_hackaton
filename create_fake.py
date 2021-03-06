import cv2
import matplotlib.pyplot as plt
import urllib.request
import requests
import sys
# %matplotlib inline

import numpy as np
import urllib
import random

#sys.argv[1]
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
# img_original = cv2.imread("DrQTepS2eKI.jpg")


data = {
    'no_resize': 1,
    'another_input_name': 'another input value',
}
files = {
    'file1': open(sys.argv[1], 'rb')
}

r = requests.post("http://upload-hack.photolab.me/upload.php",data=data, files=files);
url_orig = r.text

def set_filter(url,template):
    data = {
        'image_url[1]': url,
        'template_name': template
    }
    if len(template) > 10:
        r = requests.post("http://api-hack.photolab.me/template_process.php",data=data);
        return r.text
    else:
        r = requests.post("http://api-hack.photolab.me/photolab_process.php",data=data);
        return r.text

differents1 = ["2671","2584","2172"]# волосы 
differents2 = ["2589","2561","E9FA99AB-BE08-56E4-3949-1DB564348BD3","1E627605-B174-F354-3D4A-A54EF962AABB","D28858E9-06A0-4AE4-C9C3-21C6A6D89DB6","E43BABAB-83CB-A9B4-D57F-317A4D98267D"]# рты 
differents3 = ["2252","2097","D63046F3-8BAE-C194-35BB-7B93D3684B51"]# глаза

url = set_filter(url_orig,differents1[random.randint(0, len(differents1)-1)])# волосы 
url = set_filter(url,differents2[random.randint(0, len(differents2)-1)])# рты
url = set_filter(url,differents3[random.randint(0, len(differents3)-1)])# глаза

differents3 = ["2252","2097","D63046F3-8BAE-C194-35BB-7B93D3684B51"]# глаза


# img_rgb = url_to_image(url)
# cv2.imwrite("cartoon.jpg", cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR))
print('''{
    "original_url": "%s",
    "fake_url": "%s"
}''' % (url_orig, url));