import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { radios } from "@storybook/addon-knobs";

import { Phrase, RealText as Text, SkeletonGroup } from "../src/";
import { Story, colors } from "./helpers/styles";

const HeaderButton = styled.button`
  width: 100%;
`;

const Nav = styled.aside`
  grid-area: L_nav;
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.li`
  border: 1px solid ${colors.darkBlue};
  padding: 1rem;
  width: 100%;

  &:not(:first-child) {
    border-top: none;
  }
`;

const NavLink = styled.a`
  color: ${colors.darkBlue};
  display: flex;
  font-size: 1.4rem;
  text-decoration: none;
  white-space: nowrap;
  width: 100%;
`;

const Content = styled.section`
  font-size: 2rem;
  grid-area: L_content;
  padding: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-areas:
    "L_header L_header"
    "L_nav L_content";
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr 2fr;
  margin: 2rem;
  width: auto;

  @media (min-width: 900px) {
    margin-left: auto;
    margin-right: auto;
    width: 900px;
  }

  ${NavLink}, ${Content} {
    line-height: 1.5;
  }
`;

const Header = styled.header`
  display: flex;
  grid-area: L_header;

  & :not(:last-child) {
    margin-right: 2rem;
  }
`;

const data = [
  // First set:
  {
    "Danaus plexipus": `
        Milkweed butterflies are the most common of this type of butterfly
        and is found in what's termed the Old and New World tropics. Two
        exceptions are the monarch butterfly (q.v.) and the queen butterfly.
        Both live in temperate regions.
    `,
    Heliconians: `
        This is mainly a tropical butterfly family and can be found in Old
        World and New World tropic regions.
    `,
    "Common skippers": `
        These small to medium butterflies are part of the Superfamily
        Hesperioidea and populate the world. However, they mostly congregate
        in the tropics. Out of 3,500 species, there are 275 in North
        America. Many of these are concentrated in Texas and Arizona.
    `,
  },
  // Second set:
  {
    "Snout butterflies": `
        These butterflies are found all over the world but there aren't
        many species within this family.
    `,
    "Gossamer-winged": `
        There are over 5,000 species of this small to medium sized
        butterfly. They have several names such as hairstreaks, coppers,
        harvesters, blues, and metal marks. Most prefer tropical habitats;
        however, 145 species can be found in the United States.
    `,
    "Giant skippers": `
        This North American family of skipper butterflies is known for being
        strong-flying. They are typically considered a subfamily of
        Hesperiidae.
    `,
  },
  // Third set:
  {
    "Brush-footed butterflies": `
        This butterfly family has around 6,000 species divided into 12
        subfamilies and 40 tribes and found throughout the world in most
        habitats.
    `,
    Swallowtails: `
        There are around 550 species with the majority being swallowtail.
        Most of these are found in tropical regions as well as other
        regionals around the world except Antarctica.
    `,
    Parnassians: `
        They are in the alpine or arctic group and found in America's Rocky
        Mountains and Alaska.
    `,
  },
];

export default function LoadingTransitions() {
  const loadSpeed = parseFloat(
    radios("Loading speed (seconds)", { "0.5": "0.5", "3": "3", "5": "5" }, "5")
  );

  const initialDataIndex = -1;

  const [isLoading, setLoadingState] = useState<boolean>(false);
  const [isLoadingContent, setLoadingContentState] = useState<boolean>(false);
  const [dataIndex, setDataIndex] = useState<number>(initialDataIndex);
  const [contentKey, setContentKey] = useState<string>("");

  const loadNextSet = () => {
    setLoadingState(true);
    setTimeout(() => {
      let i = dataIndex + 1;
      if (i >= data.length) {
        i = 0;
      }
      setDataIndex(i);
      setContentKey(Object.keys(data[i])[0]);
      setLoadingState(false);
    }, loadSpeed * 1000);
  };

  const loadContentKey = (key: string) => {
    setLoadingContentState(true);
    setTimeout(() => {
      setContentKey(key);
      setLoadingContentState(false);
    }, loadSpeed * 1000);
  };

  useEffect(() => {
    loadNextSet();
  }, [loadSpeed]);

  const seeInitial = () => {
    setDataIndex(initialDataIndex);
    loadNextSet();
  };

  const info: { [key: string]: string | undefined } | undefined =
    dataIndex >= 0 ? data[dataIndex] : {};
  const content = info ? info[contentKey] : undefined;

  return (
    <Story>
      <SkeletonGroup
        borderRadius="0.4rem"
        color={colors.lightBlue}
        showSkeletons={isLoading}
      >
        <Grid>
          <Header>
            <HeaderButton onClick={seeInitial}>
              See Initial Loading State
            </HeaderButton>
            <HeaderButton onClick={loadNextSet}>Load Next Set</HeaderButton>
          </Header>
          <Nav>
            <NavList>
              {Object.keys(info).map((key) => {
                return (
                  <NavItem key={key}>
                    <NavLink
                      onClick={(event) => {
                        loadContentKey(key);
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      href="#"
                    >
                      <Phrase>{key}</Phrase>
                    </NavLink>
                  </NavItem>
                );
              })}
            </NavList>
          </Nav>
          <Content>
            <SkeletonGroup showSkeletons={isLoading || isLoadingContent}>
              <Text>{content}</Text>
            </SkeletonGroup>
          </Content>
        </Grid>
      </SkeletonGroup>
    </Story>
  );
}