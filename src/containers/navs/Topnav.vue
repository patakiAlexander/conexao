<template>
  <nav class="navbar fixed-top">
    <logo-conexa style="margin-left: 50px" />
    <div class="navbar-right">
      <div class="user d-inline-block">
        <b-dropdown
          class="dropdown-menu-right"
          right
          variant="empty"
          toggle-class="p-0"
          menu-class="mt-3"
          no-caret
        >
          <template slot="button-content">
            <span v-if="currentUser" class="name mr-1">{{ currentUser.nome }}</span>
          </template>
          <b-dropdown-item @click="logout">Sign out</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { LogoConexa } from "../../components/Svg";
export default {
  components: {
    LogoConexa,
  },
  methods: {
    ...mapActions(["signOut"]),
    logout() {
      this.signOut().then(() => {
        this.$router.push("/user/login");
      });
    },
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser",
    }),
  },
};
</script>