import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Designer from './components/pages/Designer/Designer';
import Projects from './components/pages/Projects/Projects';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Header
      </header>
      <div className='APP-content'>
        <Routes>
          <Route path='/' element={<Designer />}></Route>
          <Route path='/projects' element={<Projects />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
