if [ "$#" -ne 4 ]; then
	echo "./start.sh <container> <username> <password> <number>"
	exit 1
fi

re='^[0-9]+$'
if ! [[ $4 =~ $re ]] ; then
	echo "<number> must be a number"
	exit 1
fi

if ! [ ${#3} -ge 6 ]; then
	echo "Length of <password> must be 6 or greater"
	exit 1
fi


echo "noVNC-dev-$4 ($1) running on port $((7081 + $4)) with credentials '$2:$3'."

#docker run -it --rm --name noVNC-$3 -p $((8081 + $3)):6080 -e VNC_USER="$1" -e VNC_PASSWD="$2" kaiushartala/vnc:dev bash
docker run -t --rm --name noVNC-dev-$4 -p $((7081 + $4)):6080 -e VNC_USER="$2" -e VNC_PASSWD="$3" kaiushartala/$1:dev > /dev/null &

exit 0
