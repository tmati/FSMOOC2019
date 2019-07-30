import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/react/cleanup-after-each'
import SimpleBlog from './SimpleBlog'


test('renders title, author and likes', () => {
  const Blog = {
    title: 'Simple testing blog',
    author: 'James Bond',
    likes: 15
  }

  const component = render(
    <SimpleBlog blog={Blog} />
  )

  expect(component.container).toHaveTextContent('Simple testing blog')
  expect(component.container).toHaveTextContent('James Bond')
  expect(component.container).toHaveTextContent('15')
})

test('clicking like button two times call the event handler function twice', async () => {
  const blog = {
    title: 'Maybe the event handler will work as expected',
    author: 'Topi Matikainen',
    likes: 0,
  }

  const mockHandler = jest.fn()

  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler}/>
  )

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})