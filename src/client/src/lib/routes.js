import Home from "../components/Home.jsx"
import Player from "../components/Player.jsx"
import Record from "../components/Record.jsx"


class Route {
  constructor(func, path, name, skipNav=false) {
    this.func = func
    this.path = path
    this.name = name
    this.skipNav = skipNav
  }
}

const routes = [
  new Route(Home, '/', 'Home'),
  new Route(()=>'Listen', '/listen', 'Listen'),
  new Route(Record, '/record/:id', 'Record', true),
  new Route(Player, '/play/:id', 'Player', true)
]

export default routes
