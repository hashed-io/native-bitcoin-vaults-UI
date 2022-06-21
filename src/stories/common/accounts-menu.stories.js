import AccountsMenu from '../../components/common/accounts-menu.vue'
import { userEvent, within } from '@storybook/testing-library'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Common/AccountsMenu',
  component: AccountsMenu,
  argTypes: {
    selectAccount: { action: action('selectAccount') }
  }
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { AccountsMenu },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { args }
  },
  methods: {
    selectAccount: action('selectAccount')
  },
  // Then, the spread values can be accessed directly in the template
  template: '<QBtn no-caps data-testid="menu" class="bg-primary text-white"> Open Menu <accountsMenu v-bind="args" @selectAccount="selectAccount"/></QBtn>'
})

export const Base = Template.bind({})
Base.args = {
  accounts: [
    {
      address: '5DU84E1JYAhftyimxYd1MUaQ82GBKxNVFhDJSUSGU1ULpg1C',
      meta: {
        name: 'Test Account 3'
      }
    },
    {
      address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
      meta: {
        name: 'Test Account '
      }
    }
  ],
  selectedAccount: {
    address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym'
  }
}
export const OpenMenu = Template.bind({})
OpenMenu.args = {
  accounts: [
    {
      address: '5DU84E1JYAhftyimxYd1MUaQ82GBKxNVFhDJSUSGU1ULpg1C',
      meta: {
        name: 'Test Account 3'
      }
    },
    {
      address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
      meta: {
        name: 'Test Account '
      }
    }
  ],
  selectedAccount: {
    address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym'
  }
}
OpenMenu.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByTestId('menu'))
}
