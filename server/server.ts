import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Issuer, Strategy } from 'openid-client'
import passport from 'passport'
import { keycloak } from "./secrets"
import { User } from "./data"
// import { group } from 'console'
// import User from "./@types/express/index.d"

if (process.env.PROXY_KEYCLOAK_TO_LOCALHOST) {
  // NOTE: this is a hack to allow Keycloak to run from the 
  // same development machine as the rest of the app. We have exposed
  // Keycloak to run off port 8081 of localhost, where localhost is the
  // localhost of the underlying laptop, but localhost inside of the
  // server's Docker container is just the container, not the laptop.
  // The following line creates a reverse proxy to the Keycloak Docker
  // container so that localhost:8081 can also be used to access Keycloak.
  require("http-proxy").createProxyServer({ target: "http://keycloak:8080" }).listen(8081)
}
// set up Mongo
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
let db: Db
let posts: Collection
let comments: Collection
let users: Collection
let groups: Collection

// set up Express
const app = express()
const port = 8095
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// set up session
app.use(session({
  secret: 'a just so-so secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },

  // comment out the following to default to a memory-based store, which,
  // of course, will not persist across load balanced servers
  // or survive a restart of the server
  // store: MongoStore.create({
  //   url,
  //   ttl: 14 * 24 * 60 * 60 // 14 days
  // })
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done: any) => {
  logger.info("serializeUser " + JSON.stringify(user))
  done(null, user)
})
passport.deserializeUser((user: any, done: any) => {
  logger.info("deserializeUser " + JSON.stringify(user))
  done(null, user)
})

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401)
    return
  }

  next()
}

// app routes
app.post(
  "/api/logout", 
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      res.redirect("/")
    })
  }
)

app.get("/api/user", (req, res) => {
  res.json(req.user || {})
})

app.get("/api/student", checkAuthenticated, async (req, res) => {
  const _id = req.user.preferred_username
  logger.info("/api/student " + _id)
  const student = await users.findOne({_id: _id, role: "student" })
  if (student == null) {
    res.status(404).json({ _id })
    return
  }
  student.posts = await posts.find({ userId: _id }).toArray()
  res.status(200).json(student)
})

app.get("/api/professor", checkAuthenticated, async (req, res) => {
  const _id = req.user.preferred_username
  const professor = await users.findOne({_id: _id, role: "professor" })
  if (professor == null) {
    res.status(404).json({ _id })
    return
  }
  professor.posts = await posts.find({ userId: _id }).toArray()
  res.status(200).json(professor)
})


// get all posts
app.get("/api/all-posts", checkAuthenticated, async (req, res) => {
  res.status(200).json(await posts.find({}).toArray())
})

// get all comments
app.get("/api/user/public-group", checkAuthenticated, async (req, res) => {
  const public_group = await groups.findOne({_id:"public"})
  // res.status(200).json(await groups.findOne({_id:"public"}))
  const id = public_group._id
  const name = public_group.name 
  const public_group_info = {
    _id:id,
    name: name
  }
  res.status(200).json(public_group_info)
})



app.get("/api/user/groupsInfo", checkAuthenticated, async (req, res) => { // some changes here 
  const _id = req.user.preferred_username
  const user = await users.findOne({ _id })
  if (user == null) {
    res.status(404).json({ _id })
    return
  }
  const _groupIds = user.groupIds
  const groupInfoLists: Object[] = []
  for (let id of _groupIds) {
    const _group = await groups.findOne({ _id: id })
    if (_group == null) {
      continue
    }
    const groupInfo = { _id: _group._id, name: _group.name } 
    groupInfoLists.push(groupInfo)
  }
  res.status(200).json(groupInfoLists)
})

// Changes Done
app.get("/api/group/:groupId/postsInfo", checkAuthenticated, async (req, res) => {
  const _id = req.params.groupId
  const group = await groups.findOne({ _id })
  if (group == null) {
    res.status(404).json({ _id }) 
    return
  }

  const _postIds = group.postIds
  const postInfoLists: Object[] = []
  for (let id of _postIds) {
    const _post = await posts.findOne({ _id: id })
    if (_post == null) {
      continue
    }
    const postInfo = { _id: _post._id, postTitle: _post.postTitle } 
    postInfoLists.push(postInfo)
  }
  res.status(200).json(postInfoLists)
})

// Changes Done
app.get("/api/post/:postId/post", checkAuthenticated, async (req, res) => {
  const _id = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id })
  if (post == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(post)
})

