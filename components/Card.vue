<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-2by3">
        <div v-if="showDelete" class="ss-remove-card">
          <a href="#" @click.prevent="removeCard">
            Remove
          </a>
        </div>
        <nuxt-link :to="`${baseUrl}/${slug(title)}-${id}`">
          <img v-if="thumb" :src="thumb" :alt="title">
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
            <nuxt-link :key="index" :to="`/genres/${slug(getTitle(tag))}-${tag.id}${baseUrl}`">
              <b-tag rounded>
                {{ tag.name }}
              </b-tag>
            </nuxt-link>
          </template>
        </div>
        <div class="ss-rating level">
          <div class="level-left">
            <client-only>
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
            </client-only>
          </div>
          <div class="level-right">
            <nuxt-link tag="a" :to="`${baseUrl}/${slug(title)}-${id}`" class="button is-small is-rounded">
              More info
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import slug from '~/plugins/get-slug'
import getTitle from '~/plugins/get-title'

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
    },
    showDelete: {
      type: Boolean,
      default: false
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
  },
  methods: {
    slug,
    getTitle,
    removeCard() {
      this.$buefy.dialog.confirm({
        title: 'Delete',
        message: `Are you sure you want to delete <strong>${this.title}</strong> from the list?`,
        confirmText: 'Delete',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.$emit('deleteCard', this.id)
        }
      })
    }
  }
}
</script>
