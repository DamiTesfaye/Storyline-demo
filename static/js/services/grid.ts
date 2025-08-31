// @ts-nocheck
import * as THREE from "three";
import * as _ from "lodash";
import Chance from "chance";

const intersectsBoxes = (target, boxes) => {
  const result = boxes.filter((box) => {
    if (target.intersectsBox(box)) return box;
  });
  return result;
};

export class Grid {
  constructor(stepSize, seed) {
    this.stepSize = stepSize;
    this.seed = seed;
    this.clear();
  }

  clear() {
    this.boxes = [];
    this.partitions = [];
    this.position = { x: 0, y: 0 };
    this.delta = { x: 0, y: this.stepSize };
    this.segmentLength = 1;
    this.segmentPassed = 0;
    this.chance = new Chance(this.seed);
  }

  assignPosition() {
    const { position, delta } = this;
    position.x += delta.x;
    position.y += delta.y;
    this.segmentPassed += 1;

    if (this.segmentPassed >= this.segmentLength) {
      // done with current segment
      this.segmentPassed = 0;

      // 'rotate' directions
      let buffer = delta.y;
      delta.y = -delta.x;
      delta.x = buffer;

      // increase segment length if necessary
      if (delta.x == 0) {
        this.segmentLength++;
      }
    }

    /*     const jiggle = {
      x: chance.integer({ min: -2, max: 2 }),
      y: chance.integer({ min: -2, max:2 })
    }; */

    const jiggle = {
      x: 0,
      y: 0,
    };

    return new THREE.Vector2(position.x + jiggle.x, position.y + jiggle.y);
  }

  addBox(size) {
    const position = this.assignPosition();
    const box = new THREE.Box2(
      new THREE.Vector2(position.x - size.x * 0.5, position.y - size.y * 0.5),
      new THREE.Vector2(position.x + size.x * 0.5, position.y + size.y * 0.5)
    );
    this.boxes.push(box);
    return box.getCenter(new THREE.Vector2());
  }

  stepNulls(num = 1) {
    for (let i = 0; i <= num; i++) {
      this.assignPosition();
    }
  }

  stepRandomNulls(min = 0, max = 2) {
    this.stepNulls(this.chance.integer({ min, max }));
  }

  getBounds() {
    const bounds = new THREE.Box2();
    this.boxes.forEach((box) => {
      if (box.min.x < bounds.min.x) bounds.min.x = box.min.x;
      if (box.min.y < bounds.min.y) bounds.min.y = box.min.y;
      if (box.max.x > bounds.max.x) bounds.max.x = box.max.x;
      if (box.max.y > bounds.max.y) bounds.max.y = box.max.y;
    });
    return bounds;
  }

  computePartitions() {
    const scanHeight = 1;
    const bounds = this.getBounds();
    const scan = new THREE.Box2(
      new THREE.Vector2(bounds.min.x, bounds.min.y),
      new THREE.Vector2(bounds.max.x, bounds.min.y + scanHeight)
    );
    while (scan.max.y < bounds.max.y) {
      scan.min.y += scanHeight;
      scan.max.y += scanHeight;
      const scan0Height = scan.clone();
      const c = scan0Height.getCenter(new THREE.Vector2());
      scan0Height.min.y = c.y;
      scan0Height.max.y = c.y;
      const intersecting = intersectsBoxes(scan0Height, this.boxes);
      const sortedIntersecting = intersecting.sort((a, b) => {
        const aCenter = a.getCenter(new THREE.Vector2());
        const bCenter = b.getCenter(new THREE.Vector2());
        return aCenter.x < bCenter.x ? -1 : 1;
      });
      if (sortedIntersecting.length <= 0) {
        this.addPartition(scan.clone());
      }
      sortedIntersecting.forEach((box, i) => {
        let partition;
        if (i == 0) {
          partition = new THREE.Box2(
            new THREE.Vector2(scan.min.x, scan.min.y),
            new THREE.Vector2(box.min.x, scan.max.y)
          );
          this.addPartition(partition);
        } else if (i > 0) {
          const prevBox = sortedIntersecting[i - 1];
          partition = new THREE.Box2(
            new THREE.Vector2(prevBox.max.x, scan.min.y),
            new THREE.Vector2(box.min.x, scan.max.y)
          );
          this.addPartition(partition);
          if (i >= sortedIntersecting.length - 1) {
            partition = new THREE.Box2(
              new THREE.Vector2(box.max.x, scan.min.y),
              new THREE.Vector2(scan.max.x, scan.max.y)
            );
            this.addPartition(partition);
          }
        }
      });
    }
  }

  addPartition(partition) {
    if (partition) {
      const size = partition.getSize(new THREE.Vector2());
      if (size.x > 0) this.partitions.push(partition);
    }
  }

  subDividePartitions(minWidth) {
    const f = (partition) => {
      const size = partition.getSize(new THREE.Vector2());
      if (size.x > minWidth) return partition;
    };
    let validPartitions = this.partitions.filter(f);
    while (validPartitions.length > 0) {
      _.pullAll(this.partitions, validPartitions);
      validPartitions.forEach((partition) => {
        const size = partition.getSize(new THREE.Vector2());
        const bias = this.chance.random();
        const splitSize = Math.floor(size.x * bias);
        const split = [
          new THREE.Box2(
            partition.min,
            new THREE.Vector2(partition.min.x + splitSize, partition.max.y)
          ),
          new THREE.Box2(
            new THREE.Vector2(partition.min.x + splitSize, partition.min.y),
            new THREE.Vector2(partition.max.x, partition.max.y)
          ),
        ];
        this.partitions.push(...split);
      });
      validPartitions = this.partitions.filter(f);
    }
  }

  allocateRandomPartitions(num, minWidth = 0) {
    let count = 0;
    const all = this.partitions.filter((partition) => {
      const size = partition.getSize(new THREE.Vector2());
      if (size.x > minWidth) return partition;
    });
    const allocated = [];
    while (count <= num) {
      const random = all.splice(
        this.chance.integer({ min: 0, max: all.length }),
        1
      );
      allocated.push(...random);
      count++;
    }
    this.partitions = _.pullAll(this.partitions, allocated);
    return allocated;
  }
}

export default Grid;
