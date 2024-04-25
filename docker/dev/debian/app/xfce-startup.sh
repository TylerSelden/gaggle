# I really don't understand why like 90% of this is necessary
# Or even why it actually works

# oh well


SRC_DIR="/root/app/panel"
DEST_DIR="/home/$VNC_USER/.config/xfce4/panel"

sleep 3
for dest_dir_icon in "$DEST_DIR"/*; do
  cat "$SRC_DIR/$(basename $dest_dir_icon)"/* | tee "$dest_dir_icon"/*
done




chown -R $VNC_USER:$VNC_USER /home/$VNC_USER
#chmod -R 755 /home/$VNC_USER/.config/xfce4/panel
