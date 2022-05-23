.PHONY: test

install:
	yarn

compile:
	yarn hardhat compile

test:
	yarn hardhat test

verify:
	yarn hardhat verify --network rinkeby 0xa3e2205c9c8db3b6b43acd760092dbcb7b0b344d 10