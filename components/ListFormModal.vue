<template>
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
        <b-button class="is-primary" :class="{ 'is-disabled': isSaving }" @click="onCreateList">
          <template v-if="!isSaving">
            <template v-if="!isEditMode">
              Create
            </template>
            <template v-else>
              Edit
            </template>
          </template>
          <template v-else>
            Saving...
          </template>
        </b-button>
        <b-button :class="{ 'is-disabled': isSaving }" @click="onCancel">
          Cancel
        </b-button>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="onCancel" />
  </div>
</template>

<script>
import bus from '~/plugins/bus'

export default {
  data() {
    return {
      createListModal: false,
      title: '',
      description: '',
      thumbnail: '',
      file: undefined,
      listTypeSelected: '',
      movie: undefined,
      movies: [],
      creatorId: undefined,
      list: undefined,
      isSaving: false,
      error: undefined,
      isEditMode: false
    }
  },
  created() {
    bus.$on('open-list-modal', this.showCreateListForm)
  },
  destroyed() {
    bus.$on('open-list-modal', this.onCancel)
  },
  methods: {
    showCreateListForm(options) {
      this.listTypeSelected = options.context !== 'public' ? 'No' : 'Yes'

      if (options.type === 'create') {
        this.movie = options.movie
        this.creatorId = options.userId
      }

      if (options.type === 'edit') {
        this.isEditMode = true
        this.list = options.list
        this.title = options.list.title
        this.description = options.list.description
        this.thumbnail = options.list.thumbnail
        this.movies = options.list.movies
        this.creatorId = options.list.creatorId
      }

      this.createListModal = true
    },
    onCancel() {
      this.resetValues()
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

      let promise
      const listData = {
        title: this.title,
        description: this.description,
        thumbnail: this.thumbnail,
        public: this.listTypeSelected === 'Yes',
        movies: this.movie ? [this.movie] : this.movies,
        creatorId: this.creatorId
      }

      if (this.isEditMode) {
        promise = this.$store.dispatch('lists/updateList', {
          listId: this.list.id,
          data: listData
        })
      } else {
        promise = this.$store.dispatch('lists/addNewList', listData)
      }

      promise
        .then(() => {
          this.isSaving = false
          this.resetValues()
          this.createListModal = false
        })
        .catch((error) => {
          this.isSaving = false
          this.error = error
        })
    },
    resetValues() {
      this.listTypeSelected = ''
      this.movie = undefined
      this.creatorId = undefined
      this.file = undefined
      this.title = ''
      this.description = ''
      this.thumbnail = ''
      this.isEditMode = false
    }
  }
}
</script>
