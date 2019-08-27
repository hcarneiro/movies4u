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

    <div class="modal" :class="{ 'is-active': createListModal }">
      <div class="modal-background" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p>Create a new list</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Title">
            <b-input v-model="title" />
          </b-field>
          <b-field label="Description">
            <b-input v-model="description" maxlength="200" type="textarea" />
          </b-field>
          <div class="field">
            <label class="label">Public list?</label>
            <div class="control">
              <b-checkbox
                v-model="listTypeSelected"
                true-value="Yes"
                false-value="No"
              >
                {{ listTypeSelected }}
              </b-checkbox>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <b-button class="is-primary" @click="onCreateList">
            Create
          </b-button>
          <b-button @click="onCancel">
            Cancel
          </b-button>
        </footer>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="onCancel" />
    </div>
  </div>
</template>

<script>
export default {
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
  data() {
    return {
      createListModal: false,
      title: '',
      description: '',
      listTypeSelected: 'No'
    }
  },
  watch: {
    listTypeSelected(value) {
      console.log(value)
    }
  },
  methods: {
    showCreateListForm() {
      this.createListModal = true
    },
    onCancel() {
      this.createListModal = false
    },
    onCreateList() {

    }
  }
}
</script>
