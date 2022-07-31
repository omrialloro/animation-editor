# Import everything needed to edit video clips
from moviepy.editor import *
import glob
import os
import sys

name = sys.argv[1]


myclip = VideoFileClip("test1634816145501.gif")
audioclip = AudioFileClip("videoplayback.mp3")

myclip = myclip.set_audio(audioclip)

myclip.write_videofile("test.mp4", fps = 160) # the gif will have 30 fps
