# Frontend

Frontend project contributors:  
Henri Lahtela  
Esa Mäkipää  
Juho Hyödynmaa  
Taika Tulonen

Frontend code of KirjApp book review application. Programming environment: React + Material-UI 

The following folders and files are included (may contain folder/files that are not necessary): 

- public (folder) 
- src (folder) 
  - components (folder) 
    - CreateProfilePage.js 
    - LoginPage.js 
    - ReviewPage.js
    - UserPage.js 
  - services (folder) 
    - data.js 
  - App.css 
  - App.js 
  - index.css 
  - index.js
  - KirjApp_logo2.svg
  - noimage.png
- .gitignore 
- README.md 
- package-lock.json 
- package.json  

__Functionality/content:__

src/App.js

- search text field for writing a search text 
- the results matching the search text are shown as cards using Material-UI Card, Grid and Container layout components  
- book information on the cards is presented in textual format 
- shown results (book cards) change according to the search text 

src/index.js

- definition of a React-component with the name App
- renders its contents into the div-element in the file public/index.html (the id value 'root')

src/services/data.js

- promises for 
  - getting book data
  - saving book and/or review data
  - getting reviews related to selected book
  - creating user profile
  - logging in

src/components/CreateProfilePage.js

- shows a form for user to create a profile (username, password and button to submit data).
Password is saved as password hash (no actual password is stored!)

src/components/LoginPage.js

- shows a form for user to log in (username, password and button to submit data)

src/components/ReviewPage.js

- view for 
  - showing the information of a selected book
  - writing and submitting a review
  - showing the reviews
  
src/components/UserPage.js

- shows the information of a logged in user (username and button to list the reviews attached to the user)

Content of src/KirjApp_logo2.svg

- application logo

Content of src/noimage.png

- image to be used in case the book data does not contain cover page image (shows the application logo)

Content of package-lock.json

- automatically generated file that keeps track of dependency versions

Content of package.json

- metadata of project version and list of dependencies
