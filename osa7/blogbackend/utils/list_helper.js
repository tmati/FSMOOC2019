
const dummy = (blogs) => {
    return 1;
}

const totalLikes = blogs => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favouriteBlog = blogs => {
    const reducer = (last, next) => {
        return (last.likes >= next.likes) ? last : next
    }
    return blogs.reduce(reducer, 0)
}

const mostBlogs = blogs => {
    const reducer = 
    blogs.reduce(reducer, 0)
}

module.exports = { dummy,
    totalLikes,
    favouriteBlog,
}