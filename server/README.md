## Develop
  - checkout to branch 'dev'
  - clone https://gitlab.com/k-room/types in that directory call yarn link, change directory to current and call yarn link k-room.types
  - change directory to backend/db => docker-compose up --build
  - yarn serve

## Commit convention
  - branch name should be of the form type-dd/mm(e.g. develop-20/08)
  - to commit changes call in project root terminal command - cz, it will start commit wizard(if wizard not appear, run npm install -g commitizen)

## If smthng went wrong
  - Make shure that node-env is installed: (https://www.npmjs.com/package/win-node-env)
  - Set frontend app to recommended node version: 14.20.0

## Deploy
  - run make br(dont forget to install it)