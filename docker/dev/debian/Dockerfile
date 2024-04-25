FROM debian:bullseye

# Install necessary packages

RUN apt update -y && DEBIAN_FRONTEND=noninteractive apt install git wget python3 tigervnc-standalone-server xfce4 xfce4-goodies dbus-x11 procps -y

# Install chrome :/

RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install ./google-chrome-stable_current_amd64.deb -y

# dev
RUN apt install vim screen -y

EXPOSE 6080
EXPOSE 5900



WORKDIR /root


COPY ./app /root/app

RUN cp -r /root/app/noVNC /root/noVNC
RUN mkdir /root/.vnc
# RUN mkdir /root/.ssl


# CMD instead of entrypoint, yes i know
CMD /root/app/entrypoint.sh
