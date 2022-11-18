export interface Post {
  _id: string // post id
  // name: string 
  // timeStamp:
  status: "draft" | "sent" | "deleted" // post status
  comment?: string[] // comment
  upvote: number // upvote number, default 0.
  downvote: number // downvote number, default 0.
}

export interface Comment {
  _id: string
  // name: string
  // timeStamp:
  status: "draft" | "sent" | "deleted"
  // comment: string[]
  upvote: number
  downvote: number
}

export interface User {
  _id: string // user id
  name: string // user name
}


export interface Admin {
  _id: string // admin id
  name: string // admin name
}