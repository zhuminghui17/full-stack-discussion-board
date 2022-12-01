<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="#">Discussion Board Professor</b-navbar-brand>

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
                <!-- This first column consists of a create group button and also group labels the professor managed -->
                <b-col xs="12" sm="2">
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
                </b-col>
                <!-- The second column consists of functionality that professor can invite students  -->
                <b-col xs="12" sm="10">
                    <b-card-group deck>
                        <b-card v-for="group, i in groupsInfo" :key="i" bg-variant="light" text-variant="black"
                            :title=group._id>
                            <b-card-text>
                                {{ group.name }}
                            </b-card-text>
                            <b-button v-b-modal.invite-student variant="primary" @click="selectGroup(group._id)">Invite
                                Student</b-button>
                        </b-card>
                    </b-card-group>
                    <b-modal id="invite-student" title="Please enter student ID" @ok="inviteStudent">
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
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref, inject } from 'vue'
import { GroupInfo } from '../../../server/data';


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
    getAllgroups()
}

</script>



<style scoped>
.clickable-icon {
    cursor: pointer;
}

.navbar.navbar-dark.bg-dark {
    background-color: #0077B6 !important;
}
</style>