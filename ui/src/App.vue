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

            <b-list-group-item button>
              <span @click="alert">10086</span>
            </b-list-group-item>


            <b-list-group-item button>
              <span @click="alert">10086</span>
            </b-list-group-item>
            <b-list-group-item button>
              <span @click="alert">10086</span>
            </b-list-group-item>
          </b-list-group>


        </b-col>
        <b-col xs="12" sm="6">
          <b-card>
            10086
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

export interface User {
    _id: string,
    name: string
}

export interface Post {
    _id: string, 
    author_id: string, 
    post_title: string,
    time: string,
    post_content: string 
}








function alert() {
  console.log("10086")
}

const post1:Post = {
  _id: "A",
  author_id: "CCDD",
  post_title: "This is a demo",
  time: "2012",
  post_content: "I say, this is a demo"
}

const post2:Post = {
  _id: "B",
  author_id: "DDCC",
  post_title: "This is a demo2",
  time: "2013",
  post_content: "I say, this is a demo2"
}

const posts:Post[] = [post1, post2]
// TODO:
// 1. 调整页面样式，固定比例
// 2. 显示相应内容
// 3. 完成按钮操作



</script>