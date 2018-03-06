node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save --no-package-lock @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

build:
	tsc

watch:
	tsc -w

build-production: build

test:
	mocha "test/**/*.spec.js" --recursive --require ./test/setup.js --exit