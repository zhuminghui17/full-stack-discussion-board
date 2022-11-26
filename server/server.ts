import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId, Timestamp } from 'mongodb'
import { Post, PostInfo } from './data'
import { generateKey } from 'crypto'
// import { DraftOrder, Order } from './data'

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

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// app routes

// get all posts
app.get("/api/all-posts", async (req, res) => {
  res.status(200).json(await posts.find({}).toArray())
})

// get all comments

// TODO
// Api/:userId/groupInfos

// Api/:groupId/postInfos 

// Api/:postId/posts


app.get("/api/user/:userId/groupsInfo", async (req, res) => {
  const _id = req.params.userId
  const user = await users.findOne({ _id })
  if (user == null) {
    res.status(404).json({ _id })
    return
  }
  const _groupIds = user.groupIds
  console.log(_groupIds)
  const groupInfoLists: Object[] = []
  for (let id of _groupIds) {
    console.log("here")
    const _group = await groups.findOne({ _id: id })
    if (_group == null) {
      continue
    }
    console.log(_group)
    const groupInfo = { _id: _group._id, name: _group.name } //could improve 
    groupInfoLists.push(groupInfo)
  }
  res.status(200).json(groupInfoLists)
})

app.get("/api/group/:groupId/postsInfo", async (req, res) => {
  const _id = req.params.groupId
  const group = await groups.findOne({ _id })
  if (group == null) {
    res.status(404).json({ _id }) // why have a 404 case like this? 
    return
  }

  const _postIds = group.postIds
  const postInfoLists: Object[] = []
  for (let id of _postIds) {
    console.log("here")
    const _post = await posts.findOne({ _id: id })
    if (_post == null) {
      continue
    }
    console.log(_post)
    const postInfo = { _id: _post._id, postTitle: _post.postTitle } //could improve 
    postInfoLists.push(postInfo)

  }

  // group.posts = await posts.find({ postId: _postIds }).toArray()
  res.status(200).json(postInfoLists)
  // TODO: return postInfo
})

app.get("/api/post/:postId/post", async (req, res) => {
  const _id = new ObjectId(req.params.postId)
  const post = await posts.findOne({ _id })
  if (post == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(post)
})

app.get("/api/comment/:commentId/comment", async (req, res) => {
  const _id = new ObjectId(req.params.commentId)
  const comment = await comments.findOne({ _id })
  if (comment == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(comment)
})


// POST API
app.post("/api/user/:userId/add-a-post", async (req, res) => {
  const _id = req.params.userId
  const user = await users.findOne({ _id })
  if (user == null) {
    res.status(404).json({ _id })
    return
  }
  // To do newId = 
  const newPostId = new ObjectId()
  await posts.insertOne(
    {
      _id: newPostId,
      authorId: req.params.userId,
      groupId: req.body.groupId,
      postTitle: req.body.postTitle,
      postContent: req.body.postContent,
      timeStamp: new Date(), 
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


app.post("/api/user/:userId/post/:postId/add-a-comment", async (req, res) => {
  let userId = req.params.userId
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
      authorId: req.params.userId,
      commentContent: req.body.commentContent,
      timeStamp: new Date(),
      upvote: 0,
      downvote: 0,
    }
  )

  const result = await posts.updateOne(
    {
      _id: postId,
      authorId: userId,
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

// PUT API

// upthumb
// TODO: 1. 修改点赞数值 2. 只能点一次

app.put("/api/user/:userId/post/:postId/upvote", async (req, res) => {
  const userId = req.params.userId
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

app.put("/api/user/:userId/post/:postId/downvote", async (req, res) => {
  const userId = req.params.userId
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


app.put("/api/user/:userId/post/:postId/comment/:commentId/upvote", async (req, res) => {
  const userId = req.params.userId
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

app.put("/api/user/:userId/post/:postId/comment/:commentId/downvote", async (req, res) => {
  const userId = req.params.userId
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

  // start server
  app.listen(port, () => {
    console.log(`Smoothie server listening on port ${port}`)
  })
})
