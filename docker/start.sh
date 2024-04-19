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


echo "noVNC-$4 ($1) running on port $((8081 + $4)) with credentials '$2:$3'."

docker run -it --rm --name noVNC-$4 -p $((8081 + $4)):6080 -e VNC_USER="$2" -e VNC_PASSWD="$3" kaiushartala/$1:latest bash
#docker run -t --rm --name noVNC-$4 -p $((8081 + $4)):6080 -e VNC_USER="$2" -e VNC_PASSWD="$3" kaiushartala/$1:latest > /dev/null &

exit 0
