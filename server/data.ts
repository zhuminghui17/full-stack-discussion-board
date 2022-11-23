export interface PostInfo {
  _id: string // post id
  postTitle: string // post name
}

export interface Post extends PostInfo {
  authorId: string
  groupId: string
  postContent: string 
  timeStamp: string
  // status: "draft" | "sent" | "deleted" // post status
  comments: Comment[] // comment
  upvote: number // upvote number, default 0.
  downvote: number // downvote number, default 0.
}



export interface Comment {
  _id: string
  // name: string
  commentContent: string 
  timeStamp: string
  // status: "draft" | "sent" | "deleted"
  // comment: string[]
  upvote: number
  downvote: number
}

export interface GroupsInfo {
  _id: string // group id
  name: string // group name
}

export interface Group extends GroupsInfo {
  postIds: string[]
}

export interface User {
  _id: string // user id
  name: string // user name
  groupIds: string[]
}