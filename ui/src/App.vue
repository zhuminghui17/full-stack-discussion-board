<!-- Todo:
1. complete the group functionality 
2. componentize each section of UI
3. beautify UI
-->



<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand href="#">This is my discussion board</b-navbar-brand>
    </b-navbar>

    <b-container fluid class="my-4">
      <b-row>
        <b-col xs="12" sm="3">
          <b-button> New Posts</b-button>
          <b-list-group-item button v-for="post, i in posts" :key="i" @click="alert" class="my-4">
            <span>Group {{ i }}</span>

          </b-list-group-item>

        </b-col>
        <b-col xs="12" sm="3">

          <b-list-group flush>
            <b-list-group-item button v-for="post, i in posts" :key="i" @click="selectPost(post)">
              <span>{{ post.post_title }}</span>

            </b-list-group-item>



          </b-list-group>


        </b-col>
        <b-col xs="12" sm="6">
          <b-card v-if="selectedPost != null">
            <h1>
              {{ selectedPost.post_title }}
            </h1>
            <b-row>
              <b-col>
                Time: {{ selectedPost.timeStamp }}
              </b-col>

              <b-col>
                Author: {{ selectedPost.author_id }}
              </b-col>
            </b-row>
            <b-row>
              {{ selectedPost.post_content }}
            </b-row>
            <h2>Comments</h2>
            <b-row v-for="comment, i in selectedPost.comments">
              {{ comment.comment_content }}

            </b-row>
            <b-row>
              <b-col>
                <b-icon v-if="thumbUp" icon="hand-thumbs-up-fill" @click="cancelThumbUp" class="clickable-icon">
                </b-icon>

                <b-icon v-else icon="hand-thumbs-up" @click="clickThumbUp" class="clickable-icon"></b-icon>

              </b-col>
              <b-col>
                <b-icon v-if="thumbDown" icon="hand-thumbs-down-fill" @click="cancelThumbDown" class="clickable-icon">
                </b-icon>

                <b-icon v-else icon="hand-thumbs-down" @click="clickThumbDown" class="clickable-icon"></b-icon>

              </b-col>
            </b-row>


          </b-card>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Example textarea</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            <b-button class="my-3">Post</b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue'
import { post1, post2 } from "./fake_data"



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







function alert() {
  console.log("10086")
}



const selectedPost: Ref<Post | null> = ref(null)
const posts = [post1, post2]

const thumbUp: Ref<Boolean> = ref(false)
const thumbDown: Ref<Boolean> = ref(false)


function selectPost(post: any) {
  return selectedPost.value = post

}

function clickThumbUp() {
  thumbUp.value = true
}

function cancelThumbUp() {
  thumbUp.value = false
}

function clickThumbDown() {
  thumbDown.value = true
}

function cancelThumbDown() {
  thumbDown.value = false
}

</script>

<style scoped>
.clickable-icon {
  cursor: pointer;
}
</style>