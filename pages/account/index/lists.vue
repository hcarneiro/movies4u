<template>
  <div>
    Lists of: {{ user.fullName }}
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'My Account - Edit Lists',
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
