<template>
  <user-lists :user="user" :lists="privateLists" type="private" />
</template>

<script>
import { mapState } from 'vuex'
import UserLists from '~/components/UserLists'

export default {
  head() {
    return {
      title: 'My Account - Private Lists',
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  },
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
  }
}
</script>
