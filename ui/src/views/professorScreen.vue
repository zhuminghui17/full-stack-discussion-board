<template>
    <div>
        <div v-if="user.roles[0] === 'student'" >
            <h1>Students have no access to the admin page!</h1>
        </div>
        <div v-else>
            <b-navbar toggleable="lg" type="dark" variant="dark">
                <b-navbar-brand href="#">Professor {{ user.name }}, it's Admin Page!</b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <!-- <b-navbar-nav>
                    <b-nav-text>
                        Developed with ❤️ by
                    </b-nav-text>
                    <b-nav-item href="#">Congcong Ma</b-nav-item>
                    <b-nav-item href="#">Minghui Zhu</b-nav-item>
                    <b-nav-item href="#">Quan Wang</b-nav-item>
                </b-navbar-nav> -->

                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">

                        <b-nav-item-dropdown right>
                            <!-- Using 'button-content' slot -->
                            <template #button-content>
                                User
                            </template>
                            <b-dropdown-item href="student" v-if="user.roles[0] == 'professor'">Student
                                Page</b-dropdown-item>
                            <b-dropdown-item @click="logout">Log Out</b-dropdown-item>
                            <form method="POST" action="/api/logout" id="logoutForm" />
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>

            <b-container fluid class="my-4">
                <b-row>
                    <!-- This first column consists of a create group button and also group labels the professor managed -->
                    <b-col xs="12" sm="3">
                        <b-button v-b-modal.new-group variant="primary"> New Group </b-button>

                        <b-modal id="new-group" title="New Group" @ok="AddNewGroup">
                            <form ref="form">
                                <b-form-group label="Group Id" label-for="group-id"
                                    invalid-feedback="Group Name is required">
                                    <b-form-input v-model="newGroupId" id="group-id" required></b-form-input>
                                </b-form-group>
                                <b-form-group label="Group Name" label-for="group-name"
                                    invalid-feedback="Description is required">
                                    <b-form-input v-model="newGroupName" id="group-name" required></b-form-input>
                                </b-form-group>
                            </form>
                        </b-modal>
                        <!-- <b-list-group-item variant="primary" button v-for="group, i in groupsInfo" :key="i" class="my-3">
                        <span> Group: {{ group.name }}</span>
                    </b-list-group-item> -->

                        <div v-if="user.roles[0] === 'professor'" class="mt-3">
                            <b-card border-variant="info" header="What Can You Do as a Professor?" align="center">
                                <b-card-text align="left">1. Creat new groups!</b-card-text>
                                <b-card-text align="left">2. Invite students to new groups!</b-card-text>
                                <b-card-text align="left">3. Go to student page at the dropdown!</b-card-text>
                            </b-card>
                        </div>
                    </b-col>
                    <!-- The second column consists of functionality that professor can invite students  -->
                    <b-col xs="12" sm="9">
                        <b-card-group columns>
                            <b-card img-alt="Group" img-top class="groupCards" v-for="group, i in groupsInfo"
                                :img-src="imgSrcs[i]" :key="i" bg-variant="light" text-variant="black" :title=group._id>
                                <b-card-text class="groupName">
                                    {{ group.name }}
                                </b-card-text>
                                <b-button class="btn" v-b-modal.invite-student variant="primary"
                                    @click="selectGroup(group._id)">Invite
                                    Student</b-button>
                            </b-card>
                        </b-card-group>
                        <b-modal id="invite-student" :title="`Invite students to ${theGroupId}`" @ok="inviteStudent">
                            <form ref="form">
                                <b-form-group label="Student ID" label-for="student-id"
                                    invalid-feedback="Student ID is required">
                                    <b-form-input id="student-id" v-model="theStudentId" required></b-form-input>
                                </b-form-group>
                                <!-- <b-form-group label="Group ID" label-for="group-id">
                                    <b-form-input id="group-id" v-model="theGroupId" required></b-form-input>
                                </b-form-group> -->
                                <!-- <b-form-group label="Group" label-for="post-group"
                                    invalid-feedback="Content is required">
                                    <b-form-select v-model="theGroupId"
                                        :options="groupsInfo?.map(g => g._id)"></b-form-select>
                                </b-form-group> -->
                            </form>
                        </b-modal>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref, inject } from 'vue'
import { GroupInfo } from '../../../server/data';

const user: Ref<any> = inject("user")!
const newGroupName: Ref<string> = ref("")
const newGroupId: Ref<string> = ref("")
const theStudentId: Ref<string> = ref("")
const theGroupId: Ref<string> = ref("")
const groupsInfo: Ref<GroupInfo[] | null> = ref(null)



async function getAllgroups() {
    groupsInfo.value = await (await fetch("/api/user/groupsInfo")).json()
}

onMounted(getAllgroups)

async function inviteStudent() {

    await fetch(
        "/api/user/invite-a-student",
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "Put",
            body: JSON.stringify({
                groupId: theGroupId.value,
                studentId: theStudentId.value
            })

        }
    )
}


function selectGroup(group_id: string) {
    theGroupId.value = group_id
}

async function AddNewGroup() {
    await fetch(
        "/api/user/add-a-group",
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "Post",
            body: JSON.stringify({
                groupId: newGroupId.value,
                groupName: newGroupName.value,

            })
        }
    )

    newGroupId.value = ""
    newGroupName.value = ""
    getAllgroups()
}

function logout() {
    ; (window.document.getElementById('logoutForm') as HTMLFormElement).submit()
}

const imgSrcs: string[] = [
    "https://cdn.dribbble.com/users/2367860/screenshots/16207023/media/2ba160192820f5455364dc7ab4a0a09a.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/15379124/media/546c9da2cdb213b66b41c2a2cb4cbdf0.png?compress=1&resize=800x600&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/15394564/media/36e77c41759263879d9c797d0b58e929.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/15405830/media/57fd5f629e2f82839fb6657ceb203d65.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/15420005/media/830161c2fc41a68c5e189e4cb79ba71a.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/16693585/media/1727ffeefbda22e2278f0362be55e460.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/14614248/media/36fe29031a0d78e678361a7a3952926f.png?compress=1&resize=800x600&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/15167941/media/35d39a36a96c654c0ec4c797a48cd8db.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/15456940/media/7ff3b69ed1e4731ca7dda1c312b55829.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/15608655/media/2324c1272d4984218992d82e51937311.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/16207023/media/2ba160192820f5455364dc7ab4a0a09a.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/16813804/media/3b9e5712f31488f3df3cb4f91a3076e6.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/16836865/media/1805a04e24b0312bd6d312539dc58e3d.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/15237967/media/912e3b854d9d1e4758747b945c5c9bf2.png?compress=1&resize=800x600&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/14999260/media/af1f9c4e75da35b6a9e35079756d70ed.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/17753379/media/45886ae44312527252531a65fda17357.png?compress=1&resize=1600x1200&vertical=top",
    "https://cdn.dribbble.com/users/2367860/screenshots/16359632/media/94d1cc333602ec8a7786962a1dd8c609.png?compress=1&resize=1600x1200&vertical=top",


]

// let imgsrcIndexs:number[] = []
// function randomSelectImgSrc() {
//     console.log('10086')
//     let count:number = imgSrcs.length
//     const choice:number = Math.floor(Math.random() * count)
//     imgsrcIndexs.push(choice)
//     return imgSrcs[choice]
// }

</script>



<style scoped>
.clickable-icon {
    cursor: pointer;
}

.navbar.navbar-dark.bg-dark {
    background-color: #0077B6 !important;
}

.card-body {
    display: flex;
    flex-direction: column;
}

button.btn {
    margin-top: auto;
}
</style>