// Changes Done
app.get("/api/comment/:commentId/comment", checkAuthenticated, async (req, res) => {
  const _id = new ObjectId(req.params.commentId)
  const comment = await comments.findOne({ _id })
  if (comment == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(comment)
})

// Changes Done
app.get("/api/post/:postId/upvote", checkAuthenticated, async (req, res) => {
  const _id = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id })
  if (post == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(post.upvote)
})

// Changes Done
app.get("/api/post/:postId/downvote", checkAuthenticated, async (req, res) => {
  const _id = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id })
  if (post == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(post.downvote)
})

// Changes Done
app.get("/api/post/:postId/comment/:commentId/upvote", checkAuthenticated, async (req, res) => {
  const _id = new ObjectId(req.params.commentId)
  const comment = await comments.findOne({ _id })
  if (comment == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(comment.upvote)
})

// Changes Done
app.get("/api/post/:postId/comment/:commentId/downvote", checkAuthenticated, async (req, res) => {
  const _id = new ObjectId(req.params.commentId)
  const comment = await comments.findOne({ _id })
  if (comment == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(comment.downvote)
})


// POST API
app.post("/api/user/add-a-post", checkAuthenticated, async (req, res) => { // some changes here
  const _id = req.user.preferred_username
  const user = await users.findOne({ _id })
  if (user == null) {
    res.status(404).json({ _id })
    return
  }
  
  function displayAnonymity (input: boolean) {
    if (input) {
      return "Anonymous"
    } else {
      return req.user.preferred_username
    }
  }

  const newPostId = new ObjectId()
  await posts.insertOne(
    {
      _id: newPostId,
      authorId: displayAnonymity(req.body.anonymous),
      groupId: req.body.groupId,
      postTitle: req.body.postTitle,
      postContent: req.body.postContent,
      timeStamp: new Date().toLocaleString(), 
      commentIds: [], 
      upvote: 0,
      downvote: 0,
    }
  )

  const result = await groups.updateOne(
    {
      _id: req.body.groupId,
    },
    {
      $push: {
        postIds: newPostId
      }
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "group push eeror" })
    return
  }
  res.status(200).json({ status: "ok" })
})


app.post("/api/user/post/:postId/add-a-comment", checkAuthenticated, async (req, res) => {
  let userId = req.user.preferred_username
  const user = await users.findOne({ _id: userId })
  if (user == null) {
    res.status(404).json({ userId })
    return
  }

  let postId = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id: postId })
  if (post == null) {
    res.status(404).json({ postId })
    return
  }

  const newCommentId = new ObjectId()

  await comments.insertOne(
    {
      _id: newCommentId,
      authorId: userId,
      commentContent: req.body.commentContent,
      timeStamp: new Date().toLocaleString(),
      upvote: 0,
      downvote: 0,
    }
  )

  const result = await posts.updateOne(
    {
      _id: postId,
    },
    {
      $push: {
        commentIds: newCommentId
      }
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "post push error" })
    return
  }
  res.status(200).json({ status: "ok" })
})

// POST API 
app.post("/api/user/add-a-group", checkAuthenticated, async (req, res) => { // some changes here
  const _id = req.user.preferred_username
  // restrict to only professor
  const user = await users.findOne({ _id, role: "professor" })
  if (user == null) {
    res.status(404).json({ _id })
    return
  }
  
  await groups.insertOne(
    {
      _id: req.body.groupId,
      name: req.body.groupName,
      postIds: []
    }
  )

  let result = await db.collection<{}>("users").updateMany(
    {
      role: "professor",
    },
    {
      $push: {
        groupIds: req.body.groupId,
      },
    },
    {
      upsert: true
    }
  )

  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "group push eeror" })
    return
  }
  res.status(200).json({ status: "ok" })
})






// PUT API

// professor invite student to a specific group
// the frontend only pass studentsIdToInvite: string[] to the server.
app.put("/api/user/invite-a-student", checkAuthenticated, async (req, res) => {
  // validate user: only professor can invite
  const userId = req.user.preferred_username
  const professor = await users.findOne({ _id: userId, role: "professor" })
  if (professor == null) {
    res.status(404).json({ userId })
    return
  }

  // validate group: the group is already created
  const groupId = req.body.groupId
  const group = await groups.findOne({ _id: groupId })
  if (group == null) {
    res.status(404).json({ groupId })
    return
  }

  // recieve students Id from UI
  const studentIdToInvite: string = req.body.studentId
  
  // validate student
  let studentToInvite = await users.findOne({ _id: studentIdToInvite, role: "student" })
  if (studentToInvite == null) {
    res.status(404).json({ groupId })
    return
  }

  // validate that the student to invite is not already in the group
  let checkStudentsExistInGroups: string[] = studentToInvite.groupIds

  if (groupId in checkStudentsExistInGroups){
    res.status(400).json({ groupId })
  }
  
  let result = await users.updateOne(
    {
      _id: studentIdToInvite,
      role: "student",
    },
    {
      $push: {
        groupIds: groupId
      }
    },
    {
      upsert: true
    }
  )
  // validate the changes in groupIds
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "invite error" })
    return
  }
  res.status(200).json({status: "ok" })
})

