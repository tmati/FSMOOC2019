import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/react/cleanup-after-each'
import Blog from './Blog'

const testBlog = {
  title: 'Simple testing blog',
  author: 'James Bond',
  likes: 15,
  url: '007.org',
  user: {
    name: 'James Bond'
  }
}

const mockHandler = jest.fn()

describe('<Blog />', () => {
  let component

  beforeEach(() => {
    component = render(
      <Blog blog={testBlog} removeblog={mockHandler} hitlike={mockHandler}/>
    )
  })

  test('renders the hidden parts', () => {
    component.container.querySelector('.hiddenContent')
  })

  test('shows name and author to begin with', () => {
    const div = component.container.querySelector('.defaultContent')
    expect(div).toBeVisible()
  })

  test('after clicking the div, all information becomes visible', () => {
    const div = component.container.querySelector('.defaultContent')
    fireEvent.click(div)

    const hiddenDiv = component.container.querySelector('.hiddenContent')
    expect(hiddenDiv).toBeVisible()
  })

})