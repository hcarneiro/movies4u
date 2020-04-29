<template>
  <user-lists :user="user" :lists="privateLists" type="private" />
</template>

<script>
import { mapState } from 'vuex'
import UserLists from '~/components/UserLists'

export default {
  components: {
    UserLists
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      privateLists: (state) => {
        return state.lists.private
      }
    })
  },
  head() {
    return {
      title: 'My Account - Private Lists',
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' },
        { hid: 'og-title', name: 'og:title', content: 'My Account - Private Lists' }
      ]
    }
  }
}
</script>
