<template>
  <div>
    <h3 class="title is-3">
      Edit profile
    </h3>
    <form>
      <div class="field ss-avatar-field">
        <label class="label">Current avatar</label>
        <article>
          <figure class="media-left">
            <div v-if="avatarThumb || avatar" class="ss-user-pic" :style="`background-image: url(${avatarThumb || avatar})`" />
            <div v-else class="ss-user-pic">
              {{ user | getInitials }}
            </div>
          </figure>
          <div class="content">
            <a href="#" @click.prevent="onChangeAvatar">
              Change avatar
            </a>
          </div>
        </article>
      </div>

      <div class="field">
        <div class="field-body">
          <div class="field">
            <label class="label">First name</label>
            <div class="control">
              <input v-model="firstName" class="input" type="text">
            </div>
          </div>
          <div class="field">
            <label class="label">Last name</label>
            <div class="control">
              <input v-model="lastName" class="input" type="text">
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input v-model="email" class="input" type="email" disabled>
        </div>
        <p>
          <b-button class="is-change-email" @click.prevent="onChangeEmail">
            Change email
          </b-button>
        </p>
      </div>

      <div class="field">
        <div class="field-body">
          <div class="field">
            <label class="label">City</label>
            <div class="control">
              <input v-model="city" class="input" type="text">
            </div>
          </div>
          <div class="field">
            <label class="label">Country</label>
            <div class="control">
              <input v-model="country" class="input" type="text">
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Bio</label>
        <div class="control">
          <textarea v-model="bio" class="textarea" />
        </div>
      </div>

      <div class="field is-grouped ss-profile-controls">
        <div class="ss-save-wrapper">
          <div class="control">
            <b-button class="is-primary" @click="onSaveProfile">
              Save
            </b-button>
          </div>
          <div class="control">
            <b-button class="is-text" @click="onCancelProfile">
              Cancel
            </b-button>
          </div>
        </div>
        <div class="control delete-account-wrapper">
          <b-button class="is-danger" @click="onDeleteAccount">
            Delete account
          </b-button>
        </div>
      </div>
    </form>
    <div class="modal" :class="{ 'is-active': avatarModalIsActive }">
      <div class="modal-background" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p>Upload an avatar</p>
        </header>
        <section class="modal-card-body">
          <div class="file has-name">
            <label class="file-label">
              <input
                ref="avatar"
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
        </section>
        <footer class="modal-card-foot">
          <b-button class="is-primary" @click="onUploadAvatar">
            Upload
          </b-button>
          <b-button @click="onCancelAvatar">
            Cancel
          </b-button>
        </footer>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="onCancelAvatar" />
    </div>

    <div class="modal" :class="{ 'is-active': emailModalIsActive }">
      <div class="modal-background" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p>Change email</p>
        </header>
        <section class="modal-card-body">
          <p>If you would like to change your email, enter a new email in the field below. Before being able to log back in, you will have to verify your new address by clicking the activation link in the email we send to your new address.</p>
          <br>
          <div class="field">
            <label class="label">New email</label>
            <div class="control">
              <input v-model="newEmail" class="input" type="email">
            </div>
          </div>
          <div class="field">
            <label class="label">Confirm new email</label>
            <div class="control">
              <input v-model="confirmNewEmail" class="input" type="email">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <b-button class="is-primary" @click="onSaveEmail">
            Change
          </b-button>
          <b-button @click="onCancelEmail">
            Cancel
          </b-button>
        </footer>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="onCancelEmail" />
    </div>

    <div class="modal" :class="{ 'is-active': deleteProfileModalIsActive }">
      <div class="modal-background" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p>Delete account</p>
        </header>
        <section class="modal-card-body">
          <p>Are you sure you want to delete your account?</p>
        </section>
        <footer class="modal-card-foot">
          <b-button class="is-danger" @click="onDeleteProfile">
            Delete
          </b-button>
          <b-button @click="onCancelDelete">
            Cancel
          </b-button>
        </footer>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="onCancelEmail" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      avatar: this.user.profilePicture,
      avatarThumb: this.user.profilePictureThumb,
      file: undefined,
      city: this.user.userCity,
      country: this.user.userCountry,
      bio: this.user.userBio,
      newPassword: '',
      password: '',
      newEmail: '',
      confirmNewEmail: '',
      avatarModalIsActive: false,
      emailModalIsActive: false,
      deleteProfileModalIsActive: false,
      isSaving: false,
      error: undefined
    }
  },
  methods: {
    onChangeAvatar() {
      this.avatarModalIsActive = true
    },
    uploadImage(formData) {
      return this.$store.dispatch('media/uploadThumb', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    processFile() {
      this.file = this.$refs.avatar.files[0]
    },
    onUploadAvatar() {
      if (!this.file) {
        return
      }

      const formData = new FormData()
      formData.append('file', this.file)

      this.uploadImage(formData)
        .then((response) => {
          this.avatar = response.url
          this.avatarThumb = response.thumbnail

          this.file = undefined
          this.avatarModalIsActive = false

          this.onSaveProfile()
        })
        .catch((error) => {
          this.error = error
        })
    },
    onCancelAvatar() {
      this.file = undefined
      this.avatarModalIsActive = false
    },
    onChangeEmail() {
      this.emailModalIsActive = true
    },
    onSaveEmail() {
      this.emailModalIsActive = false
    },
    onCancelEmail() {
      this.emailModalIsActive = false
    },
    onSaveProfile() {
      this.isSaving = true
      this.error = undefined

      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        userBio: this.bio,
        userCity: this.city,
        userCountry: this.country,
        profilePicture: this.avatar,
        profilePictureThumb: this.avatarThumb,
        password: this.password,
        newPassword: this.newPassword
      }

      this.$store.dispatch('user/userUpdate', data)
        .then(() => {
          this.isSaving = false
        })
        .catch((error) => {
          this.isSaving = false
          this.error = error
        })
    },
    onCancelProfile() {
      this.error = undefined

      this.firstName = this.user.firstName
      this.lastName = this.user.lastName
      this.email = this.user.email
      this.avatar = this.user.profilePicture
      this.avatarThumb = this.user.profilePictureThumb
      this.city = this.user.userCity
      this.country = this.user.userCountry
    },
    onDeleteAccount() {
      this.deleteProfileModalIsActive = true
    },
    onDeleteProfile() {
      this.deleteProfileModalIsActive = false

      this.$store.dispatch('user/deleteProfile', { id: this.user.id })
        .then(() => {
          debugger // eslint-disable-line
          this.$router.go({ path: '/' })
        })
        .catch((error) => {
          this.error = error
        })
    },
    onCancelDelete() {
      this.deleteProfileModalIsActive = false
    }
  },
  head() {
    return {
      title: 'My Account - Edit Profile',
      meta: [{
        hid: 'robots',
        name: 'robots',
        content: 'noindex, nofollow'
      }]
    }
  }
}
</script>
