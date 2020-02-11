<template>
  <user-lists :user="user" :lists="publicLists" type="public" />
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
      publicLists: (state) => {
        return state.lists.public
      }
    })
  },
  head() {
    return {
      title: 'My Account - Public Lists',
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
}
</script>
