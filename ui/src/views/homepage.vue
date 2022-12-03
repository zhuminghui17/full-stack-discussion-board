<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="#">Discussion Board Homepage</b-navbar-brand>

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
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>x
            </b-collapse>
        </b-navbar>
        <b-container fluid class="my-4">
            <div class="mt-5">
                <b-card-group deck class="justify-content-md-center">
                    <b-card align="center" title="Students Login"
                        img-src="https://img.freepik.com/free-vector/tiny-teachers-with-educational-tools-stationery-isolated-flat-vector-illustration-cartoon-teachers-different-disciplines-as-geography-math-physical-culture-education-school-concept_74855-13261.jpg?w=1800&t=st=1669948809~exp=1669949409~hmac=063bd842d42fbf5ac0227cc5623e3e48466a7b68e9b43c3c9d10939d6c3fe479"
                        img-alt="Student Login" img-top tag="article" style="max-width: 20rem;" class="mb-2">
                        <b-card-text>
                            Students can login through this portal to view and add posts and comments within the groups
                            they belong to.
                        </b-card-text>

                        <b-button href="http://127.0.0.1:8080/api/login" variant="primary">Log in</b-button>
                    </b-card>

                    <b-card align="center" title="Professors Login"
                        img-src="https://img.freepik.com/free-vector/singing-coach-teaching-group-children-music-teacher-choir-kids-classroom-flat-vector-illustration-music-lesson-education-hobby_74855-13237.jpg?w=1800&t=st=1669948360~exp=1669948960~hmac=bdd43bb21a3a86bc6380619b6a5201c71885802fa46a3f3998e26a314b0c6240"
                        img-alt="Professor Login" img-top tag="article" style="max-width: 20rem;" class="mb-2">
                        <b-card-text>
                            Professors can login through this portal to manage groups and invite students to the groups.
                        </b-card-text>

                        <b-button href="http://127.0.0.1:8080/api/login" variant="primary">Log in</b-button>
                    </b-card>
                </b-card-group>
            </div>
        </b-container>
    </div>
</template>

<style scoped>
.clickable-icon {
    cursor: pointer;
}

.navbar.navbar-dark.bg-dark {
    background-color: #03045E !important;
}
</style>