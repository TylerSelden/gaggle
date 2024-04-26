# Disallow sites
/root/app/disallow.sh

# Create new user
useradd -ms /bin/bash $VNC_USER
echo "$VNC_USER:$VNC_PASSWD" | chpasswd

# Create VNC password for them
su $VNC_USER -c "printf \"$VNC_PASSWD\n$VNC_PASSWD\n\n\" | vncpasswd"

# Start VNC server & noVNC
su $VNC_USER -c "Xtigervnc -desktop $VNC_USER -geometry \"500x500\" -listen tcp -ac -AlwaysShared -AcceptKeyEvents -AcceptPointerEvents -SendCutText -AcceptCutText :0 -PasswordFile ~/.vnc/passwd &"
/root/noVNC/utils/novnc_proxy --cert /root/app/ssl/cert.pem --key /root/app/ssl/privkey.pem &



# Fluxbox config
cp -r /root/app/fluxbox /home/$VNC_USER/.fluxbox


# Start fluxbox and app
su $VNC_USER -c "fluxbox 2> /dev/null &"
su $VNC_USER -c "timeout 1 google-chrome-stable --no-sandbox --test-type"
su $VNC_USER -c "watch -n0 google-chrome-stable --no-sandbox --test-type"

# Enter inf loop
/root/app/loop.sh
