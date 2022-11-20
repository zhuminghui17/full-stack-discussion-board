export interface User {
    _id: string,
    name: string
}

export interface Post {
  _id: string // post id
  author_id: string
  group_id: string
  post_title: string
  post_content: string 
  timeStamp: string
  comments: Comment[] // comment
  upvote: number // upvote number, default 0.
  downvote: number // downvote number, default 0.
}

export interface Comment {
  _id: string
  comment_content: string 
  timeStamp: string
  upvote: number
  downvote: number
}



export const comment1:Comment = {
    _id: "C1",
    comment_content: "That's awsome",
    timeStamp: "2019",
    upvote: 0,
    downvote: 0
  }
  
export const comment2:Comment = {
    _id: "C2",
    comment_content: "That's awsome, too",
    timeStamp: "2016",
    upvote: 0,
    downvote: 0
  }
  
  
  
  
export const post1:Post = {
    _id: "A",
    group_id: "All",
    author_id: "CCDD",
    post_title: "This is a demo title",
    timeStamp: "2012",
    post_content: "I say, this is a demo",
    comments: [comment1],
    upvote:0,
    downvote: 0
  }
  
export const post2:Post = {
    _id: "B",
    author_id: "DDCC",
    group_id: "All",
    post_title: "This is a demo title 2",
    timeStamp: "2013",
    post_content: "I say, this is a demo2",
    comments: [comment2],
    upvote:0,
    downvote: 0
  }
  