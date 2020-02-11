<template>
  <div>
    <section class="hero">
      <div class="hero-body ss-account-hero">
        <div class="container">
          <article>
            <div class="content">
              <h1 class="title">
                Lists
              </h1>
            </div>
          </article>
        </div>
      </div>
    </section>
    <div class="container ss-detail-container">
      <div class="columns is-multiline">
        <div v-for="(list, index) in lists" :key="index" class="column is-half-tablet is-one-third-desktop">
          <list-card :list="list" />
        </div>
      </div>
      <client-only>
        <infinite-loading v-if="lists && lists.length" @infinite="infiniteHandler">
          <div slot="no-more" style="color: rgb(102, 102, 102); font-size: 14px; padding: 10px 0px;">
            All loaded
          </div>
          <div slot="no-results" style="color: rgb(102, 102, 102); font-size: 14px; padding: 10px 0px;" />
        </infinite-loading>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListCard from '~/components/ListCard'

export default {
  components: {
    ListCard
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      lists: (state) => {
        return state.lists.allPublic.lists || {}
      },
      page: (state) => {
        return state.lists.allPublic.page
      }
    })
  },
  created() {
    this.getLists()
  },
  methods: {
    getLists() {
      return this.$store.dispatch('lists/getLists')
    },
    infiniteHandler($state) {
      this.$store.dispatch('lists/updateAllPublicLists', this.page + 1)
        .then((response) => {
          if (response.complete) {
            $state.complete()
          } else {
            $state.loaded()
          }
        })
    }
  },
  head() {
    return {
      title: 'Lists',
      meta: [
        { hid: 'keywords', name: 'keywords', keywords: 'Movie Lists, Movie Inspiration, Movie Wishlist, Inspiration List' }
      ]
    }
  }
}
</script>
