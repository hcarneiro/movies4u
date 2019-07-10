<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-2by3">
        <nuxt-link :to="`${baseUrl}/${id}`">
          <img v-if="thumb" :src="thumb" alt="title">
          <img v-else src="~assets/no-poster.png" alt="No poster available">
        </nuxt-link>
      </figure>
    </div>
    <div class="card-content">
      <p class="title">
        {{ title }}
      </p>
      <p class="subtitle">
        {{ releaseDate | formatDate }}
      </p>
      <div class="content has-text-grey">
        <div class="ss-tag-holder">
          <template v-for="(tag, index) in tags">
            <nuxt-link :key="index" :to="`/genres/${tag.id}${baseUrl}`">
              <b-tag rounded>
                {{ tag.name }}
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
                :fill="getFillColor"
                :empty-fill="getEmptyFillColor"
                :thickness="5"
                :start-angle="4.7"
                :animation="false"
                insert-mode="append"
                :show-percent="true"
              />
            </no-ssr>
          </div>
          <div class="level-right">
            <nuxt-link tag="button" :to="`${baseUrl}/${id}`" class="button is-small is-rounded">
              More info
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    releaseDate: {
      type: String,
      default: '',
      required: false
    },
    tags: {
      type: Array,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    thumb: {
      type: String,
      default: undefined,
      required: false
    },
    baseUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      fill: {
        color: '#00d1b2'
      },
      emptyFill: '#5c7784'
    }
  },
  computed: {
    percentage() {
      return (this.rating / 10) * 100
    },
    getFillColor() {
      if (this.percentage >= 0 && this.percentage <= 40) {
        return {
          color: '#ff3860'
        }
      }

      if (this.percentage >= 41 && this.percentage <= 60) {
        return {
          color: '#ffdd57'
        }
      }

      if (this.percentage >= 61 && this.percentage <= 100) {
        return {
          color: '#00d1b2'
        }
      }

      return {
        color: '#00d1b2'
      }
    },
    getEmptyFillColor() {
      if (this.percentage >= 0 && this.percentage <= 40) {
        return 'rgba(255, 56, 96, 0.3)'
      }

      if (this.percentage >= 41 && this.percentage <= 60) {
        return 'rgba(255, 221, 87, 0.3)'
      }

      if (this.percentage >= 61 && this.percentage <= 100) {
        return 'rgba(0, 209, 178, 0.3)'
      }

      return 'rgba(0, 209, 178, 0.3)'
    }
  }
}
</script>
