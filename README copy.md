# Introduction

ES6 react components build to use in various applications

## Getting Started

To use disprz components in the application first create a .npmrc file and paste the below contents

```shell
@disprz:registry=https://heuristix.pkgs.visualstudio.com/Disprz/_packaging/DisprzWeb/npm/registry/
```

Then follow the steps mentioned in this [document](https://disprz.atlassian.net/l/cp/4JoRv1Sa) from this section - _Setup user level .npmrc file_

## Install

### Stable version

```shell
npm install @disprz/components --save
```

<!-- ### Next version

```shell
npm install @disprz/components@next --save
``` -->

### Beta version

```shell
npm install @disprz/components@beta --save
```

## Usages

Include CSS in your App.js

```js
import "@disprz/components/build/index.css";
```

## Storybook Link

### Staging instance

They are updated whenever a PR is merged into **Active** branch and URL of the Storybook is [this](https://disprzmicrofrontendapp.azureedge.net/disprz-storybook-qa/)

### Production instance

They are updated whenever a PR is merged into **release** branch and URL of the Storybook is [this](https://disprzmicrofrontendapp.azureedge.net/disprz-storybook/)
