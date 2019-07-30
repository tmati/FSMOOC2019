import App from './App'
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, waitForElement } from '@testing-library/react'
jest.mock('./services/__mocks__/blogs')


describe('<App />', () => {
  test('if no user is logged in, notes are not rendered', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('login')
    )

    const div = component.container.querySelector('.loggedinP')
    expect(div).toBeNull()
  })

  test('Logged in user sees blogs', async () => {

    const user = {
      username: 'J376y45760ujygölkihrj',
      name: 'LOOO',
      token:'124235'
    }
    window.localStorage.setItem('loggedIn', JSON.stringify(user))

    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement( () => component.getByText('Blog Collection'))
    const ul = component.container.querySelector('.bloglist')
    expect(ul).toBeVisible
  })
})