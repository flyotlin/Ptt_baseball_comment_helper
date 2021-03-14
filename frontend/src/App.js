import { React, useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [comments, setComments] = useState(["hihi", "hyou"]);

  const getData = async () => {
    let res = await axios.get('http://localhost:5000/push_comment');
    setComments(res.data);
  }

  useEffect(() => {
    getData();
  })

  return (
    <div className="App">
      <header className="App-header">
        <h2>PTT Baseball comment helper</h2>
        {
          comments.map((comment) => (
            <div>{comment}</div>
          ))
        }
      </header>
    </div>
  );
}

export default App;
