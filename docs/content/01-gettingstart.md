---
id: 01-gettingstart
title: Getting Start with Maslow
sidebar_label: Getting Start
---

Maslow was created to solve an approach problem: "Always use redux-form, redux-saga, redux-thunk, and repeated reducers/actions structure to scale a project".

Basically here we work with a kind of module approach. Every single domain could export a module with base actions, base reducers and state tree based on their CRUD api actions.

Maslow is client agnostic, that means: you could use axios, native fetch, mappersmith or another. Once that your client fit the base library rules you will be able to construct modules in a blink of an eye. Even so Maslow has `maslow/openapi` a module to create a client (based on AXIOS) to make your your work goes faster.


## Installing
```
npm install maslow
```