/**
     * Elements will be animated based on spring dynamics by using positions calculated by the ../spring.ts function defined by the input parameters.
     * @param props Defines the animation and what elements will be animated. 
     * start Determines if the animation occurs or not. If the animation is wanted to start by an event, pass a boolean state variable that changes to true when said event occurs. Else assign {true] as the prop.
     * CSSProperty Passed property to be animated
     * children Elements to be passed in that will get animated
     * initialAttributeValue Start value of the given CSS property
     * finalAttributeValue End value of the given CSS property
     * stiffness How strong the model be spring will be.Higher values will appear as a faster animation.If no value is assigned, default value will be used.
     * damping How strong the frictional force be that act against the modeled spring.Higher values will output less "bounces".If no value is assigned, default value will be used.
     * animationDelay Optional prop that determines the delay before the animation begins
     * onAnimmationEnd Optional prop that get called if passed in. Can be used into to have an additional fade in transition or to reveal text
     */
export const SpringAnimation = (props: {
        start: boolean
        children: React.ReactNode;
        cssProperty: string;
        initialAttributeValue: string;
        finalAttributeValue: string;
        stiffness?: number;
        damping?: number;
        animationDelay?: number;
        onAnimationEnd?: () => void;
    }) => {
        // Default values if no spring parameters were assigned
        let stiffness = 90;
        let damping = 6;

        // Assign values for ../spring.ts parameters 
        if (props.stiffness) {
            stiffness = props.stiffness;
        }

        if (props.damping) {
            damping = props.damping;
        }

        let initial = 0;
        let final = 0;

        // Parse only the value inside the brackets for all transform attributes to a number. For example, attributeValue = 'translateY(15px)` will convert into 15 as a number.
        if (props.cssProperty === 'transform') {

            if (props.initialAttributeValue.split('(')[0] === 'scale') {

                const initialString = props.initialAttributeValue.match(/^scale\(([^\)]+)\)/);
                if (initialString?.[1]) {
                    initial = parseFloat(initialString?.[1]);
                }

                const finalString = props.finalAttributeValue.match(/^scale\(([^\)]+)\)/);
                if (finalString?.[1]) {
                    final = parseFloat(finalString?.[1]);
                }
            }
            else {

                const initialString = props.initialAttributeValue.match(/^translate[XYZ]\(([^\)]+)\)/);
                if (initialString?.[1]) {
                    initial = parseFloat(initialString?.[1]);
                }

                const finalString = props.finalAttributeValue.match(/^translate[XYZ]\(([^\)]+)\)/);
                if (finalString?.[1]) {
                    final = parseFloat(finalString?.[1]);
                }
            }
        } // If not transform attribute, just convert string into a number
        else {
            initial = parseFloat(props.initialAttributeValue);
            final = parseFloat(props.finalAttributeValue);
        }

        // Error handling to specify if the attribute value given is invalid for the given CSS Property 
        if (initial === undefined) {
            throw new Error('initialAttributeValueInvalid');
        }

        if (final === undefined) {
            throw new Error('finalAttributeValueInvalid');
        }

        // Hook to use the animation-container element as a means to animate
        const animationDiv = React.useRef<HTMLDivElement>(null);

        let index = 0;

        let unit: string;

        // UseEffect gets called when the start prop changes. Prevents other state variables that are passed in as props from triggering the animation again
        React.useEffect(() => {

            const animate = () => {

                index++;

                // Obtain the values for the changing CSS property at a given frame (positionIndex). Value is obtained by using the ../spring.ts function
                const styleAttributeValue = `${og.ui.shared.animation.spring(index, stiffness, damping, initial, final)}`;

                // If the CSS property undergoing animation is a transform attribute, parse the string and obtain the unit. For example, an attribute value of '15px' or translateY('15px') will return a unit of 'px'
                if (props.cssProperty === 'transform') {

                    if (props.initialAttributeValue.split('(')[0] === 'scale') {

                        const initialString = props.initialAttributeValue.match(/^scale\(([^\)]+)\)/);
                        if (initialString?.[1]) {
                            const value = initialString?.[1].match(/(-?[\d.]+)([a-z%]*)/);
                            if (value?.[2]) {
                                unit = value?.[2];
                            }
                        }
                    }
                    else {

                        const initialString = props.initialAttributeValue.match(/^translate[XYZ]\(([^\)]+)\)/);

                        if (initialString?.[1]) {
                            const value = initialString?.[1].match(/(-?[\d.]+)([a-z%]*)/);
                            if (value?.[2]) {
                                unit = value?.[2];
                            }
                        }
                    }
                }
                // Parse the string and obtain the unit
                else {
                    const value = props.initialAttributeValue?.match(/(-?[\d.]+)([a-z%]*)/);
                    if (value?.[2]) {
                        unit = value?.[2];
                    }
                }

                if (animationDiv.current) {

                    if (props.cssProperty === 'transform') {

                        if (props.initialAttributeValue.split('(')[0] === 'scale') {
                            animationDiv.current.style.transform = `scale(${styleAttributeValue})`; 
                        }
                        else {
                            animationDiv.current.style.transform = `${props.initialAttributeValue.split('(', 1)}(${styleAttributeValue}${unit})`; 
                        }
                    }
                    else {
                        animationDiv.current.setAttribute(props.cssProperty, `${styleAttributeValue}${unit}`);
                    }

                    // Change opacity if fade in function is passed in 
                    if (props.onAnimationEnd) {
                        props.onAnimationEnd();
                    }
                }

                // Break loop if positionIndex goes over 600. Animation only has 600 frames
                if (index <= 600) {
                    requestAnimationFrame(animate);
                }
            };

            // Trigger animation
            if (props.start) {
                setTimeout(animate, props.animationDelay);
            }

        }, [props.start]);

        //Return
        return <div
            className="animation-container"
            ref={animationDiv}
        >
            {props.children}
        </div>;
    };
