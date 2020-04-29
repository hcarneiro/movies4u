<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" />
    <div class="modal-card ss-create-list">
      <header class="modal-card-head">
        <p>
          Share <strong>{{ title }}</strong>
        </p>
      </header>
      <section class="modal-card-body">
        <client-only>
          <social-sharing
            :url="url"
            :title="title"
            inline-template
          >
            <div class="ss-share-container">
              <network network="email">
                <b-icon icon="email" /> Email
              </network>
              <network network="facebook">
                <b-icon icon="facebook" /> Facebook
              </network>
              <network network="twitter">
                <b-icon icon="twitter" /> Twitter
              </network>
              <network network="linkedin">
                <b-icon icon="linkedin" /> LinkedIn
              </network>
              <network network="pinterest">
                <b-icon icon="pinterest" /> Pinterest
              </network>
              <network network="reddit">
                <b-icon icon="reddit" /> Reddit
              </network>
              <network network="sms">
                <b-icon icon="cellphone-message" /> SMS
              </network>
              <network network="whatsapp">
                <b-icon icon="whatsapp" /> WhatsApp
              </network>
            </div>
          </social-sharing>
        </client-only>
      </section>
      <footer class="modal-card-foot">
        <b-button @click="onClose">
          Close
        </b-button>
      </footer>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="onClose" />
  </div>
</template>

<script>
import bus from '~/plugins/bus'

export default {
  data() {
    return {
      show: false,
      title: '',
      url: ''
    }
  },
  created() {
    bus.$on('list-share-modal', this.showModal)
  },
  destroyed() {
    bus.$on('list-share-modal', this.onCancel)
  },
  methods: {
    showModal(options) {
      this.title = options.title
      this.url = options.url
      this.show = true
    },
    onClose() {
      this.show = false
    }
  }
}
</script>
