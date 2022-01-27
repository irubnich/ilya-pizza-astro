ip := 137.184.242.77
username := ilya

build:
	npm run build

deploy: build
	rsync -avc --delete --rsync-path="noglob sudo rsync" --chown=www-data:www-data dist/ $(username)@$(ip):/var/www/ilya.pizza/html/

