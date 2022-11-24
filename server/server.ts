import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
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
app.get("/api/all-comments", async (req, res) => {
  res.status(200).json(await comments.find({ state: { $ne: "draft" } }).toArray())
})

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

app.get("/api/:groupId/postsInfo", async (req, res) => {
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

app.get("/api/:postId/post", async (req, res) => {
  const _id = req.params.postId
  const post = await posts.findOne({ _id })
  if (post == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(post)
})

// Post 

// Api/user/:userId/post-question

// Api/user/:userId/post/:postId/post-comment

app.post("/api/user/:userId/add-a-post", async (req, res) => {
  // const lastPost = posts.find({ _id: 1 }).sort({$natural: -1}).limit(1)
  // const lastPostId = lastPost._Id
  // // const idField = 'p'

  const _id = req.params.userId
  const user = await users.findOne({ _id })
  if (user == null) {
    res.status(404).json({ _id })
    return
  }
  // To do newId = generateKey()
  await posts.insertOne(
    {
      authorId: req.params.userId,
      groupId: req.body.groupId,
      postTitle: req.body.postTitle,
      postContent: req.body.postContent,
      timeStamp: '2022-11-19 12:00:00', // fixed now
      commentIds: [], // comment
      upvote: 0,
      downvote: 0,
    }
  )

  const result = await groups.updateOne(
    {
      groupId: req.body.groupId,
    },
    {
      $push: {
        postIds: 1// TODO: where is the postId
      }
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "no draft order" })
    return
  }
  res.status(200).json({ status: "ok" })
})






// app.post("/api/customer/:customerId/submit-draft-order", async (req, res) => {
//   const result = await orders.updateOne(
//     {
//       customerId: req.params.customerId,
//       state: "draft",
//     },
//     {
//       $set: {
//         state: "queued",
//       }
//     }
//   )
//   if (result.modifiedCount === 0) {
//     res.status(400).json({ error: "no draft order" })
//     return
//   }
//   res.status(200).json({ status: "ok" })
// })




// export function nextId(id: string): string {
//   const field = id.slice(0,0)
//   let idNumber = parseInt(id.slice(1))
//   return Idfield + String(idNumber++)
// }

// export function addPost(name: string): string {
// 	const newPost: Post = {_id, authorId, name }
// 	posts.push(newPost)
// 	save()
// 	return newPost._id
// }




// // app.get("/api/customer/:customerId/draft-order", async (req, res) => {
// //   const { customerId } = req.params

// //   // TODO: validate customerId (Done)

// //   const draftOrder = await orders.findOne({ state: "draft", customerId })
// //   // if (draftOrder == null) {
// //   //   res.status(404).json({ customerId})
// //   //   return
// //   // }
// //   res.status(200).json(draftOrder || { customerId, ingredientIds: [] })
// // })

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

// app.post("/api/customer/:customerId/submit-draft-order", async (req, res) => {
//   const result = await orders.updateOne(
//     {
//       customerId: req.params.customerId,
//       state: "draft",
//     },
//     {
//       $set: {
//         state: "queued",
//       }
//     }
//   )
//   if (result.modifiedCount === 0) {
//     res.status(400).json({ error: "no draft order" })
//     return
//   }
//   res.status(200).json({ status: "ok" })
// })

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
