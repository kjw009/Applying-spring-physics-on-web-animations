# Applying-spring-physics-on-web-animations-
Using spring dynamics to manipulate the way a numerical CSS attribute value changes over time. 
An example code pen: https://codepen.io/danwilson/pen/BajJwQ

Instead of animations being linear, numerical CSS values can change over time using newtonion physics. This allows for natural and elegant animations.

# Limitations and Improvements
The animations function by wrapping element or elements in a HTML Div. This is not the best way to achieve this. One way to remove the need for a div is to refactor the code so that instead of using a component to produce animation, it'll be done using a custom made hook that directly changes CSS attributes of the element.
