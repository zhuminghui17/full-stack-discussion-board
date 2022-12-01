<!-- TODO -->

<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">Discussion Board Student</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-text>
            Developed with ❤️ by
          </b-nav-text>
          <b-nav-item href="#">Congcong Ma</b-nav-item>
          <b-nav-item href="#">Minghui Zhu</b-nav-item>
          <b-nav-item href="#">Quan Wang</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              User
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
          <b-button v-b-modal.new-post variant="primary"> New Post </b-button>

          <b-modal id="new-post" title="New Post" @ok="newPost">
            <form ref="form">
              <b-form-group label="Post Title" label-for="post-title" invalid-feedback="Title is required">
                <b-form-input id="post-title" v-model="newPostTitle" required></b-form-input>
              </b-form-group>
              <b-form-group label="Content" label-for="post-content" invalid-feedback="Content is required">
                <b-form-input id="post-content" v-model="newPostContent" required></b-form-input>
              </b-form-group>
              <b-form-group label="Group" label-for="post-group" invalid-feedback="Content is required">
                <b-form-select v-model="newPostGroupId" :options="groupsInfo?.map(g => g._id)"></b-form-select>
              </b-form-group>
              <b-form-checkbox switch size="lg" v-model="Anonymous" name="check-button">
                Anonymous
              </b-form-checkbox>
            </form>
          </b-modal>

          <div class="mt-3">
            <h4>Groups</h4>
          </div>

          <div class="mt-3">
            <b-list-group-item button v-for="group, i in groupsInfo" :key="i" @click="selectGroup(group._id)">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">Group: {{ group.name }}</h5>
              </div>
            </b-list-group-item>
          </div>

        </b-col>

        <!-- The second column consists of info of all posts  -->

        <b-col xs="12" sm="3">

          <div v-if="selectedGroupId">
            <h4>Posts</h4>
          </div>

          <b-list-group v-if="selectedGroupId" class="mt-3">
            <b-list-group-item button v-for="postInfo, i in selectedGroupPostInfos" :key="i"
              @click="selectPost(postInfo._id)">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">Post: {{ postInfo.postTitle }}</h5>
              </div>
            </b-list-group-item>
          </b-list-group>

        </b-col>


        <!-- The final column consists of the detailed info the selected post  -->
        <b-col xs="12" sm="6">
          <b-card no-body class="overflow-hidden" v-if="selectedGroupId && selectedPost">
            <template #header>
              <b-row>
                <b-col cols="10">
                  <h2 class="mb-0">{{ selectedPost.postTitle }}</h2>
                </b-col>
                <b-col cols="2">
                  <p class="h3 mb-2">
                    <b-icon icon="trash" class="clickable-icon" @click="deletePost()"></b-icon>
                  </p>
                </b-col>
              </b-row>
            </template>
            <b-row no-gutters>
              <b-col md="1">
                <b-card class="row justify-content-md-center border-0 mx-auto">
                  <div class="d-flex align-items-center">
                    <b-avatar class="justify-content-md-center" align-h="center" variant="primary"
                      :text="selectedPost?.authorId[0].toUpperCase()"></b-avatar>
                  </div>
                </b-card>
              </b-col>
              <b-col md="10">
                <b-card-body v-if="selectedPost != null" :title="selectedPost?.authorId"
                  :sub-title="selectedPost.timeStamp.toLocaleString()">

                  <b-card-text>
                    {{ selectedPost.postContent }}
                  </b-card-text>

                </b-card-body>
              </b-col>
            </b-row>
            <b-row align-v="center">
              <b-col cols="auto" offset-md="1" class="mr-auto p-3">
                <b-icon v-if="thumbUp" icon="caret-up-fill" @click="cancelThumbUp" class="clickable-icon"
                  style="font-size: 30px">
                </b-icon>

                <b-icon v-else icon="caret-up" @click="clickThumbUp" class="clickable-icon" style="font-size: 30px">
                </b-icon>
                {{ selectedPost.upvote }}

                <b-icon v-if="thumbDown" icon="caret-down-fill" @click="cancelThumbDown" class="clickable-icon"
                  style="font-size: 30px">
                </b-icon>
                <b-icon v-else icon="caret-down" @click="clickThumbDown" class="clickable-icon" style="font-size: 30px">
                </b-icon>
                {{ selectedPost.downvote }}
              </b-col>
            </b-row>
            <template #footer>
              <h4>Comments</h4>
              <b-list-group>
                <b-list-group-item v-for="comment, i in selectedPostComments" :key="i">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ comment.authorId }}</h5>
                    <small>{{ comment.timeStamp }}</small>
                  </div>

                  <p class="mb-1">
                    {{ comment.commentContent }}
                  </p>

                </b-list-group-item>
              </b-list-group>

            </template>
          </b-card>
          <div class="form-group mt-4" v-if="selectedGroupId && selectedPost">
            <h4 for="exampleFormControlTextarea1">Your Answer</h4>
            <b-form-textarea class="form-control" v-model="newCommentContent" id="exampleFormControlTextarea1" rows="3">
            </b-form-textarea>
            <b-button variant="primary" class="my-3" @click="postComment">Post</b-button>
          </div>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref, inject } from 'vue'
