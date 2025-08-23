import AnimatedText from "components/animate-text";
import { useStore } from "hooks/use-store";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { fbButton, tw } from "vanilla-sharing";
import facebookImg from "./facebook.svg";
import twitterImg from "./twitter.svg";

const ShareMenuDiv = styled.div`
  /*   display: flex;
  align-items: center; */

  /* overflow: hidden; */
  position: absolute;
  height: 75px;
  top: 30px;
  right: 30px;
  /*   border: 1px solid red; */

  .cta {
    display: "block";
    position: absolute;
    top: 13px;
    right: 125px;
    font-family: "Neue Machina";
    font-weight: normal;
    font-size: 1.2em;
    margin-right: 5px;
    text-align: right;
    white-space: nowrap;
    @media (max-width: 768px) {
      display: none;
    }
  }

  .icon {
    display: inline-block;
    background-color: transparent;
    width: 45px;
    height: 45px;
    border-radius: 200px;
    overflow: hidden;
    transition: background-color 0.4s;
    cursor: pointer;

    @media (max-width: 768px) {
      width: 29px;
      height: 29px;
    }

    img {
      position: relative;
      top: 4px;
      left: 4px;
      height: 37px;

      @media (max-width: 768px) {
        top: 2px;
        left: 2px;
        height: 25px;
      }
    }

    &:not(:first-child) {
      margin-left: 15px;
      @media (max-width: 768px) {
        margin-left: 6px;
      }
    }

    &:hover {
      background-color: black;
      transition: background-color 0.005s;
      img {
        filter: invert(100%);
      }
    }
  }
`;

const ShareMenu = observer(() => {
  const store = useStore();
  /*   const opacity = useSpring({ opacity: store.activeId ? 1 : 0 }); */

  const share = (service) => {
    let contentItem = null;
    if (store.activeId) contentItem = toJS(store.activeItem);
    let title = contentItem
      ? `Story Line: messages from a pandemic - ${contentItem.text.name} - ${contentItem.text.location}`
      : "Story Line: messages from a pandemic";
    if (service === "twitter") {
      tw({
        url: window.location,
        title: title,
      });
    } else if (service === "facebook") {
      // Note: facebook doesn't like sharing urls with localhost, this will work when deployed
      fbButton({
        url: window.location,
      });
    }
  };

  return (
    <ShareMenuDiv>
      <AnimatedText className="cta" animate={store.activeId ? "in" : "out"}>
        Share this story
      </AnimatedText>
      <div className="icon">
        <img
          draggable="false"
          src={twitterImg}
          alt="Share to Twitter"
          onClick={() => share("twitter")}
        />
      </div>
      <div className="icon">
        <img
          draggable="false"
          src={facebookImg}
          alt="Share to Facebook"
          onClick={() => share("facebook")}
        />
      </div>
    </ShareMenuDiv>
  );
});

export default ShareMenu;
