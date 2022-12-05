# Discussion Board 

## Project Introduction
This discussion board allows users to post Q&A. We have two kinds of users, professors and students. Students can create new post in a group and answer questions for a post. Professors can do the same as the students. Additionally, professors can delete post, create group, and invite students into a group. We handle the authentication with Keycloak.

## Development Team
🐎 Congcong Ma:  Connecting backend and frontend, debugs, handle concurrency   
🐷 Minghui Zhu: Backend Design, UI Modification.   
🍄 Quan Wang: Front-end (UI design & implementation), Documentation, Video Recording


## Final project requirements
### Basic
- [x] **Correct use of git commits**
- [x] **Video demo shows a working Vue form with at least 4 fields (Keycloak forms don't count)** 
    - We have a 4-field form (post title, post content, group affiliated, and whether posted as anonymous) when adding a post. 
    - Video Demo (1:16-1:48)
- [x] **Video demo demonstrates usability at mobile screen size (putting browser into mobile simulation mode is sufficient)**
    - The screen is compatible when changing to moblie screen size at the devtools.
    - Video Demo (2:12-2:25)
- [x] **Video demo shows an E2E test with a basic user flow (Keycloak forms don't count)**
    - Video Demo (8:32-9:34)
- [x] **Source code shows app uses load balanced backend REST API (i.e., no obvious dependency on global variables for state) OR Socket.IO backend server**
    - See source code.
- [x] **Source code shows app uses MongoDB to store nontrivial state**
    - See source code.
- [x] **Video demo shows Vue router set up with at least 2 routes**
    - We have 3 Vue routes for homepage, students' screen, and professors' screen.
    - Video Demo (6:38-6:45)
- [x] **Video has a good explanation of the key parts of the code**
    - Video Demo (5:50-7:10)
- [x] **Video has a good explanation of how concurrency is handled**
    - Video Demo (6:45-7:10)
- [x] **Video demo demonstrates concurrent use by at least 2 users working properly**
    - Video Demo (3:22-3:45)
- [x] **Video demo shows at least 2 users logging in, using Keycloak**
    - Video Demo (0:50-2:45）
- [x] **Video has all team members speaking for at least 10 seconds (no partial credit)**
- [x] **Code base has non-trivial changes over and above class-provided example code (no partial credit)**
### Extras (We have 3 extras)
CI/CD
- [x] **Video shows CI/CD in GitLab doing a build using Docker**
    - Video Demon (4:50-8:10)
- [x] **Video demonstrates a CI/CD E2E test fail**
    - Video Demon (5:12-5:43; 8:03-8:10)
- [x] **Video shows CI/CD enabling a feature change (can be as simple as just changing wording on a page)**
    - Video Demon (7:10-8:29)

Administrator user role
- [x] **Video shows an administrator logging in and seeing an app screen indicating administrator role** 
    - The professor (administrator) with username id "ccdd" have a different screen indicating "Admin Page".
    - Video Demo (2:27-2:48)
- [x] **Video demonstrates a significant administrator-specific feature**
    - The professor have a significant administrator-specific feature: create groups, invite students to the groups, and delete posts.
    - Video Demo (2:48-3:25)
- [x] **Video demonstrates the administrator-specific feature is indeed missing for normal users**
    - There is no place for normal users (students) to create a group and invite students.
    - Student have no access to delete a post.
    - Video Demo (4:33-4:46)

**User registration flow**
- [x] **Video shows a failed user login for an unregistered user** 
    - Demo Video (0:25-0:40)
- [x] **Video shows registering a new user (the one that failed)** 
    - Demo Video (0:40-0:59)
- [x] **Video demonstrates full function for newly registered user** 
    - Demo Video (0:59-2:11)

## Run the program
### Run the program with Docker
Right click the `compose.yaml` file, choose the `Compose Up`.
### Run the program with npm
1. Open Docker
2. Run MongoDB via Docker from terminal `docker run -p 127.0.0.1:27017:27017 -d --rm --name mongo mongo:6.0.2`
3. Open MongoDB Compass
4. Start the server `cd server` -> `npm install` -> `npm run setup` -> `npm start` (keep this terminal open, and open another terminal)
5. Start the ui `cd ui` -> `npm install` -> `npm start` (keep this terminal open, and open another terminal)

## Resources Used
### Resources used in UI
1. [Color Palette](https://coolors.co/palette/03045e-023e8a-0077b6-0096c7-00b4d8-48cae4-90e0ef-ade8f4-caf0f8)
2. [Illustration for Homepage](https://www.freepik.com/); [Illustration for Admin Page](https://dribbble.com/)
3. [BootstrapVue](https://bootstrap-vue.org/)
### Authentication with Keycloak
1. On macOS/WSL2/Linux: `git clone https://github.com/keycloak/keycloak-containers`
2. `cd keycloak-containers/server`
3. `docker build -t keycloak18 .`
### Setup CI/CD
1. Installing GitLab Runner on your laptop
```
sudo curl --output /usr/local/bin/gitlab-runner "https://gitlab-runnerdownloads.s3.amazonaws.com/latest/binaries/gitlab-runnerdarwin-arm64"
```
```
sudo chmod +x /usr/local/bin/gitlab-runner
```
2. Configuring/starting GitLab Runner on your laptop
Make fixes to `~/Library/LaunchAgents/gitlab-runner.plist` to change `dquan` to your user ID
```
gitlab-runner register
```
```
gitlab-runner start
```
To stop
```
gitlab-runner stop
```
### Branch
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