import { post1, post2 } from "../fake_data"

import { Post, User, Comment, Group, PostInfo, GroupInfo } from "../../../server/data"






const user: Ref<any> = inject("user")!
// const userId = user.name
const groupsInfo: Ref<GroupInfo[] | null> = ref([])
const selectedGroupId: Ref<string | null> = ref(null)
const selectedGroupPostInfos: Ref<PostInfo[] | null> = ref(null)
const selectedPost: Ref<Post | null> = ref(null)
const newPostTitle: Ref<String> = ref("")
const newPostContent: Ref<String> = ref("")
const newPostGroupId: Ref<String> = ref("")
const newCommentContent: Ref<String> = ref("")
const selectedPostComments: Ref<Comment[]> = ref([])
const Anonymous: Ref<boolean> = ref(false)

async function refresh() {
  groupsInfo.value = await (await (fetch("/api/user/groupsInfo"))).json()
  const public_group_info = await (await (fetch("/api/user/" + "/public-group"))).json()
  groupsInfo.value?.push(public_group_info)

}
onMounted(refresh)



const thumbUp: Ref<Boolean> = ref(false)
const thumbDown: Ref<Boolean> = ref(false)



async function newPost() {
  // console.log(newPostContent.value)
  // console.log(newPostTitle.value)
  // console.log(newPostGroupId.value)
  await fetch(
    "/api/user/add-a-post",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "Post",
      body: JSON.stringify({
        groupId: newPostGroupId.value,
        postTitle: newPostTitle.value,
        postContent: newPostContent.value,
        anonymous: Anonymous.value
      })
    }
  )
  newPostGroupId.value = ""
  newPostTitle.value = ""
  newPostContent.value = ""


  // if there already has a selectedGroupId, select that group to ensure the selected 
  // group gets refreshed 
  if (selectedGroupId.value != null) {
    selectGroup(selectedGroupId.value)
  }

}
async function postComment() {
  if (selectedPost.value == null) {
    return
  }

  await fetch(
    "/api/user/post/" + encodeURI(selectedPost.value?._id) + "/add-a-comment",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "Post",
      body: JSON.stringify({
        commentContent: newCommentContent.value
      })
    }
  )
  if (selectedGroupId.value != null) {
    selectPost(selectedPost.value._id)
  }

  newCommentContent.value = ""

}

async function deletePost() {
  if (selectedPost.value == null) {
    return
  }
  await fetch(
    "api/user/post/" + encodeURI(selectedPost.value?._id) + "/delete",
    {
      method: "Delete"
    }
  )
  selectedPost.value = null
  if (selectedGroupId.value != null) {
    selectGroup(selectedGroupId.value)
  }
}

async function selectPost(postId: string) {
  // selectedPost.value = post1
  selectedPost.value = await (await fetch("/api/post/" + encodeURI(postId) + "/post")).json()
  if (selectedPost.value != null) {
    let commentIds = selectedPost.value.commentIds
    let _selectedPostComments = []
    for (let id of commentIds) {
      let theComment = await (await fetch("/api/comment/" + encodeURI(id) + "/comment")).json()
      _selectedPostComments.push(theComment)
    }
    selectedPostComments.value = _selectedPostComments
  }
}

async function selectGroup(group_id: string) {

  selectedGroupId.value = group_id
  selectedGroupPostInfos.value = await (await fetch("/api/group/" + encodeURI(group_id) + "/postsInfo")).json()
  selectedPost.value = null
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

.navbar.navbar-dark.bg-dark {
  background-color: #023E8A !important;
}
</style>