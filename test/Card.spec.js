import { shallow, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import NuxtBuefy from 'nuxt-buefy'
import Card from '@/components/Card.vue'
const path = require('path')
const generateStubs = require(path.resolve(__dirname, './fixture/stubs'))

describe('Card', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(NuxtBuefy)

  beforeEach(() => {
    wrapper = shallow(Card, {
      propsData: {
        title: 'foo',
        tags: ['bar', 'foobar'],
        rating: '9.0',
        thumb: 'https://via.placeholder.com/150'
      },
      stubs: generateStubs(Card)
    })

    // wrapper = shallow(Card, {
    //   propsData: {
    //     title: 'foo',
    //     tags: ['bar', 'foobar'],
    //     rating: '9.0',
    //     thumb: 'https://via.placeholder.com/150'
    //   },
    //   stubs: {
    //     'nuxt-link': RouterLinkStub,
    //     'no-ssr': true,
    //     'vue-circle': true
    //   }
    // })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
