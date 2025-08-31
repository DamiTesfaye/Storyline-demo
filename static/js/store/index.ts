import { action, computed, observable } from "mobx";

export class AppStore {
  @observable appReady: boolean = false;
  @observable activeId: string = "";
  @observable activePosition: any = null;
  @observable content: any = [];
  @observable showUI: boolean = false;
  @observable isDragging: boolean = false;
  @observable isHovering: boolean = false;
  @observable hoverId: string = "";
  @observable hasDragged: boolean = false;
  @observable mediaProgress: number = 0;
  @observable autoplay: string = "pending";
  @observable cameraHintId: string | null = null;
  @observable cameraTransitionHint: string | null = null;
  @observable cameraBounds: any = null;
  @observable showHomeCursor: boolean = false;
  @observable requestHome: boolean = false;

  @computed get activeItemType(): string | null {
    let contentType: string | null = null;
    if (this.activeId) {
      contentType = this.content.video.find(
        (element) => element.id === this.activeId
      )
        ? "video"
        : "audio";
    }
    return contentType;
  }

  @computed get activeItem(): any {
    let contentItem = this.content[this.activeItemType as any].find(
      (item: any) => item.id === this.activeId
    );
    return contentItem;
  }

  @computed get hoverItemType(): string | null {
    let contentType: string | null = null;
    if (this.hoverId) {
      contentType = this.content.video.find(
        (element) => element.id === this.hoverId
      )
        ? "video"
        : "audio";
    }
    return contentType;
  }

  @computed get hoverItem(): any {
    if (!this.hoverId) return null;
    let contentItem = this.content[this.hoverItemType as any].find(
      (item: any) => item.id === this.hoverId
    );
    return contentItem;
  }

  @action
  setAppReady(flag: boolean) {
    this.appReady = flag;
  }

  @action
  setIsDragging(flag: boolean) {
    this.isDragging = flag;
  }

  @action
  setActiveId(newId: string) {
    this.activeId = newId;
  }

  @action
  setActivePosition(newPosition: any) {
    this.activePosition = newPosition;
  }

  @action
  setContent(newContent: any) {
    this.content = newContent;
  }

  @action
  setShowUI(flag: boolean) {
    this.showUI = flag;
  }

  @action
  setHover(flag: boolean, id: string) {
    this.isHovering = flag;
    this.hoverId = id;
  }

  @action
  setHasDragged(flag: boolean) {
    this.hasDragged = flag;
  }

  @action
  setMediaProgress(progress: number) {
    this.mediaProgress = progress;
  }

  @action
  setAutoplayState(val: string) {
    this.autoplay = val;
  }

  @action
  setCameraHintId(id: string | null) {
    this.cameraHintId = id;
  }

  @action
  setCameraTransitionHint(type: string | null) {
    this.cameraTransitionHint = type;
  }

  @action
  setCameraBounds(bounds: any) {
    this.cameraBounds = bounds;
  }

  @action
  setShowHomeCursor(value: boolean) {
    this.showHomeCursor = value;
  }

  @action
  setRequestHome(value: boolean) {
    this.requestHome = value;
  }
}
