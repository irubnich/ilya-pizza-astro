buildSha := $(shell git rev-parse --short HEAD)

dev:
	BUILD_SHA=dev npm run dev

build:
	BUILD_SHA=$(buildSha) npm run build
