<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="#">Discussion Board Professor</b-navbar-brand>

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
            <!-- This first column consists of a create group button and also group labels the professor managed -->
                <b-col xs="12" sm="2">
                    <b-button v-b-modal.new-group variant="primary"> New Group </b-button>
                    
                    <b-modal id="new-group" title="New Group">
                        <form ref="form">
                        <b-form-group label="Group Name" label-for="group-name" invalid-feedback="Group Name is required">
                            <b-form-input id="group-name" required></b-form-input>
                        </b-form-group>
                        <b-form-group label="Description" label-for="group-description" invalid-feedback="Description is required">
                            <b-form-input id="group-description" required></b-form-input>
                        </b-form-group>
                        </form>
                    </b-modal>
                </b-col>
            <!-- The second column consists of functionality that professor can invite students  -->
                <b-col xs="12" sm="10">
                    <b-card bg-variant="light" text-variant="black" title="Group Name">
                    <b-card-text>
                        This is the description for the group.
                    </b-card-text>
                    <b-button v-b-modal.invite-student variant="primary">Invite Student</b-button>
                    <b-modal id="invite-student" title="Please enter student ID">
                        <form ref="form">
                        <b-form-group label="Student ID" label-for="student-id" invalid-feedback="Student ID is required">
                            <b-form-input id="student-id" required></b-form-input>
                        </b-form-group>
                        </form>
                    </b-modal>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<style scoped>
.clickable-icon {
  cursor: pointer;
}
.navbar.navbar-dark.bg-dark {
    background-color: #0577B1 !important;
}
</style>