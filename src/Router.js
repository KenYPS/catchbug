import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import Home from "./Pages/Home"
const Config = () => {
  return <Switch>
    <Redirect exact from="/" to={`/home`} />
    <Route path="/home" exact component={Home} />
    
  </Switch>
}
export default () => {
  return <Config />
}