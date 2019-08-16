#openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out mysitename.crt
#openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out servercrt
#openssl req -new > new.ssl.csr
#openssl rsa -in privkey.pem -out new.cert.key
#openssl x509 -in new.cert.csr -out new.cert.cert -req -signkey new.cert.key -days NNN
#sudo cp new.cert.cert server.crt
#sudo cp new.cert.key server.key
#openssl genrsa -out rootCA.key 2048

#openssl pkcs12 -export -in cert.crt -inkey server.key -out server.p12 -name ftelnet -CAfile ca.crt -caname root

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt

openssl pkcs12 -export -in server.crt -inkey server.key -out server.p12
