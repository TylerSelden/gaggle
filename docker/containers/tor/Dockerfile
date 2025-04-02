FROM debian:bullseye

# Install necessary packages

RUN apt update -y && apt install git python3 procps fluxbox watch tigervnc-standalone-server firefox-esr apt-transport-https xterm wget gpg curl xz-utils -y

COPY ./app/tor.list /etc/apt/sources.list.d/tor.list
RUN wget -qO- https://deb.torproject.org/torproject.org/A3C4F0F979CAA22CDBA8F512EE8CBC9E886DDD89.asc | gpg --dearmor | tee /usr/share/keyrings/deb.torproject.org-keyring.gpg >/dev/null
RUN apt update -y && apt install tor -y



EXPOSE 6080
EXPOSE 5900

# Install browser itself
RUN TOR_URL=$(curl -s https://www.torproject.org/download/ | \
    grep downloadLink | grep linux | sed 's/.*href="//g' | cut -d '"' -f1 | head -1) && \
    FULL_TOR_URL="https://www.torproject.org/${TOR_URL}" && \
    wget --quiet "${FULL_TOR_URL}" -O /root/torbrowser.tar.xz && \
    tar -xJf /root/torbrowser.tar.xz -C /opt && \
    rm /root/torbrowser.tar.xz



COPY ./app /root/app
RUN mkdir /root/.vnc

# CMD instead of entrypoint, yes i know
WORKDIR /root
CMD /root/app/entrypoint.sh
