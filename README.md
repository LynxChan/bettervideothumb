# bettervideothumb
Improves the thumbnail of videos on LynxChan 2.7
By design, LynxChan picks the very first frame of a video and uses it as a thumb (if you have video thumbs enabled). This often results in an unenticing black image as a thumb. This addon changes that behavior by instead picking the thumb at 50% playtime of the video. The source code is taken from LynxChanAddon-KC.

<b>Installation instructions:</b>

1. Go to ``/LynxChan/src/be/addons/``
2. Git clone this repository
3. You now have a folder called 'bettervideothumb' in your addons folder
4. Go to the Global Settings, find the 'Addons' array near the bottom and enter ``bettervideothumb`` there, then Save the settings
5. Restart Lynxchan from your server terminal.
6. That's it, any new video files posted from now on will have their thumbnails selected at 50% playtime of the video.
