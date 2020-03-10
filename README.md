# tichete
open source it ticketing system

### Current State / Change Log
Feb 4 2018 - v0.1.0
- Added an ORM (Sequelize) to help with supporting different database languages
- Updated Angular to v5 and other npm packages to latest versions.

May 21 2017 - v0.0.3
- User login/authentication added.
- Able to assign/unassign tickets to users, but ticket resolving not yet implemented.

March 4 2017 - v0.0.2.1
- Converted project to Angular-CLI with WebPack.
- Able to assign/unassign tickets to users, but ticket resolving not yet implemented.

### Instructions
 - Install sqlite3 here: http://sqlite.org/download.html
 - Clone this repo to your machine
 - cd into the frontend and backend tichete directories and run "npm install" in each
 - ~~From the frontend directory, run "gulp app_build" to copy node module files into public directory~~
 - Run "npm start" from the backend and frontend directories, the default address will be http://localhost:3000

### Todos

 - Result pagination for tickets/users
 - IT ticket addressing, responding, resolving, rejecting, commenting, etc
 - Dedicated ticket search page
 - Ticket locking when "Update" is clicked on the detail panel
 - Site-wide permissions
 - Dashboard 'active tickets' for admins, 'my active tickets' for non-admins
 - SSL used during authentication
 - Smart redirection for invalid URLs within app

---
### License

GPLv3
