from skimage.measure import compare_ssim
import imutils
import cv2
import sys
import numpy as np
import urllib
import requests
# construct the argument parse and parse the arguments
# load the two input images

def url_to_image(url):
    # download the image, convert it to a NumPy array, and then read
    # it into OpenCV format

    resp = urllib.request.urlopen(url)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # return the image
    return image

imageA = url_to_image(sys.argv[1])
height, width, channels = imageA.shape
imageB = url_to_image(sys.argv[2])
imageB = cv2.resize(imageB, (width, height)) 
 
# convert the images to grayscale
grayA = cv2.cvtColor(imageA, cv2.COLOR_BGR2GRAY)
grayB = cv2.cvtColor(imageB, cv2.COLOR_BGR2GRAY)



# compute the Structural Similarity Index (SSIM) between the two
# images, ensuring that the difference image is returned
(score, diff) = compare_ssim(grayA, grayB, full=True)
diff = (diff * 255).astype("uint8")

# threshold the difference image, followed by finding contours to
# obtain the regions of the two input images that differ
thresh = cv2.threshold(diff, 0, 255,
	cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
	cv2.CHAIN_APPROX_SIMPLE)
cnts = imutils.grab_contours(cnts)


# loop over the contours
result = "["
for c in cnts:
	# compute the bounding box of the contour and then draw the
	# bounding box on both input images to represent where the two
	# images differ
	(x, y, w, h) = cv2.boundingRect(c)
	if w > 25 and h > 35:
		if "{" in result:
			 result = result + ","
		result = result + '{"x":%d,' % (x)
		result = result + '"y":%d,' % (y)
		result = result + '"w":"%d,' % (w)
		result = result + '"h":%d}' % (h)
		cv2.rectangle(imageB, (x, y), (x + w, y + h), (0, 0, 255), 2)
result = result + "]"
cv2.imwrite("differents.jpg", cv2.cvtColor(imageB, cv2.COLOR_RGB2BGR))
print(result)


# show the output images

# cv2.imwrite("out1.jpg", imageA)
# cv2.imwrite("out2.jpg", imageB)
# cv2.imwrite("out3.jpg", diff)
# cv2.imwrite("out4.jpg", thresh)

# cv2.waitKey(0)


