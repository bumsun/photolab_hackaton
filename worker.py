import cv2
import sys
image = cv2.imread(sys.argv[1])


import numpy as np
import json
import faiss
import datetime
import face_recognition




rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

boxes = face_recognition.face_locations(rgb, model="hog")
encodings = face_recognition.face_encodings(rgb, boxes)
test_enc = encodings[0];

def search():
	index = faiss.read_index("populated.index")
	index.nprobe = 64
	print('{"startSearch":"' + str(datetime.datetime.now()) + '",')
	D, I = index.search(np.array([test_enc]).astype('float32'), 100)
	print('"endSearch":"' + str(datetime.datetime.now()) + '",')
	print('"distance":"' + str(D) + '",')
	print('"ids":"' + str(I) + '"}')
search()