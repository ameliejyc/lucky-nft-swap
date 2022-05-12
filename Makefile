.PHONY: test

install:
	yarn

compile:
	yarn hardhat compile

test:
	yarn hardhat test