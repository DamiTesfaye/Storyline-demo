import Line from "components/horizontal-line";
import { default as React, useMemo } from "react";

const Lines = () => {
  return (
    <group>
      {(() => {
        const num = 70;
        const spacing = 1;
        let absY = 0;
        let y = 0;
        return new Array(num).fill().map((val, i) => {
          if (i !== 0) {
            const sign = i % 2 === 0 ? 1 : -1;
            if (sign === 1) absY += spacing;
            y = absY * sign;
          }
          return <Line key={i} position={[0, y, 0]} />;
        });
      })()}
    </group>
  );
};

export default Lines;
