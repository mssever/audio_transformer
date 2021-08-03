// import 'bootstrap/dist/css/bootstrap.css'
import './assets/App.scss';

import React, {Component} from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import routes from './lib/routes.js'

export default class App extends Component {
  render() {
    return (
        <BrowserRouter>
            <Switch>
                {routes.map(route => {
                    return (
                        <Route
                            key={route.path}
                            exact
                            path={route.path}
                            render={props => <route.func {...props}/>}
                        />
                    )
                })}
            </Switch>
        </BrowserRouter>
    )
  }
}
