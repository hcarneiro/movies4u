<template>
  <div>
    <form>
      <div class="field ss-avatar-field">
        <label class="label">Current avatar</label>
        <article>
          <figure class="media-left">
            <p class="image is-48x48">
              <img class="is-rounded" :src="avatar">
            </p>
          </figure>
          <div class="content">
            <a href="#" @click.prevent="onChangeAvatar">
              Change avantar
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

      <div class="field is-grouped">
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
              <input class="file-input" type="file" name="resume">
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
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'My Account - Edit Profile',
      meta: [{
        hid: 'robots',
        name: 'robots',
        content: 'noindex, nofollow'
      }]
    }
  },
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
      isSaving: false,
      error: undefined
    }
  },
  methods: {
    onChangeAvatar() {
      this.avatarModalIsActive = true
    },
    onUploadAvatar() {
      this.avatarModalIsActive = false
    },
    onCancelAvatar() {
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
      this.city = this.user.userCity
      this.country = this.user.userCountry
    }
  }
}
</script>
