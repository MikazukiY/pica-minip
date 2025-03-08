import dayjs from "dayjs";

export function HandleImg({ path }: { path: string }) {
  const fileServer = "https://s3.picacomic.com";
  // path = path.replace("tobs/", "")
  const imgURL = fileServer + "/static/" + path;
  return imgURL;
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (
      !entry.isIntersecting ||
      !(entry.target instanceof HTMLImageElement) ||
      !entry.target.hasAttribute("data-src")
    ) {
      return;
    }
    const ds = entry.target.getAttribute("data-src");
    if (ds) {
      entry.target.src = ds;
    }
    observer.unobserve(entry.target);
  });
});

export function LazyLoad(
  dom: HTMLElement,
  onload?: (this: GlobalEventHandlers, ev: Event) => any
) {
  if (onload) {
    dom.onload = onload;
  } else {
    dom.onload = (e) => {
      e && e.target && ((e.target as HTMLElement).style.opacity = "1");
    };
  }
  observer.observe(dom);
}

export function Unobserve(dom: HTMLElement) {
  observer.unobserve(dom);
}

export function GetTimeDescription(timeStr: string) {
  const time = dayjs(timeStr);
  const now = dayjs();
  const diff = now.diff(time, "second");

  if (diff < 60) {
    return `${diff}秒前`;
  } else if (diff < 60 * 60) {
    return `${(diff / 60).toFixed(0)}分前`;
  } else if (diff < 60 * 60 * 24 && now.day() === time.day()) {
    return time.format("今天HH:mm");
  } else if (diff < 60 * 60 * 24 * 2 && now.month() === time.month()) {
    return time.format("昨天HH:mm");
  } else if (time.year() !== now.year()) {
    return time.format("YYYY年MM月DD日 HH:mm");
  }
  return time.format("MM月DD日 HH:mm");
}

export function AllowZoom() {
  let viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    viewport.setAttribute("content", "width=device-width, initial-scale=1");
  }
}

export function LongPress(dom: HTMLElement, ts: number, callback: () => void) {
  if (!dom || !ts || !callback) return;
  let isMoved = false,
    isTouched = false;
  let timer: number;

  dom.addEventListener("touchstart", () => {
    isTouched = true;
    timer = setTimeout(() => {
      if (isMoved || !isTouched) return;
      callback();
    }, ts);
  });

  dom.addEventListener("touchmove", () => {
    isMoved = true;
    clearInterval(timer);
  });
  dom.addEventListener("touchend", () => {
    isMoved = false;
    isTouched = false;
    clearInterval(timer);
  });
}

export function tap(dom: HTMLElement, callback: () => void) {
  if (!dom || !callback) return;
  let isMoved = false,
    isTouched = false;
  let startX = 0;
  let startY = 0;

  dom.style.transition = "opacity ease .2s";
  dom.addEventListener("touchstart", (e) => {
    isTouched = true;
    dom.style.opacity = "0.7";
    const touch = e.targetTouches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  dom.addEventListener("touchmove", (e) => {
    isMoved = true;
    const touch = e.targetTouches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    // 计算距离
    const distanceX = currentX - startX;
    const distanceY = currentY - startY;
    const dis = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (dis > 10) {
      isTouched = false;
      isMoved = false;
      dom.style.opacity = "1";
    }
  });
  dom.addEventListener("touchend", () => {
    if (!isMoved && isTouched) {
      callback();
    }
    dom.style.opacity = "1";
    isMoved = false;
    isTouched = false;
  });
}
