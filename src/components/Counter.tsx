import {useState} from 'react'

export default function Counter() {
    const [counter, setCounter] = useState(0)

    const increase = () => {
        setCounter(count => count + 1)
    }

    const decrease = () => {
        setCounter(count => count - 1)
    }

    return (
        <div>
            <h1>Counter</h1>
            <button onClick={decrease}>-</button>
            <span className="output">{counter}</span>
            <button onClick={increase}>+</button>
        </div>
    )
}
