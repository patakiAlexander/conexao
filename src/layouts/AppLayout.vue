<template>
  <div id="app-container">
    <topnav />
    <main>
      <div class="container-fluid">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import Topnav from "../containers/navs/Topnav";
import { mapGetters } from "vuex";

export default {
  components: {
    topnav: Topnav,
  },      
};
</script>
