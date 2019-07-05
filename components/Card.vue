<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-2by3">
        <img :src="thumb" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <p class="title">
        {{ title }}
      </p>
      <div class="content has-text-grey">
        <div class="ss-tag-holder">
          <template v-for="(tag, index) in tags">
            <nuxt-link :key="index" to="/">
              <b-tag rounded>
                {{ tag }}
              </b-tag>
            </nuxt-link>
          </template>
        </div>
        <div class="ss-rating level">
          <div class="level-left">
            <no-ssr>
              <vue-circle
                :progress="percentage"
                :size="40"
                line-cap="round"
                :fill="fill"
                empty-fill="#5c7784"
                :thickness="5"
                :start-angle="4.7"
                :animation="false"
                insert-mode="append"
                :show-percent="true"
              />
            </no-ssr>
          </div>
          <div class="level-right">
            <b-button
              rounded
              size="is-small"
            >
              More info
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      required: true
    },
    rating: {
      type: String,
      required: true
    },
    thumb: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fill: {
        color: '#00d1b2'
      }
    }
  },
  computed: {
    percentage() {
      return (this.rating / 10) * 100
    }
  }
}
</script>