// upthumb
// TODO: 1. 修改点赞数值 2. 只能点一次

app.put("/api/user/post/:postId/upvote", checkAuthenticated, async (req, res) => {
  const userId = req.user.preferred_username
  const user = await users.findOne({ _id: userId })
  if (user == null) {
    res.status(404).json({ userId })
    return
  }

  const postId = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id: postId })

  if (post == null) {
    res.status(404).json({ postId })
    return
  }
  console.log(post)
  const result = await posts.updateOne(
    {
      _id: postId,
      authorId: userId,
    },
    {
      $inc: {
        upvote: 1
      }
    },
    {
      upsert: true
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "upvote error" })
    return
  }
  res.status(200).json({ status: "ok" })
})

app.put("/api/user/post/:postId/downvote", checkAuthenticated, async (req, res) => {
  const userId = req.user.preferred_username
  const user = await users.findOne({ _id: userId })
  if (user == null) {
    res.status(404).json({ userId })
    return
  }

  const postId = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id: postId })

  if (post == null) {
    res.status(404).json({ postId })
    return
  }

  const result = await posts.updateOne(
    {
      _id: postId,
      authorId: userId,
    },
    {
      $inc: {
        downvote: 1
      }
    },
    {
      upsert: true
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "downvote error" })
    return
  }
  res.status(200).json({ status: "ok" })
})


app.put("/api/user/post/:postId/comment/:commentId/upvote", checkAuthenticated, async (req, res) => {
  const userId = req.user.preferred_username
  const user = await users.findOne({ _id: userId })
  if (user == null) {
    res.status(404).json({ userId })
    return
  }
  
  const postId = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id: postId })
  if (post == null) {
    res.status(404).json({ postId })
    return
  }

  let commentId = new ObjectId(req.params.commentId)
  const comment = await comments.findOne({ _id: commentId })
  if (comment == null) {
    res.status(404).json({ commentId })
    return
  }

  const result = await comments.updateOne(
    {
      _id: commentId,
      authorId: userId,
    },
    {
      $inc: {
        upvote: 1
      }
    },
    {
      upsert: true
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "upvote error" })
    return
  }
  res.status(200).json({ status: "ok" })
})

app.put("/api/user/post/:postId/comment/:commentId/downvote", checkAuthenticated, async (req, res) => {
  const userId = req.user.preferred_username
  const user = await users.findOne({ _id: userId })
  if (user == null) {
    res.status(404).json({ userId })
    return
  }

  const postId = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id: postId })
  if (post == null) {
    res.status(404).json({ postId })
    return
  }

  const commentId = new ObjectId(req.params.commentId)
  const comment = await comments.findOne({ _id: commentId })
  if (comment == null) {
    res.status(404).json({ commentId })
    return
  }

  const result = await comments.updateOne(
    {
      _id: commentId,
      authorId: userId,
    },
    {
      $inc: {
        downvote: 1
      }
    },
    {
      upsert: true
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "downvote error" })
    return
  }
  res.status(200).json({ status: "ok" })
})


// Delete API
app.delete('/api/user/post/:postId/delete', checkAuthenticated, async (req, res) => {
  // validate user: only professor can delete 
  let userId = req.user.preferred_username
  const user = await users.findOne({ _id: userId, role: "professor" })
  if (user == null) {
    res.status(404).json({ userId })
    return
  }

  // validate post: only the post exist
  let postId = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id: postId })
  if (post == null) {
    res.status(404).json({ postId })
    return
  }

  try {
    await posts.deleteOne({ _id: postId })
  } catch (e) {
    res.status(400).json({ error: "delete error" })
  }
  
  let result = await groups.updateOne(
    {
      _id: post.groupId,
    },
    {
      $pull: {
        postIds: [postId] 
      }
    },
    {
      upsert: true
    }
  )
  // validate the changes in groupIds
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "delete error" })
    return
  }
  res.status(200).json({ status: "ok" })
})



