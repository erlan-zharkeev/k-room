# K-room

## Develop

- checkout to branch 'dev'
- clone <https://gitlab.com/k-room/types> in that directory call yarn link, change directory to current and call yarn link k-room.types
- find react-scripts in node_modules => find config/webpack.config.js => delete line "include: paths.appSrc"
- clone and follow the instructions in backend repo <https://gitlab.com/k-room/backend>
- yarn serve

## Commit convention

- branch name should be of the form task-dd/mm(e.g. fixLoginInput-20/08)
- to commit changes call in project root terminal command - cz, it will start commit wizard(if wizard not appear, run npm install -g commitizen)

## If smthng went wrong

- Make shure that node-env is installed: (<https://www.npmjs.com/package/win-node-env>)
- Set frontend app to recommended node version: 14.20.0
- ERROR in Plugin "react" was conflicted between ".eslintrc.json" and "BaseConfig" => npx yarn-deduplicate => yarn