<template>
  <div class="card cast-card">
    <div class="card-image">
      <figure class="image is-2by3">
        <nuxt-link :to="`cast/${slug(name)}-${id}`">
          <img v-if="profileImage" :src="profileImage" alt="title">
          <img v-else src="~assets/no-cast.png" alt="No poster available">
        </nuxt-link>
      </figure>
    </div>
    <div class="card-content">
      <p class="title">
        {{ name }}
      </p>
      <p class="subtitle">
        {{ character }}
      </p>
    </div>
  </div>
</template>

<script>
import getSlug from '~/plugins/get-slug'

export default {
  name: 'CastCard',
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    character: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      default: undefined,
      required: false
    }
  },
  data() {
    return {
      slug: getSlug
    }
  }
}
</script>
