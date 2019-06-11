import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({handleClick, text}) => (
    <button onClick={handleClick}>
        {text}
    </button>
)

const Statistic = ({value, text}) => (
  <tr>
    <td>
  {text}: {value}
  </td>
  </tr>
)


const Statistics = (props) => {

  const getTotal = (good, neutral, bad) => {
    return good+neutral+bad;
  }

  const getPosAmt = (good, neutral, bad) => {
    if (good === 0 && neutral === 0 && bad === 0) {
      return 0;
    } else {
      let total = good + neutral + bad;
      return (good / total) * 100;
    }
  }

  const getAvg = (good, neutral, bad) => {
    if (good === 0 && neutral === 0 && bad === 0) {
      return 0;
    } else {
      let total = good + neutral + bad;
      return (good - bad) / total;
    }
  }

  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
    <div>
      <h1>Statistics</h1>
    <p>No feedback given</p>
    </div>)
  } else {

    return(
    <div>
      <table>
        <thead>
        <tr>
      <th><h1>Statistics</h1></th>
    </tr>
    </thead>
    <tbody>
    <Statistic text='good' value = {props.good}/>
    <Statistic text='neutral' value ={props.neutral}/>
    <Statistic text='bad' value={props.bad}/>
    <Statistic text='all feedback' value={getTotal(props.good,props.neutral,props.bad)}/>
    <Statistic text='average' value={getAvg(props.good, props.neutral, props.bad)}/>
    <Statistic text='positive feedback %' value={getPosAmt(props.good,props.neutral,props.bad)}/>
    </tbody>
    </table>
    </div>
    )
  }
}
const App = (props) => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = (newValue) => {
    setGood(newValue)
  }

  const setToNeutral = (newValue) => {
    setNeutral(newValue)
  }

  const setToBad = (newValue) => {
    setBad(newValue)
  }

  return (
    <div>
    <h1>Unicafe feedback system</h1>
    <Button handleClick={() => setToGood(good + 1)}text="good" />
    <Button handleClick={() => setToNeutral(neutral + 1)}text="neutral" />
    <Button handleClick={() => setToBad(bad + 1)}text="bad" />
    <Statistics good ={good} bad ={bad} neutral={neutral} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)