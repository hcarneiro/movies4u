import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import NuxtBuefy from 'nuxt-buefy'
import Card from '@/components/Card.vue'

describe('Card', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(NuxtBuefy)

  beforeEach(() => {
    wrapper = shallowMount(Card, {
      propsData: {
        id: 1,
        title: 'foo',
        tags: [
          { 
            id: 1,
            name: 'bar'
          },
          {
            id: 2,
            name: 'foobar'
          }
        ],
        rating: 9,
        thumb: 'https://via.placeholder.com/150',
        baseUrl: 'movies'
      },
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

  localVue.filter('formatDate', (value) => {
    return value
  })

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
