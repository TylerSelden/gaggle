if [ "$#" -ne 1 ]; then
        echo "./build.sh <container>"
        exit 1
fi

# Get the SSL files into the build context
cp -r ../secrets/ssl ./$1/app/ssl

docker build -t kaiushartala/$1:latest ./$1/.

# Remove them again for security reasons
rm -rf ./$1/app/ssl

exit 0
