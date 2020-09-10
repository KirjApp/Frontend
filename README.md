# Frontend

Initial frontend code of KirjApp application is uploaded 4.9.2020. Programming language(s): React + Material-UI 

The following folders and files are included (may contain folder/files that are not necessary): 

- public (folder) 
- src (folder) 
  - components (folder) 
    - Book.js 
    - Filter.js 
    - Input.js 
  - services (folder) 
    - data.js 

  - App.css 
  - App.js 
  - App_test.js 
  - index.css 
  - index.js 
  - logo.svg 
  - serviceWorker.js 
  - setupTests.js 
- .gitignore 
- README.md 
- package-lock.json 
- package.json 

The definitions in app.js file: 

- import React, { useState, useEffect } from "react"; 
- import Filter from "./components/Filter"; 
- import Book from "./components/Book"; 
- import bookService from "./services/data"; 
- import { makeStyles } from "@material-ui/core/styles"; 
- import Grid from "@material-ui/core/Grid"; 
- import Paper from "@material-ui/core/Paper"; 
- import Container from "@material-ui/core/Container"; 

Functionality: 

- User interface includes search text field for writing a search text 
- The results matching the search text are shown as cards using Material-UI Paper, Grid and Container layout components 
- The book data comes from Google Books API 
- Book information on the cards is presented in textual format 
- Shown results (book cards) change according to the search text 
