import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommonPopover from '../src/CommonPopover.vue'

describe('CommonPopover', () => {
  it('renders popover content', () => {
    const wrapper = mount(CommonPopover, {
      props: {
        title: 'Test Popover'
      },
      slots: {
        default: 'Popover content'
      }
    })
    
    expect(wrapper.text()).toContain('Test Popover')
  })

  it('toggles visibility', async () => {
    const wrapper = mount(CommonPopover, {
      props: { title: 'Test' }
    })
    
    expect(wrapper.vm.isVisible).toBe(false)
  })
})