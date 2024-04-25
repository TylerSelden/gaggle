# x11vnc -storepasswd "$VNC_PASSWD" /root/.vnc/passwd
# x11vnc -forever -create -rfbauth /root/.vnc/passwd -env FD_PROG="fluxbox & watch -n0 firefox -width 1280 -height 720" -env X11VNC_CREATE_GEOM=${1:-1280x720x16} &

# Disallow sites
# cp /root/app/hosts /etc/hosts
/root/app/disallow.sh

# Create new user
useradd -ms /bin/bash $VNC_USER
echo "$VNC_USER:$VNC_PASSWD" | chpasswd

# Create password for them
su $VNC_USER -c "printf \"$VNC_PASSWD\n$VNC_PASSWD\n\n\" | vncpasswd"

# Start VNC server for them
su $VNC_USER -c "Xtigervnc -desktop $VNC_USER -geometry \"500x500\" -listen tcp -ac -AlwaysShared -AcceptKeyEvents -AcceptPointerEvents -SendCutText -AcceptCutText :0 -PasswordFile ~/.vnc/passwd &"

/root/noVNC/utils/novnc_proxy --cert /root/app/ssl/cert.pem --key /root/app/ssl/privkey.pem &

# Fluxbox config
cp -r /root/app/fluxbox /home/$VNC_USER/.fluxbox

# Start fluxbox and such for 
su $VNC_USER -c "export DISPLAY=\":0\" && fluxbox 2> /dev/null &"
su $VNC_USER -c "export DISPLAY=\":0\" && xterm &"
su $VNC_USER -c "export DISPLAY=\":0\" && timeout 1 google-chrome-stable --no-sandbox --test-type"
su $VNC_USER -c "export DISPLAY=\":0\" && watch -n0 google-chrome-stable --no-sandbox --test-type"

# Enter inf loop
/root/app/loop.sh
