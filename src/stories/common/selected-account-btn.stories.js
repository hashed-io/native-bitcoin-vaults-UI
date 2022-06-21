import SelectedAccountBtn from '../../components/common/selected-account-btn.vue'
import AccountsMenu from '../../components/common/accounts-menu.vue'
import { userEvent, within } from '@storybook/testing-library'

export default {
  title: 'Common/SelectedAccountBtn',
  component: SelectedAccountBtn
}

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { SelectedAccountBtn, AccountsMenu },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup () {
    // Story args can be spread into the returned object
    return { args }
  },
  // Then, the spread values can be accessed directly in the template
  template: '<div class="row"><div class="col-3"><QBtn data-testid="SelectAccount" flat padding="0px 0px 0px 0px" no-caps text-color="white"><selectedAccountBtn v-bind="args"/> <AccountsMenu v-bind="args"/></QBtn></div></div>'
})

export const Base = Template.bind({})
Base.args = {
  selectedAccount: {
    address: '5GEEZx22MqCvBDKtFPgTiKAVkoHp1vMTsw8e7fjtRH8Ldzsu',
    meta: {
      name: 'Hasher Account'
    }
  },
  accounts: [
    {
      address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
      meta: {
        name: 'Test Account'
      }
    },
    {
      address: '5DU84E1JYAhftyimxYd1MUaQ82GBKxNVFhDJSUSGU1ULpg1C',
      meta: {
        name: 'Lorem ipsum'
      }
    }
  ]
}
export const OpenMenu = Template.bind({})
OpenMenu.args = {
  selectedAccount: {
    address: '5GEEZx22MqCvBDKtFPgTiKAVkoHp1vMTsw8e7fjtRH8Ldzsu',
    meta: {
      name: 'Hasher Account'
    }
  },
  accounts: [
    {
      address: '5HGZfBpqUUqGY7uRCYA6aRwnRHJVhrikn8to31GcfNcifkym',
      meta: {
        name: 'Test Account'
      }
    },
    {
      address: '5DU84E1JYAhftyimxYd1MUaQ82GBKxNVFhDJSUSGU1ULpg1C',
      meta: {
        name: 'Lorem ipsum'
      }
    }
  ]
}
OpenMenu.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByTestId('SelectAccount'))
}
