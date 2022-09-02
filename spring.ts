export function spring(
        frame:number,
        springContant: number,
        dampingRatio: number,
        initalAttributeValue: number,
        finalAttributeValue: number
    ) {
        const springModel = (
            frame: number,
            springConstant: number,
            dampingRatio: number
        ) => {
            // Assuming majority of screen run at a frequency of 60hz, we can assume the frame rate will 1/60
            const frameRate = 1 / 60;

            // Set the initial velocity and spring length. This will always be both 0.
            let currentSpringLength = 0;
            let currentVelocity = 0;

            let i = 0;

            // loop to find the displacement of our virtual spring between 1 and 0 at the given frame
            while (i < frame) {
                const springForce = -springConstant * (currentSpringLength - 1);
                const dampingForce = -dampingRatio * currentVelocity;

                const acceleration = springForce + dampingForce;

                currentVelocity += acceleration * frameRate;
                currentSpringLength += currentVelocity * frameRate;

                i++;
            }

            //Return
            return currentSpringLength;
        };

        // Linear interpolation. Calculates the position/value between two points at a given frame
        const lerp = (start: number, end: number, springModelLength: number) => {
          
            const position = start + springModelLength * (end - start);

            return position;
        };

        // Set start and end points to output values for the key-frames. Define our model spring
        const start: number = initalAttributeValue;
        const end: number = finalAttributeValue;

        // Calculate the position at the given frame from the two input start and final attributes
        const position = lerp(start, end, springModel(frame, springContant, dampingRatio));

        //Return
        return position;
    }
