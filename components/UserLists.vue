<template>
  <div>
    <div v-if="!lists.length" class="level">
      <div class="level-left">
        <p>You haven't created any {{ type }} lists.</p>
      </div>
      <div class="level-right">
        <b-button class="is-primary" @click="showCreateListForm">
          Create list
        </b-button>
      </div>
    </div>
    <div v-else>
      <div class="level">
        <div class="level-left" />
        <div class="level-right">
          <b-button class="is-primary" @click="showCreateListForm">
            Create list
          </b-button>
        </div>
      </div>
      <div class="columns is-multiline">
        <div v-for="(list, index) in lists" :key="index" class="column is-half-tablet is-one-third-desktop">
          <list-card :list="list" :type="type" />
        </div>
      </div>
      <div class="level">
        <div class="level-left" />
        <div class="level-right">
          <b-button class="is-primary" @click="showCreateListForm">
            Create list
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListCard from '~/components/ListCard'
import bus from '~/plugins/bus'

export default {
  components: {
    ListCard
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    lists: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    showCreateListForm() {
      bus.$emit('open-list-modal', {
        type: 'create',
        context: this.type,
        userId: this.user.id
      })
    }
  }
}
</script>
