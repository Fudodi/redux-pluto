import React, { ReactNode } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import Counter from "../Counter";

type Props = { children: ReactNode };

export default function Footer(props: Props) {
  const today = format(new Date(), "yyyy/MM/dd");
  const { children } = props;

  return (
    <Root>
      <div>
        <Counter />
        <Today>{today}</Today>
        <div>duplicate</div>
        <div>{children}</div>
      </div>
    </Root>
  );
}

const Root = styled.footer`
  border-color: lightgrey;
  border-width: 1px;
  border-style: solid;
  padding: 10px;
`;

const Today = styled.div`
  text-align: center;
`;
