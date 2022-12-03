export interface GroupInfo {
  _id: string // group id
  name: string // group name
}

export interface Group extends GroupInfo {
  postIds: string[]
}


export interface PostInfo {
  _id: string // post id
  postTitle: string // post name
}

export interface Post extends PostInfo {
  authorId: string
  groupId: string
  postContent: string
  timeStamp: Date
  // status: "draft" | "sent" | "deleted" // post status
  commentIds: string[] // comment
  upvote: number // upvote number, default 0.
  downvote: number // downvote number, default 0.
}



export interface Comment {
  _id: string
  // name: string
  authorId: string
  commentContent: string
  timeStamp: Date
  // status: "draft" | "sent" | "deleted"
  // comment: string[]
  upvote: number
  downvote: number
}


export interface User {
  _id: string // user id
  role: "student" | "professor"
  name: string // user name
  groupIds: string[]
}

