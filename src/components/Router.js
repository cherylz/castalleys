import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Search from './Search';
import Podcast from './Podcast';
import Episode from './Episode';
import NotFound from './NotFound';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/keyword" component={Search} />
      <Route path="/podcastId" component={Podcast} />
      <Route path="/podcastId/:episodeId" component={Episode} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
