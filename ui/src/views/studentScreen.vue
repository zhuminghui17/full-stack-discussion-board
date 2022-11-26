<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">Discussion Board Student</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Link1</b-nav-item>
          <b-nav-item href="#">Link2</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>

          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">CN</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container fluid class="my-4">

      <b-row>
        <!-- This first column consists of a post button and also group labels  -->
        <b-col xs="12" sm="3">
          <b-button v-b-modal.new-post variant="primary"> New Post</b-button>

          <b-modal id="new-post" title="New Post">
            <form ref="form">
              <b-form-group label="Post Title" label-for="post-title" invalid-feedback="Title is required">
                <b-form-input id="post-title" required></b-form-input>
              </b-form-group>
              <b-form-group label="Content" label-for="post-content" invalid-feedback="Content is required">
                <b-form-input id="post-content" required></b-form-input>
              </b-form-group>
            </form>
          </b-modal>

          <b-list-group-item variant="primary" button v-for="group, i in groupsInfo" :key="i"
            @click="selectGroup(group._id)" class="my-3">
            <span> Group: {{ group.name }}</span>
          </b-list-group-item>

        </b-col>

        <!-- The second column consists of info of all posts  -->

        <b-col xs="12" sm="3">

          <b-list-group flush v-if="selectedGroupId">
            <b-list-group-item variant="success" button v-for="postInfo, i in selectedGroupPostInfos" :key="i"
              @click="selectPost(postInfo._id)" class="my-2">
              <span>{{ postInfo.postTitle }}</span>

            </b-list-group-item>

          </b-list-group>

        </b-col>


        <!-- The final column consists of the detailed info the selected post  -->
        <b-col xs="12" sm="6">
          <b-card no-body class="overflow-hidden">
            <b-row no-gutters>
              <b-col md="1">
                <b-card class="row justify-content-md-center border-0 mx-auto">
                  <b-avatar class="row mr-3" variant="primary" :text="selectedPost?.authorId"></b-avatar>
                  <div class="row mx-auto">{{ selectedPost?.authorId }}</div>
                </b-card>
              </b-col>
              <b-col md="10">
                <b-card-body v-if="selectedPost != null" :title="selectedPost.postTitle"
                  :sub-title="selectedPost.timeStamp">

                  <b-card-text>
                    {{ selectedPost.postContent }}
                  </b-card-text>

                </b-card-body>
              </b-col>
            </b-row>
            <template #footer>
              <h4>Comments</h4>
              <b-card-text v-for="commentId, i in selectedPost?.commentIds" :key="i">
                {{ commentId }}

              </b-card-text>
              <b-row>
                <b-col>
                  <b-icon v-if="thumbUp" icon="caret-up-fill" @click="cancelThumbUp" class="clickable-icon"
                    style="font-size: 30px">
                  </b-icon>

                  <b-icon v-else icon="caret-up" @click="clickThumbUp" class="clickable-icon" style="font-size: 30px">
                  </b-icon>

                  <b-icon v-if="thumbDown" icon="caret-down-fill" @click="cancelThumbDown" class="clickable-icon"
                    style="font-size: 30px">
                  </b-icon>
                  <b-icon v-else icon="caret-down" @click="clickThumbDown" class="clickable-icon"
                    style="font-size: 30px"></b-icon>
                </b-col>
              </b-row>
            </template>
          </b-card>
          <div class="form-group" v-if="selectedGroupId && selectedPost">
            <label for="exampleFormControlTextarea1">Your Answer</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            <b-button variant="primary" class="my-3">Post</b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue'
import { post1, post2 } from "../fake_data"

import { Post, User, Comment, Group, PostInfo, GroupInfo } from "../../../server/data"







function alert() {
  console.log("10086")
}

const userId = "u1"
const groupsInfo: Ref<GroupInfo[] | null> = ref(null)
const selectedGroupId: Ref<string | null> = ref(null)
const selectedGroupPostInfos: Ref<PostInfo[] | null> = ref(null)
const selectedPost: Ref<Post | null> = ref(null)
const posts = [post1, post2]


async function refresh() {

  groupsInfo.value = await (await (fetch("/api/user/" + encodeURIComponent(userId) + "/groupsInfo"))).json()

}
onMounted(refresh)





const post1Info: PostInfo = {
  _id: "MCC",
  postTitle: "Congcong MA"
}

const post2Info: PostInfo = {
  _id: "ZMH",
  postTitle: "Minghui ZHu"
}


const thumbUp: Ref<Boolean> = ref(false)
const thumbDown: Ref<Boolean> = ref(false)








async function selectPost(postId: string) {
  // selectedPost.value = post1
  selectedPost.value = await (await fetch("/api/post/" + encodeURI(postId) + "/post")).json()
}

async function selectGroup(group_id: string) {

  selectedGroupId.value = group_id
  selectedGroupPostInfos.value = await (await fetch("/api/group/" + encodeURI(group_id) + "/postsInfo")).json()

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

<style scoped>
.navbar.navbar-dark.bg-dark {
  background-color: #00539B !important;
}
</style>