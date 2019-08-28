<template>
  <div class="card ss-list-card">
    <div class="card-image">
      <nuxt-link :to="`/lists/${slug(list.title)}-${list.id}`">
        <div v-if="list.thumbnail" class="ss-list-image" :style="`background-image: url(${list.thumbnail})`" />
        <div v-else class="ss-list-image" :style="`background-image: url(${noThumbPoster})`" />
      </nuxt-link>
    </div>
    <div class="card-content">
      <p class="title">
        <nuxt-link :to="`/lists/${slug(list.title)}-${list.id}`">
          {{ list.title }}
        </nuxt-link>
      </p>
      <p class="subtitle">
        {{ listCreatorName }}, {{ list.createdAt | fromNow }}
      </p>
      <p>
        {{ list.description }}
      </p>
      <div class="content has-text-grey">
        <div class="ss-tag-holder">
          <template v-for="(category, index) in list.categories">
            <b-tag :key="index" rounded>
              {{ category.name }}
            </b-tag>
          </template>
        </div>
        <div class="ss-list-controls level">
          <div class="level-left" />
          <div class="level-right">
            <b-button rounded @click="onEditList(list.id)">
              Edit
            </b-button>
            <b-button class="is-danger" rounded @click="onDeleteList(list.id)">
              Delete
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { find } from 'lodash'
import noThumbPoster from '~/assets/no-poster.png'
import slug from '~/plugins/get-slug'

export default {
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      noThumbPoster
    }
  },
  computed: {
    listCreatorName() {
      const creator = find(this.list.users, { id: this.list.creatorId })
      if (!creator) {
        return ''
      }
      return `${creator.firstName} ${creator.lastName}`
    }
  },
  methods: {
    slug,
    onEditList(id) {},
    onDeleteList(id) {}
  }
}
</script>
