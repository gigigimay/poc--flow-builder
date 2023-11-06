import Flow from './pages/Flow'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FlowList from 'pages/FlowList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:flowId" element={<Flow />} />
        <Route path="/" element={<FlowList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
