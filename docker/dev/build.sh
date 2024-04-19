if [ "$#" -ne 1 ]; then
        echo "./build.sh <container>"
        exit 1
fi

docker build -t kaiushartala/$1:dev ./$1/.

exit 0
