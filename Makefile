push:
	@DIFF=$$(git diff --name-only) && \
	git add . && \
	git commit -m "Modified files: $$DIFF" && \
	git push -f origin main
deploy:
	git pull
	@export DEPLOYPATH=/home1/infin429/public_html/sum20 && \
	cp -R css $$DEPLOYPATH && \
	cp -R img $$DEPLOYPATH && \
	cp -R js $$DEPLOYPATH && \
	cp .htaccess $$DEPLOYPATH && \
	cp robots.txt $$DEPLOYPATH && \
	cp index.html  $$DEPLOYPATH
