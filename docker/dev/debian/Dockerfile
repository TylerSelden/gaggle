FROM debian:bullseye

# Install necessary packages

RUN apt update -y && apt install git python3 procps fluxbox firefox-esr watch tigervnc-standalone-server -y

# dev
RUN apt install dnsutils -y

EXPOSE 6080
EXPOSE 5900



WORKDIR /root


COPY ./app /root/app

RUN cp -r /root/app/noVNC /root/noVNC
RUN mkdir /root/.vnc
# RUN mkdir /root/.ssl


# CMD instead of entrypoint, yes i know
CMD /root/app/entrypoint.sh
