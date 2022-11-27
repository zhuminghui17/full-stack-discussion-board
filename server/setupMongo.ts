import { MongoClient, ObjectId } from 'mongodb'
import { Post, Comment, User, Group } from './data'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
// const comments: Comment[] = [
//   {
//     _id: 'c1',
//     authorId: 'u1',
//     commentContent: 'this is the first comment',
//     timeStamp: new Date(2022, 11, 25, 12, 0, 0, 0),
//     upvote: 0,
//     downvote: 0
//   },
// ]
// const posts: Post[] = [
//   {
//     _id: 'p1', // post id
//     authorId: 'u1',
//     groupId: 'g1',
//     postTitle: 'Hello World!',
//     postContent: 'Hello World! Hello World!',
//     timeStamp: new Date(2022, 11, 20, 12, 0, 0, 0),
//     commentIds: ["c1"], // comment
//     upvote: 0,
//     downvote: 0
//   },
//   {
//     _id: "p2",
//     authorId: 'u2',
//     groupId: 'g2',
//     postTitle: 'Second post!',
//     postContent: 'This is the second post',
//     timeStamp: new Date(2022, 11, 21, 12, 0, 0, 0),
//     commentIds: ["c1"], // comment
//     upvote: 10,
//     downvote: 100,
//   },
//   {
//     _id: "p3",
//     authorId: 'u2',
//     groupId: 'g3',
//     postTitle: 'third post!',
//     postContent: 'This is the third post',
//     timeStamp: new Date(2022, 11, 22, 12, 0, 0, 0),
//     commentIds: ["c1"], // comment
//     upvote: 10,
//     downvote: 100,
//   },
// ]


const users: User[] = [
  {
    _id: 'u1',
    role: "student",
    name: 'ccdd',
    groupIds: ['g1', "g2"]
  },
  {
    _id: 'u2',
    role: "student",
    name: 'ddcc',
    groupIds: ['g2']
  }, 
  {
    _id: 'pr1',
    role: "professor",
    name: 'admin',
    groupIds: ['g1', "g2"]
  }
]

const groups: Group[] = [
  {
    _id: 'g1',
    name: 'Example Group',
    // postIds: ['p1']
    postIds: []
  },
  {
    _id: 'g2',
    name: 'Example Group 2',
    // postIds: ['p1', "p2"]
    postIds: []
  },
  {
    _id: 'g3',
    name: "Example Group3",
    // postIds: ["p1", "p2", "3"]
    postIds: []
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
  // console.log("inserting posts", await db.collection("posts").insertMany(posts as any))
  // console.log("inserting comments", await db.collection("comments").insertMany(comments as any))
  console.log("inserting users", await db.collection("users").insertMany(users as any))
  // console.log("inserting professors", await db.collection("professors").insertMany(professors as any))
  console.log("inserting groups", await db.collection("groups").insertMany(groups as any))


  process.exit(0)
}

main()
