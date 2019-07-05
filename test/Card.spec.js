import { shallow, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import { Nuxt, Builder } from 'nuxt'
import NuxtBuefy from 'nuxt-buefy'
import Card from '@/components/Card.vue'

const config = require('./fixture/nuxt.config')

describe('Card', () => {
  let wrapper
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(config)
    await new Builder(nuxt).build()
    await nuxt.listen(3000)
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  beforeEach(() => {
    wrapper = shallow(Card, {
      propsData: {
        title: 'foo',
        tags: ['bar', 'foobar'],
        rating: '9.0',
        thumb: 'https://via.placeholder.com/150'
      },
      stubs: {
        'nuxt-link': RouterLinkStub,
        'no-ssr': true,
        'vue-circle': true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('is a Vue instance', () => {
    const localVue = createLocalVue()
    localVue.use(NuxtBuefy)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
