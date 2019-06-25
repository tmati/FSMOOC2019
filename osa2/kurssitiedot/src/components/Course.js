import React from 'react'

const Course = (props) => {
    return(
        <div>
        <Header course={props.course.name}/>
        <Content course={props.course}/>
        <Total course={props.course}/>
        </div>
    )
}

const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}

const Content = ({course}) => {
    
    return (
    <div>
       {course.parts.map(cou => <div key={cou.id}>{cou.name} {cou.exercises}</div>)}
    </div>
    )
}

const Total = ({course}) => {
    const arr = course.parts
    const grandTotal = arr.reduce(function (acc, arr) {
    return acc + arr.exercises; }, 0);
    return(
      
      <p><b>Total number of excercises {grandTotal}</b></p>
    )
}

export default Course