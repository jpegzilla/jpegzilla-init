module.exports = `{
  "name": "jpegzilla-init-react",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^4.2.4",
    "@testing-library/react": "^9.3.2",
    "@testing-library/user-event": "^7.1.2",
    "es6-promise": "^4.2.8",
    "isomorphic-fetch": "^2.2.1",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "react-scripts": "3.3.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "mocha --require @babel/register --require ./test/helpers/helpers.js --require ./test/helpers/dom.js --require ignore-styles -b -c './test/*.test.js'",
    "test:watch": "npm run test -- --watch",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%", "not dead", "not op_mini all"
    ],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  },
  "devDependencies": {
    "@babel/core": "^7.7.7",
    "@babel/preset-env": "^7.7.7",
    "@babel/preset-react": "^7.7.4",
    "@babel/register": "^7.7.7",
    "chai": "^4.2.0",
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.2",
    "ignore-styles": "^5.0.1",
    "jsdom": "^15.2.1",
    "mocha": "^7.0.0",
    "react-addons-test-utils": "^15.6.2"
  }
}
`
