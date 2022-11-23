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
              {{ selectedPost.postTitle }}
            </h1>
            <b-row>
              <b-col>
                Time: {{ selectedPost.timeStamp }}
              </b-col>

              <b-col>
                Author: {{ selectedPost.authorId }}
              </b-col>
            </b-row>
            <b-row>
              {{ selectedPost.postContent }}
            </b-row>
            <h2>Comments</h2>
            <b-row v-for="comment, i in selectedPost.comments" :key="i">
              {{ comment.commentContent }}

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

import {Post, User, Comment, Group, PostInfo, GroupInfo} from "../../server/data"







function alert() {
  console.log("10086")
}

const userId = "u1"
const groupsInfo: Ref<GroupInfo[]|null> = ref(null)
const selectedGroupId: Ref<string | null> = ref(null)
const selectedGroupPostInfos: Ref<PostInfo[]|null> = ref(null)
const selectedPost: Ref<Post | null> = ref(null)
const posts = [post1, post2]


async function refresh() {

  groupsInfo.value = await (await (fetch("/api/user/" + encodeURIComponent(userId) + "/groupsInfo"))).json()

}
onMounted(refresh)





const post1Info:PostInfo = {
  _id:"MCC",
  postTitle: "Congcong MA"
}

const post2Info:PostInfo = {
  _id:"ZMH",
  postTitle: "Minghui ZHu"
}


const thumbUp: Ref<Boolean> = ref(false)
const thumbDown: Ref<Boolean> = ref(false)







  
async function selectPost(postId: string) {
  // selectedPost.value = post1
  selectedPost.value = await (await fetch("/api/" + encodeURI(postId) + "/post")).json()
}

async function selectGroup(group_id:string){

  selectedGroupId.value = group_id
  selectedGroupPostInfos.value = await (await fetch("/api/" + encodeURI(group_id) + "/postsInfo")).json()
  
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