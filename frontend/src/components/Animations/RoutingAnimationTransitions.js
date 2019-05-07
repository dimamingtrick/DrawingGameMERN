import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
// import { AnimatedRoute } from 'react-router-transition';

const SlideFromRight = ({ children, routeKey }) => {
  return (
    <TransitionGroup>
      <CSSTransition
        key={routeKey}
        classNames="slide"
        timeout={300}
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};


/**
 * Use in Router child (instead of component/render) prop;
 */
const Fade = (Page, navProps) => {
  return (
    <CSSTransition
      in={navProps.match != null}
      timeout={200}
      classNames="fade"
      unmountOnExit
    >
      <Page {...navProps} />
    </CSSTransition>
  );
};

export { SlideFromRight, Fade };