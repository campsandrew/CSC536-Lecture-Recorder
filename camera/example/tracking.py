import cv2

CAMERA = 0


def show_webcam(mirror=False):
    cam = cv2.VideoCapture(CAMERA)
    #fourcc = cv2.VideoWriter_fourcc(*"XVID")
    #out = cv2.VideoWriter("output.avi", fourcc, 20.0, (1280, 720))

    for i in range(20):
        is_read, frame = cam.read()
        cv2.imwrite("test" + str(i) + ".jpg", frame)
    #out.write(frame)
    #cv2.imshow("Frame", frame)

    # while True:

        # if mirror:
        #    img = cv2.flip(frame, 1)

        #cv2.imshow("Frame", img)
        # if cv2.waitKey(1) == 27:
        #    break  # esc to quit

    cam.release()
    # out.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    show_webcam(mirror=True)
