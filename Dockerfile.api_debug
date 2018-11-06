FROM alpine:3.5

RUN mkdir -p /usr/app/naftis/bin
COPY bin/naftis-api /usr/app/naftis/bin/

EXPOSE 50000

ENTRYPOINT ["/usr/app/naftis/bin/naftis-api", "start"]