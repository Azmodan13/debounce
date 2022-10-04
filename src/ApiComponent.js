import React, {useEffect, useState} from "react";


export const ApiComponent = () => {

    const [result, setResult] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState('redux')


    const onInput = (event) => {
        setQuery(event.target.value)
    }


    const onSubmit = (event) => {
        event.preventDefault();
    }

    const debounce = (fn, ms) => {
        let timeout;
        return function() {
            const fnCall = () => {fn.apply(this, arguments)}
            clearTimeout(timeout);
            timeout = setTimeout(fnCall, ms)
        }
    }

    const debounceOnInput = debounce(onInput, 1000)

    useEffect(()=> {
        setIsLoading(true)
        setError(null)
        console.log(query)
        fetch(`https://hn.algolia.com/api/v1/search?query=${query}`)
        .then((res) => { 
            return res.json()
        })
        .then((data) => {
            if (data.hits.length > 20) {
                throw new Error('big_length');
            }
            setResult(data.hits);
        })
        .catch((error)=> {
            setError(error.message)
        })
        .finally(() =>{
            setIsLoading(false)
        })
    },[query]);


    return(
        <div>
            <form onSubmit={onSubmit} action="">
            {/* <input value={inputValue} onInput={onChange} /> */}
            <input type='search' onInput={debounceOnInput} placeholder='Мгновенный поиск' />

            {/* <button onClick={onClick} type='Submit'>
                Search
            </button> */}
            </form>
            <div>
                {error && (<p> {error} :(</p>)}
                {isLoading && <p>Loading...</p>}
                {!isLoading && (
            <ul>
                {result ? result.map(({title, objectID}) =>(
                    <li key={objectID}>
                        <h2>{title}</h2>
                    </li>
                )) : null}
            </ul>
                )}
            </div>
        </div>
    )
}

