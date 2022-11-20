<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand href="#">This is my discussion board</b-navbar-brand>
    </b-navbar>

    <b-container fluid class="my-4">
      <b-row>
        <b-col xs="12" sm="3">
          <b-button> New Posts</b-button>
        </b-col>
        <b-col xs="12" sm="3">

          <b-list-group flush>
          <b-list-group-item button 
          v-for = "post, i in posts"
          :key="i"
          @click="selectPost(post)"
          >
          <span>{{post.post_title}}</span>

          </b-list-group-item>



          </b-list-group>


        </b-col>
        <b-col xs="12" sm="6">
          <b-card v-if="selectedPost != null">
            {{selectedPost.post_content}}
          </b-card>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Example textarea</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            <b-button class = "my-3">Post</b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue'
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
  comment: Comment[] // comment
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







function alert() {
  console.log("10086")
}

const post1 = {
  _id: "A",
  author_id: "CCDD",
  post_title: "This is a demo title",
  timeStamp: "2012",
  post_content: "I say, this is a demo"
}

const post2 = {
  _id: "B",
  author_id: "DDCC",
  post_title: "This is a demo title 2",
  timeStamp: "2013",
  post_content: "I say, this is a demo2"
}


const selectedPost = ref(null)
const posts = [post1, post2]
// TODO:
// 1. 调整页面样式，固定比例
// 2. 显示相应内容
// 3. 完成按钮操作

function selectPost(post:any){
  return selectedPost.value = post

}

</script>