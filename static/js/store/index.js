import { action, computed, observable } from "mobx";

export class AppStore {
  @observable appReady = false;
  @observable activeId = "";
  @observable activePosition = null;
  @observable content = [];
  @observable showUI = false;
  @observable isDragging = false;
  @observable isHovering = false;
  @observable hoverId = "";
  @observable hasDragged = false;
  @observable mediaProgress = 0;
  @observable autoplay = "pending";
  @observable cameraHintId = null;
  @observable cameraTransitionHint = null;
  @observable cameraBounds = null;
  @observable showHomeCursor = false;
  @observable requestHome = false;

  @computed get activeItemType() {
    let contentType = null;
    if (this.activeId) {
      contentType = this.content.video.find(
        (element) => element.id === this.activeId
      )
        ? "video"
        : "audio";
    }
    return contentType;
  }

  @computed get activeItem() {
    let contentItem = this.content[this.activeItemType].find(
      (item) => item.id === this.activeId
    );
    return contentItem;
  }

  @computed get hoverItemType() {
    let contentType = null;
    if (this.hoverId) {
      contentType = this.content.video.find(
        (element) => element.id === this.hoverId
      )
        ? "video"
        : "audio";
    }
    return contentType;
  }

  @computed get hoverItem() {
    if (!this.hoverId) return null;
    let contentItem = this.content[this.hoverItemType].find(
      (item) => item.id === this.hoverId
    );
    return contentItem;
  }

  @action
  setAppReady(flag) {
    this.appReady = flag;
  }

  @action
  setIsDragging(flag) {
    this.isDragging = flag;
  }

  @action
  setActiveId(newId) {
    this.activeId = newId;
  }

  @action
  setActivePosition(newPosition) {
    this.activePosition = newPosition;
  }

  @action
  setContent(newContent) {
    this.content = newContent;
  }

  @action
  setShowUI(flag) {
    this.showUI = flag;
  }

  @action
  setHover(flag, id) {
    this.isHovering = flag;
    this.hoverId = id;
  }

  @action
  setHasDragged(flag) {
    this.hasDragged = flag;
  }

  @action
  setMediaProgress(progress) {
    this.mediaProgress = progress;
  }

  @action
  setAutoplayState(val) {
    this.autoplay = val;
  }

  @action
  setCameraHintId(id) {
    this.cameraHintId = id;
  }

  @action
  setCameraTransitionHint(type) {
    this.cameraTransitionHint = type;
  }

  @action
  setCameraBounds(bounds) {
    this.cameraBounds = bounds;
  }

  @action
  setShowHomeCursor(value) {
    this.showHomeCursor = value;
  }

  @action
  setRequestHome(value) {
    this.requestHome = value;
  }
}
