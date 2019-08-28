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
          <list-card :list="list" />
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

    <div class="modal" :class="{ 'is-active': createListModal }">
      <div class="modal-background" />
      <div class="modal-card ss-create-list">
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
            <label class="label">Thumbnail</label>
            <div class="control">
              <div class="file has-name">
                <label class="file-label">
                  <input
                    ref="thumbnail"
                    class="file-input"
                    type="file"
                    name="resume"
                    accept="image/*"
                    @change="processFile"
                  >
                  <span class="file-cta">
                    <span class="file-icon">
                      <b-icon
                        icon="upload"
                        size="is-small"
                      />
                    </span>
                    <span class="file-label">
                      Choose a file…
                    </span>
                  </span>
                  <span v-if="file && file.name" class="file-name">
                    {{ file.name }}
                  </span>
                  <span v-else class="file-name">
                    ...
                  </span>
                </label>
              </div>
            </div>
          </div>
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
import ListCard from '~/components/ListCard'

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
  data() {
    return {
      createListModal: false,
      title: '',
      description: '',
      thumbnail: '',
      file: undefined,
      listTypeSelected: this.type === 'private' ? 'No' : 'Yes',
      isSaving: false,
      error: undefined
    }
  },
  methods: {
    showCreateListForm() {
      this.createListModal = true
    },
    onCancel() {
      this.createListModal = false
    },
    uploadImage(formData) {
      return this.$store.dispatch('media/uploadThumb', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    onCreateList() {
      if (!this.file) {
        return this.onSaveList()
      }

      const formData = new FormData()
      formData.append('file', this.file)

      this.uploadImage(formData)
        .then((response) => {
          this.thumbnail = response.url
          this.file = undefined
          this.onSaveList()
        })
        .catch((error) => {
          this.error = error
        })
    },
    processFile() {
      this.file = this.$refs.thumbnail.files[0]
    },
    onSaveList() {
      this.isSaving = true
      this.error = undefined

      const listData = {
        title: this.title,
        description: this.description,
        thumbnail: this.thumbnail,
        public: this.listTypeSelected === 'Yes',
        creatorId: this.user.id
      }

      this.$store.dispatch('lists/addNewList', listData)
        .then(() => {
          this.isSaving = false
          this.createListModal = false
        })
        .catch((error) => {
          this.isSaving = false
          this.error = error
        })
    }
  }
}
</script>
