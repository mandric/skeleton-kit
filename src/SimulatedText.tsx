import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import InvisibleText from "./InvisibleText";
import Skeleton from "./Skeleton";
import { addStyleProps } from "./util/styleUtils";

const RefSpan = styled.span`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

type StyleProps = {
  children?: React.ReactNode;
  className?: string;
  pixelHeight?: number;
  pixelWidth?: number;
};

const RecreatedSpan = addStyleProps<StyleProps>()(styled(RefSpan))`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: ${(props) => `${props.pixelHeight}px`};
  justify-content: space-evenly;
  width: ${(props) => `${props.pixelWidth}px`};
`;

const Line = styled.span`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SkeletonLine = styled(Skeleton)`
  height: 0.8em;
  line-height: 1;
  // TODO: randomize
  width: 100%;
`;

type Props = {
  children: string;
  className?: string;
  asSkeleton?: boolean;
};

export default function SimulatedText({
  asSkeleton = false,
  children,
  className,
}: Props) {
  if (!asSkeleton) {
    return <>{children}</>;
  }

  const [lineHeight, setLineHeight] = useState<null | number>(null);
  const [boxHeight, setBoxHeight] = useState<null | number>(null);
  const [boxWidth, setBoxWidth] = useState<null | number>(null);
  const shell = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (shell && shell.current) {
      setLineHeight(
        parseFloat(
          window
            .getComputedStyle(shell.current, null)
            .getPropertyValue("line-height")
        )
      );
      const rect = shell.current.getBoundingClientRect();
      setBoxHeight(rect.height);
      setBoxWidth(rect.width);
    }
  }, [shell]);

  // if (boxWidth && boxHeight && lineHeight) {
  //   console.log("Computed box height:", boxHeight);
  //   console.log("Computed box width:", boxWidth);
  //   console.log("Computed line height:", lineHeight);
  // }

  if (boxWidth && boxHeight && lineHeight) {
    console.log("Computed box height:", boxHeight);
    console.log("Computed box width:", boxWidth);
    console.log("Computed line height:", lineHeight);
    // TODO: check rounding
    return (
      <RecreatedSpan
        className={className}
        pixelHeight={boxHeight}
        pixelWidth={boxWidth}
      >
        {new Array(Math.round(boxHeight / lineHeight))
          .fill(1)
          .map((item, idx) => (
            <Line key={`${boxHeight}-${boxWidth}-${idx}`}>
              <SkeletonLine />
            </Line>
          ))}
      </RecreatedSpan>
    );
  }

  return (
    <RefSpan className={className} ref={shell}>
      <InvisibleText>{children}</InvisibleText>
    </RefSpan>
  );
}