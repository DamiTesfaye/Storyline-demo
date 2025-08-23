import issues from "services/issues";
import { create as createMap } from "math/map";
import { Chance } from "chance";

const lookup = new WeakMap();

const getSource = (el, context) => {
  if (lookup.has(el)) return lookup.get(el);
  const source = context.createMediaElementSource(el);
  lookup.set(el, source);
  return source;
};

class Analyser {
  constructor() {
    window.AudioContext =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext;
    this.context = new AudioContext();
  }

  setEl(el) {
    if (el == this.el) return;

    const context = this.context;

    const source = getSource(el, this.context);

    const nodes = {
      source,
      analyser: context.createAnalyser(),
    };

    //nodes.analyser.fftSize = 1024;
    const bufferLength = nodes.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    nodes.source.connect(nodes.analyser);
    nodes.source.connect(context.destination);

    this.nodes = nodes;
    this.el = el;
  }

  release() {
    console.log("release");
    const nodes = this.nodes;
    nodes.source.disconnect();
    nodes.analyser.disconnect();
  }

  resume() {
    if (this.context /* && this.context.state === "suspended" */) {
      this.context.resume();
    }
  }

  destroy() {
    if (this.context) {
      const { nodes, context } = this;

      nodes.source.disconnect();
      nodes.analyser.disconnect();
      context.destination.disconnect();

      context.close().then(() => {});
      this.nodes = this.context = null;
    }

    this.el = null;
  }

  get audioData() {
    if (!this.context) return [0, 0];
    this.nodes.analyser.getByteFrequencyData(this.dataArray);
    const audioData = Array.from(this.dataArray);
    return audioData.map((v) => v / 128);
  }
}

class FakeAnalyser {
  constructor() {
    this.step = 0;
    this.map = createMap(-1, 1, 0, 1);
  }

  setEl() {
    const chance = new Chance();
    this.step = Math.random() * 1000;
    const keys = ["wave1", "wave2", "wave3"];
    this.params = {};
    keys.forEach((key) => {
      this.params[key] = {
        size: chance.floating({ min: 0.1, max: 2 }),
        stepFactor: chance.floating({ min: 0.05, max: 0.15 }),
        stepOffset: chance.integer({ min: 1, max: 1000 }),
      };
    });
  }

  resume() {}

  destroy() {}

  get audioData() {
    let fake = new Array(1024).fill(null);
    fake = fake.map((v, i) => {
      const wave1 = this.map(Math.sin(i * 0.1 + this.step * 0.1 + 7));
      const wave2 = this.map(Math.sin(i * 0.25 + this.step * 0.05 + 6.1));
      const wave3 = this.map(Math.cos(i * 3 + this.step * 0.15 + 1.4));
      return wave1 * 0.5 + wave2 * 0.1 + wave3 * 0.3;
    });
    this.step++;
    return fake;
  }
}

const analyserClass = issues.WEBAUDIO_AVAILABLE ? Analyser : FakeAnalyser;
export default new analyserClass();
