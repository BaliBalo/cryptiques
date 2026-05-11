NOW="$(date +'%d_%m_%Y')"
DATABASE="cryptiques"
FILENAME="./.db_backups/$DATABASE"_"$NOW".dump
pg_dump -U postgres -d $DATABASE > $FILENAME