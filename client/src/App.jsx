import {
  Navbar,
  Footer,
  Service,
  Transactions,
  Welcome
} from "./components";
import './App.css'

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome/>
      </div>
      <Service/>
      <Transactions/>
      <Footer/>
    </div>
  )
}

export default App
