import { MongoClient, ObjectId } from 'mongodb'
import { Post, Comment, User, Group } from './data'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const posts: Post[] = [
  {
    _id: 'p1', // post id
    authorId: 'u1',
    groupId: 'g1',
    postTitle: 'Hello World!',
    postContent: 'Hello World! Hello World!' ,
    timeStamp: '2022-11-19 12:00:00', 
    comments: [], // comment
    upvote: 0,
    downvote: 0 
  },
  {
    _id: "p2",
    authorId : 'u2',
    groupId: 'g2',
    postTitle: 'Second post!',
    postContent: 'This is the second post' ,
    timeStamp: '2022-11-19 12:00:01',
    comments: [], // comment
    upvote: 10,
    downvote: 100, 
  },
]

const comments: Comment[] = [
    {
      _id: 'c1', 
      commentContent: 'this is the first comment', 
      timeStamp: '2022-11-19 12:00:02', 
      upvote: 0,
      downvote: 0 
    },
  ]

const users: User[] = [
    {
      _id: 'u1', 
      name: 'ccdd',
      groupIds: ['g1']
    },
    {
      _id: 'u2', 
      name: 'ddcc',
      groupIds: ['g2']
    }
  ]

const groups: Group[] = [
    {
      _id: 'g1', 
      name: 'Example Group',
      postIds: ['p1']
    },
    {
      _id: 'g2', 
      name: 'Example Group 2',
      postIds: ['p1']
    }
  ]


async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // set up unique index for upsert -- to make sure a customer cannot have more than one draft order
  // db.collection("orders").createIndex(
  //   { customerId: 1 }, 
  //   { unique: true, partialFilterExpression: { state: "draft" } }
  // )

  // add data
  console.log("inserting posts", await db.collection("posts").insertMany(posts as any))
  console.log("inserting comments", await db.collection("comments").insertMany(comments as any))
  console.log("inserting users", await db.collection("users").insertMany(users as any))
  console.log("inserting groups", await db.collection("groups").insertMany(groups as any))
  process.exit(0)
}

main()
