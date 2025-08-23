import Chance from "chance";
import { useStore } from "hooks/use-store";
import { easeOutCubic, easeOutQuint } from "math/map";
import { toJS } from "mobx";
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";
import angry from "./angry.svg";
import happy from "./happy.svg";
import love from "./love.svg";
import sad from "./sad.svg";
import shocked from "./shocked.svg";
import thankful from "./thankful.svg";

const FilterMenuDiv = animated(styled.div`
  display: block;
  position: absolute;
  bottom: 30px;
  left: 30px;
  z-index: 100;
  overflow-x: hidden;
  height: 40px;

  @media (max-width: 1000px) {
    display: none;
  }

  .content {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    white-space: pre;

    .cta {
      font-family: "Neue Machina";
      font-weight: normal;
      font-size: 1.2em;
      margin-right: 18px;
    }

    .emoji {
      background-color: transparent;
      width: 31px;
      height: 31px;
      border-radius: 200px;
      overflow: hidden;
      transition: background-color 0.4s;
      margin-right: 10px;

      img {
        cursor: pointer;
        height: 35px;
        transform: translate(-2px, -2px);
      }

      &:hover {
        background-color: black;
        transition: background-color 0.005s;
        img {
          filter: invert(100%);
        }
      }
    }
  }
`);

const FilterMenu = (props) => {
  const history = useHistory();
  const store = useStore();
  const content = useRef();

  const goToRandomStory = (moods) => {
    const chance = new Chance();

    // Data for all stories, regardless of media type
    //const storiesAll = toJS(store.content).flat();
    const storiesAll = [
      ...toJS(store.content.video),
      ...toJS(store.content.audio),
    ];

    // Some emojis are related to multiple moods. ie. frowny might reflect sad
    // or angry, so pick one mood only
    const mood = chance.pickone(moods);

    // Find the stories that match the requested mood
    const storiesOfMood = storiesAll.filter((item) => item.mood.includes(mood));

    // And the lucky winner is...
    const story = chance.pickone(storiesOfMood);

    if (story) {
      // Ensure the camera doesn't try to move to a previously clicked item
      store.setCameraHintId(null);
      // Start the new story
      history.push(story.id);
    }
  };

  const [style, setStyle] = useSpring(() => {
    return {
      width: 0,
      config: { duration: 800, easing: easeOutQuint },
    };
  });

  const [opacity, setOpacity] = useSpring(() => {
    return {
      opacity: 0,
      config: { duration: 500, easing: easeOutCubic },
    };
  });

  useEffect(() => {
    if (props.animate == "in") {
      setStyle({ width: content.current.clientWidth });
      setOpacity({ opacity: 1 });
    } else {
      setStyle({ width: 0 });
      setOpacity({
        opacity: 0,
        delay: 100,
        config: { duration: 50 },
      });
    }
  }, [props.animate]);

  return (
    <FilterMenuDiv
      style={{
        width: style.width,
        opacity: opacity.opacity,
      }}
    >
      <div className="content" ref={content}>
        <span className="cta">Take me to a story of</span>

        <div className="emoji">
          <img
            draggable="false"
            src={happy}
            alt="happy"
            onClick={() => {
              goToRandomStory(["happy"]);
            }}
          />
        </div>

        <div className="emoji">
          <img
            draggable="false"
            src={sad}
            alt="Sad or sick"
            onClick={() => {
              goToRandomStory(["sad"]);
            }}
          />
        </div>

        <div className="emoji">
          <img
            draggable="false"
            src={angry}
            alt="Angry"
            onClick={() => {
              goToRandomStory(["angry"]);
            }}
          />
        </div>

        <div className="emoji">
          <img
            draggable="false"
            src={shocked}
            alt="Shocked"
            onClick={() => {
              goToRandomStory(["shocked"]);
            }}
          />
        </div>

        <div className="emoji">
          <img
            draggable="false"
            src={thankful}
            alt="Hopeful or thankful"
            onClick={() => {
              goToRandomStory(["hopeful", "thankful"]);
            }}
          />
        </div>

        <div className="emoji">
          <img
            draggable="false"
            src={love}
            alt="Love"
            onClick={() => {
              goToRandomStory(["love"]);
            }}
          />
        </div>
      </div>
    </FilterMenuDiv>
  );
};

export default FilterMenu;
