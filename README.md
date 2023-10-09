![](https://raw.githubusercontent.com/oostvoort/imaigine/main/assets/full_logo_imaigine_onLight.svg)
# Imaigine
An AI-powered text-based adventure on the blockchain. The WebApp is built on top of the [MUD 
framework](https://mud.dev/) with a supporting NodeJS backend to communicate with 
[OpenAI](https://openai.com/) and [Leonardo.ai](https://leonardo.ai/) to generate images and
texts. The game also consists of a Map of the Autonomous World created using the [Fantasy Map
Generator](https://github.com/Azgaar/Fantasy-Map-Generator).

## Live Website


## Local Development

### Prerequisites
1. Install [NodeJS](https://nodejs.org/en/download)
   2. NOTE: This project needs **Node 18**
2. Install [PNPM](https://pnpm.io/installation)
3. Install [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Install Dependencies
```shell 
pnpm i --recursive
```

### Environment Variables
Take note to replace empty environment variables
#### Contracts Repo
```shell 
cp packages/contracts/.env.example packages/contracts/.env 
```
#### Server Repo
```shell 
cp packages/server/.env.example packages/server/.env 
```
#### Client Repo
```shell 
cp packages/client/.env.example packages/client/.env 
```

### Running the WebApp
````shell
pnpm dev
````

### Updating the Subtree
As already stated, the project is reliant on the Fantasy Map Generator using the following command:
`git subtree add --prefix packages/fantasy-map-generator  https://github.com/Azgaar/Fantasy-Map-Generator.git master --squash`
(see this [blog](https://blog.developer.atlassian.com/the-power-of-git-subtree/?_ga=2-71978451-1385799339-1568044055-1068396449-1567112770) 
for more info). To update the Fantasy Map Generator, use this command:
````shell
git subtree pull --prefix packages/fantasy-map-generator https://github.com/Azgaar/Fantasy-Map-Generator.git master --squash
````
