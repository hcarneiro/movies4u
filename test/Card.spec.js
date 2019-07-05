import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import NuxtBuefy from 'nuxt-buefy'
// import { generateStubs } from './fixture/stubs'
import Card from '@/components/Card.vue'

describe('Card', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(NuxtBuefy)

  beforeEach(() => {
    wrapper = shallowMount(Card, {
      propsData: {
        title: 'foo',
        tags: ['bar', 'foobar'],
        rating: '9.0',
        thumb: 'https://via.placeholder.com/150'
      },
      // stubs: generateStubs(Card)
      stubs: {
        'nuxt-link': RouterLinkStub,
        'no-ssr': true,
        'vue-circle': true,
        'b-tag': true,
        'b-button': true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
