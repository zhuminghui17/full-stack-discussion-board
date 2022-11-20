export interface Post {
  _id: string // post id
  author_id: string
  group_id: string
  post_title: string
  post_content: string 
  timeStamp: string
  // status: "draft" | "sent" | "deleted" // post status
  comment: Comment[] // comment
  upvote: number // upvote number, default 0.
  downvote: number // downvote number, default 0.
}

export interface Comment {
  _id: string
  // name: string
  comment_content: string 
  timeStamp: string
  // status: "draft" | "sent" | "deleted"
  // comment: string[]
  upvote: number
  downvote: number
}

export interface Group {
  _id: string // group id
  name: string // group name
}

export interface User {
  _id: string // user id
  name: string // user name
}