app.delete('/api/user/post/:postId/comment/:commentId/delete', checkAuthenticated, async (req, res) => {
  // validate user: only professor can delete 
  let userId = req.user.preferred_username
  const user = await users.findOne({ _id: userId, role: "professor" })
  if (user == null) {
    res.status(404).json({ userId })
    return
  }

  // validate post: only the post exist
  let postId = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id: postId })
  if (post == null) {
    res.status(404).json({ postId })
    return
  }

  // validate comment: only the post exist
  let commentId = new ObjectId(req.params.commentId)
  const comment = await comments.findOne({ _id: commentId })
  if (comment == null) {
    res.status(404).json({ commentId })
    return
  }
  try {
    await comments.deleteOne({ _id: commentId })
  } catch (e) {
    res.status(400).json({ error: "delete error" })
  }

  // update
  let result = await post.updateOne(
    {
      _id: postId,
    },
    {
      $pull: {
        commentIds: [commentId] 
      }
    },
    {
      upsert: true
    }
  )
  // validate the changes in groupIds
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "delete error" })
    return
  }
  res.status(200).json({ status: "ok" })
})




// // // app.put("/api/customer/:customerId/draft-order", async (req, res) => {
// // //   const order: DraftOrder = req.body

// // //   // TODO: validate customerId 

// // //   const result = await orders.updateOne(
// // //     {
// // //       customerId: req.params.customerId,
// // //       state: "draft",
// // //     },
// // //     {
// // //       $set: {
// // //         ingredientIds: order.ingredientIds
// // //       }
// // //     },
// // //     {
// // //       upsert: true
// // //     }
// // //   )
// // //   // if (result == null) {
// // //   //   res.status(404).json({ result})
// // //   //   return
// // //   // }

// //   res.status(200).json({ status: "ok" })
// // })

// app.put("/api/order/:orderId", async (req, res) => {
//   const order: Order = req.body

//   // TODO: validate order object
//   if (order == null) {
//     res.status(404).json({ order})
//     return
//   }
//   const condition: any = {
//     _id: new ObjectId(req.params.orderId),
//     state: { 
//       $in: [
//         // because PUT is idempotent, ok to call PUT twice in a row with the existing state
//         order.state
//       ]
//     },
//   }
//   switch (order.state) {
//     case "blending":
//       condition.state.$in.push("queued")
//       // can only go to blending state if no operator assigned (or is the current user, due to idempotency)
//       condition.$or = [{ operatorId: { $exists: false }}, { operatorId: order.operatorId }]
//       break
//     case "done":
//       condition.state.$in.push("blending")
//       condition.operatorId = order.operatorId
//       break
//     default:
//       // invalid state
//       res.status(400).json({ error: "invalid state" })
//       return
//   }

//   const result = await orders.updateOne(
//     condition,
//     {
//       $set: {
//         state: order.state,
//         operatorId: order.operatorId,
//       }
//     }
//   )

//   if (result.matchedCount === 0) {
//     res.status(400).json({ error: "orderId does not exist or state change not allowed" })
//     return
//   }
//   res.status(200).json({ status: "ok" })
// })

// connect to Mongo
client.connect().then(() => {
  console.log('Connected successfully to MongoDB')
  db = client.db("test")
  posts = db.collection('posts')
  comments = db.collection('comments')
  users = db.collection('users')
  groups = db.collection('groups')

  Issuer.discover("http://127.0.0.1:8081/auth/realms/discussion/.well-known/openid-configuration").then(issuer => {
    const client = new issuer.Client(keycloak)

    passport.use("oidc", new Strategy(
      { 
        client,
        params: {
          // this forces a fresh login screen every time
          prompt: "login"
        }
      },
      async (tokenSet: any, userInfo: any, done: any) => {
        logger.info("oidc " + JSON.stringify(userInfo))

        const _id = userInfo.preferred_username
        const professor = await users.findOne({ _id: _id, role: "professor" }) 
        if ( professor != null) {
          userInfo.roles = ["professor"]
        } else {
          await users.updateOne(
            { _id },
            {
              $set: {
                role: "student",
                name: userInfo.name,
                groupIds: []
              }
            },
            { upsert: true }
          )
          userInfo.roles = ["student"]
        }

        return done(null, userInfo)
      }
    ))

    app.get(
      "/api/login", 
      passport.authenticate("oidc", { failureRedirect: "/api/login" }), 
      (req, res) => res.redirect("/")
    )
    
    app.get(
      "/api/login-callback",
      passport.authenticate("oidc", {
        // successRedirect: "/",
        failureRedirect: "/api/login",
      }),
      (req, res) => {
        if (req.user.preferred_username != "ccdd"){
          res.redirect("/student")
        }
        else{
          res.redirect("/professor")
        }
      }
    )    
  })   
  // start server
  app.listen(port, () => {
    console.log(`Smoothie server listening on port ${port}`)
  })
})
