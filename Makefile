build:
	@bin/precompile.js

dev:
	@export NODE_ENV=development && node app.js

prod:
	@export NODE_ENV=production && node app.js

sync:
	@rsync -rz --relative --progress --exclude-from=.rsync-exclude . ym@saturn.o.2fp.net:~/lib/nodejs | grep 'to-check'

reload-saturn:
	ssh ym@saturn.o.2fp.net "forever restartall"

deploy: build sync reload-saturn
	@echo "deployed"
