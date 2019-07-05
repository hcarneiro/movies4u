import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import NuxtBuefy from 'nuxt-buefy'
import VueCircle from 'vue2-circle-progress'
import Card from '@/components/Card.vue'

let wrapper

beforeEach(() => {
  wrapper = shallowMount(Card, {
    propsData: {
      title: 'foo',
      tags: ['bar', 'foobar'],
      rating: '9.0',
      thumb: 'https://via.placeholder.com/150'
    },
    stubs: {
      'nuxt-link': RouterLinkStub,
      'no-ssr': true
    }
  })
})

afterEach(() => {
  wrapper.destroy()
})

describe('Card', () => {
  test('is a Vue instance', () => {
    const localVue = createLocalVue()
    localVue.use(NuxtBuefy)
    localVue.component('vue-circle', VueCircle)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
