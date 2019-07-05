import { shallowMount } from '@vue/test-utils'
import Card from '@/components/Card.vue'

let wrapper

beforeEach(() => {
  wrapper = shallowMount(Card, {
    propsData: {
      title: 'foo',
      tags: ['bar', 'foobar'],
      rating: '9.0',
      thumb: 'https://via.placeholder.com/150'
    }
  })
})

afterEach(() => {
  wrapper.destroy()
})

describe('Card', () => {
  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
