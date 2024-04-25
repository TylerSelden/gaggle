# Disallow sites
/root/app/disallow.sh

# Create new user
useradd -ms /bin/bash $VNC_USER
echo "$VNC_USER:$VNC_PASSWD" | chpasswd

# Create password for them
su $VNC_USER -c "printf \"$VNC_PASSWD\n$VNC_PASSWD\n\n\" | vncpasswd"

# Start VNC server for them
su $VNC_USER -c "Xtigervnc -desktop $VNC_USER -geometry \"500x500\" -listen tcp -ac -AlwaysShared -AcceptKeyEvents -AcceptPointerEvents -SendCutText -AcceptCutText :0 -PasswordFile ~/.vnc/passwd &"

/root/noVNC/utils/novnc_proxy --cert /root/app/ssl/cert.pem --key /root/app/ssl/privkey.pem &




#su $VNC_USER -c "alias google-chrome-stable=\"google-chrome-stable --no-sandbox\""
echo "alias google-chrome=\"google-chrome --no-sandbox\"" >> /home/$VNC_USER/.bashrc


# Start xfce and such 
su $VNC_USER -c "cd ~ && startxfce4 2> /dev/null &"


# Desktop startup script

# Loop until XFCE is fully started
while [ true ]; do
  if pgrep -x "xfce4-panel" > /dev/null
  then
    /root/app/xfce-startup.sh >> /home/$VNC_USER/output 2>&1
    break
  fi
  sleep 1
done




# Enter inf loop to prevent unexpected container stop
/root/app/loop.sh
