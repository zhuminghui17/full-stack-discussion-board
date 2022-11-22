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
        <!-- This first column consists of a post button and also group labels  -->
        <b-col xs="12" sm="3">
          <b-button> New Posts</b-button>
          <b-list-group-item button v-for="group, i in groupsInfo" :key="i" @click="selectGroup(group._id)" class="my-4">
            <span>Group {{ group.name }}</span>

          </b-list-group-item>

        </b-col>

        <!-- The second column consists of info of all posts  -->

        <b-col xs="12" sm="3">

          <b-list-group flush
          v-if = "selectedGroupId">
            <b-list-group-item button v-for="postInfo, i in selectedGroupPostInfos" :key="i" @click="selectPost(postInfo._id)">
              <span>{{ postInfo.postTitle }}</span>

            </b-list-group-item>



          </b-list-group>


        </b-col>


        <!-- The final column consists of the detailed info the selected post  -->
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
            <b-row v-for="comment, i in selectedPost.comments" :key="i">
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
          <div 
          class="form-group"
          v-if="selectedGroupId && selectedPost">
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

export interface Group {
  _id: string // group id
  name: string // group name
  postIds: string[]
}

export interface postInfo {
  _id: string
  postTitle: string 
}


function alert() {
  console.log("10086")
}


const selectedGroupId: Ref<string | null> = ref(null)
const selectedGroupPostInfos: Ref<postInfo[]|null> = ref(null)
const selectedPost: Ref<Post | null> = ref(null)
const posts = [post1, post2]






const groupsInfo = [
  {
    _id:"g1",
    name: "exampleGroup1"
  },
  {
    _id:"g2",
    name: "exampleGroup2"
  }
]


const post1Info:postInfo = {
  _id:"MCC",
  postTitle: "Congcong MA"
}

const post2Info:postInfo = {
  _id:"ZMH",
  postTitle: "Minghui ZHu"
}


const thumbUp: Ref<Boolean> = ref(false)
const thumbDown: Ref<Boolean> = ref(false)


function selectPost(postId: string) {
  //  selectedPost.value = post
  selectedPost.value = post1
}

function selectGroup(group_id:string){

  console.log(group_id)
  selectedGroupId.value = group_id
  selectedGroupPostInfos.value = [post1Info,post2Info]
  
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