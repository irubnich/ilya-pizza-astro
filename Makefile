buildSha := $(shell git rev-parse --short HEAD)

dev:
	BUILD_SHA=dev npm run dev
