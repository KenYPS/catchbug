import React from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
const Config = () => {
  const query = useLocation().search
  console.log(query)
  return <Switch>
    <Redirect exact from="/" to={`/home${query}`} />
    <Route path="/home" exact component={Home} />

  </Switch>
}
export default function RouterConfig () {
  return <Config />
}
