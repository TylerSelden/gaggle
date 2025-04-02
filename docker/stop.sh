if [ "$#" -ne 1 ]; then
	echo "./stop.sh <number>"
	exit 1
fi

echo "noVNC-$1 running on port $((3001 + $1)) stopped."

docker container kill noVNC-$1

exit 0
