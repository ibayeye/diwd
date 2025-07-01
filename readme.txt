// check redis server
docker exec -it redis-diwd redis-cli

scp -r build/* root@202.10.47.202:/var/www/diwd-frontend