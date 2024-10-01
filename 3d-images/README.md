# ffmpeg

`ffmpeg -i bycut_star.mp4 -vf "scale=1280:-1,select='mod(n\,2)',setpts=N/FRAME_RATE/TB" -an -movflags faststart -vcodec libx264 -crf 20 -g 10 -pix_fmt yuv420p output-h264.mp4`

- `vf`: Video filters
  - `scale`: obvious
  - `select`: remove frames; we only use every 2nd degree angle (180 deg instead of 360), see
    [doc](https://superuser.com/questions/1804268/ffmpeg-remove-every-6th-frame-starting-from-the-3rd-frame)
  - `setpts`: don't fill up the missing frames (i.e. halve the duration of the video when dropping every 2nd frame)
- `movflags faststart`: Run a second pass to put the index (moov atom) at the beginning of the file
- `vcodec`
- `crf`: Select the quality for constant quality mode (for x264 between 0 for lossless and 51);
  28 is too low
- `g` Set the group of picture (GOP) size (interval between I-frames)
- `an`: Remove audio
<!-- - `fps_mode: crf`: Use constant frame rate () -->

TODO: Optimize video format. Use:
`-c:v libaom-av1 -crf 30 -b:v 0`

To drop frames (e.g. use 2 deg angles instead of 1 deg): 

# Images

Extract images with ffmpeg, then convert with `transformImages.mjs`