FROM postgres:16.2

COPY docker/pg_main/script/setup.sh /docker-entrypoint-initdb.d/
COPY docker/pg_main/script/init.sql /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/setup.sh

ENTRYPOINT ["/docker-entrypoint-initdb.d/setup.sh"]

CMD ["postgres"]
