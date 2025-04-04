if [ "$#" -lt 1 ]; then
	echo "./build.sh <container> [dev]"
	exit 1
fi

BUILD_PATH="containers"

if [ -n "$2" ]; then
	BUILD_PATH="dev"
fi

# Get the SSL files into the build context
cp -r ../../ssl ./$BUILD_PATH/$1/app/ssl

docker build -t kaiushartala/$1:latest ./$BUILD_PATH/$1/.

# Remove them again for security reasons
rm -rf ./$BUILD_PATH/$1/app/ssl

# Remove any generated dangling images and build cache objects

docker system prune --force

exit 0
