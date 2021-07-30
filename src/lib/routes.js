import Home from "../components/Home"
import Player from "../components/Player"
import Record from "../components/Record"


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
  new Route(Player, '/player/:id', 'Player', true)
]

export default routes
