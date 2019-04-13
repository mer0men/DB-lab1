<template>
  <div id="app">
    <nav-bar></nav-bar>
    <transition
      enter-active-class="animated fadeInRight"
      leave-active-class="animated fadeOutLeft"
      mode="out-in">
        <router-view :customTableData="customTableData"></router-view>
    </transition>
  </div>
</template>

<script>
import navBar from './components/NavBar.vue'
import { eventBus } from './main';
export default {
  name: 'App',
  components: {
    navBar: navBar
  },
  data () {
    return {
      customTableData: []
    }
  },
  created () {
    eventBus.$on('customTableData', (data) => {
      this.customTableData = data
    })
  }
}
</script>
