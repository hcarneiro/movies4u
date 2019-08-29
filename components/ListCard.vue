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
            <b-button rounded @click="onEditList()">
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
import bus from '~/plugins/bus'

export default {
  props: {
    list: {
      type: Object,
      required: true
    },
    type: {
      type: String,
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
    onEditList() {
      bus.$emit('open-list-modal', {
        type: 'edit',
        context: this.type,
        list: this.list
      })
    },
    onDeleteList(id) {
      this.$buefy.dialog.confirm({
        title: 'Delete list',
        message: 'Are you sure you want to <b>delete</b> this list? This action cannot be undone.',
        confirmText: 'Delete list',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.$store.dispatch('lists/deleteList', id)
        }
      })
    }
  }
}
</script>
