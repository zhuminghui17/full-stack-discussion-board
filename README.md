# Discussion Board 

## Primary roles
🐎Congcong Ma:  
🐷Minghui Zhu:  
🍄Quan Wang: 

## How to run the program
1. Open Docker
2. Run MongoDB via Docker from terminal `docker run -p 127.0.0.1:27017:27017 -d --rm --name mongo mongo:6.0.2`
3. Open MongoDB Compass
4. Start the server `cd server` -> `npm install` -> `npm run setup` -> `npm start` (keep this terminal open, and open another terminal)
5. Start the ui `cd ui` -> `npm install` -> `npm start` (keep this terminal open, and open another terminal)

## How to set up the Keycloak
1. On macOS/WSL2/Linux: `git clone https://github.com/keycloak/keycloak-containers`
2. `cd keycloak-containers/server`
3. `docker build -t keycloak18 .`

## Final project requirements
## Basic
- [ ] Correct use of git commits
- [ ] Video demo shows a working Vue form with at least 4 fields (Keycloak forms don't count)
- [ ] Video demo demonstrates usability at mobile screen size (putting browser into mobile simulation mode is sufficient)
- [ ] Video demo shows an E2E test with a basic user flow (Keycloak forms don't count)
- [ ] Source code shows app uses load balanced backend REST API (i.e., no obvious dependency on global variables for state) OR Socket.IO backend server
- [ ] Source code shows app uses MongoDB to store nontrivial state
- [ ] Video demo shows Vue router set up with at least 2 routes
- [ ] Video has a good explanation of the key parts of the code
- [ ] Video has a good explanation of how concurrency is handled
- [ ] Video demo demonstrates concurrent use by at least 2 users working properly
- [ ] Video demo shows at least 2 users logging in, using Keycloak
- [ ] Video has all team members speaking for at least 10 seconds (no partial credit)
- [ ] Code base has non-trivial changes over and above class-provided example code (no partial credit)
## Extras (We have 3 extras)
CI/CD
- [ ] Video shows CI/CD in GitLab doing a build using Docker
- [ ] Video demonstrates a CI/CD E2E test fail
- [ ] Video shows CI/CD enabling a feature change (can be as simple as just changing wording on a
page)

Administrator user role
- [ ] Video shows an administrator logging in and seeing an app screen indicating administrator role
- [ ] Video demonstrates a significant administrator-specific feature
- [ ] Video demonstrates the administrator-specific feature is indeed missing for normal users

User registration flow
- [ ] Video shows a failed user login for an unregistered user
- [ ] Video shows registering a new user (the one that failed)
- [ ] Video demonstrates full function for newly registered user

## Notes and assumptions

## Branch
1. Create a new branch
```
git checkout -b <local-branch-name>
```
or 
```
git branch <local-branch-name>
```

2. Switch to branch 
```
git checkout <local-branch-name>
```

*[Oh my zsh](https://ohmyz.sh/) can show which branch you are on.*

3. Push to remote (and track this branch)
```
git push -u origin <remote-branch-name>
```

4. Step 3 will set the tracking, check the tracking map via 
```
git branch -vv
``` 

5. So when you are on the created branch, you should be able to pull directly via 
```
git pull
```

6. Merge/rebase to `main`  
*On the branch `main`*
```
git merge <local-branch-name>
```
or 
```
git rebase <local-branch-name>
```

[Difference between merge and rebase](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)
