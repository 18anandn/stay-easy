
export type Offset = {
  top: number;
  left: number;
};

export function calculatePopupPosition(
  containerWidth: number,
  containerHeight: number,
  markerWidth: number,
  markerHeight: number,
  markerLeft: number,
  markerTop: number,
  popupWidth: number,
  popupHeight: number,
  padding: number,
  popupHorizontalPadding: number,
  popupVerticalPadding: number,
): Offset {
  const markerPosX = markerLeft + markerWidth / 2;
  const markerPosY = markerTop + markerHeight / 2;
  const topDist = markerTop - (padding + popupHeight);
  const bottomDist =
    containerHeight - (markerTop + markerHeight + padding + popupHeight);
  const leftDist = markerLeft - (padding + popupWidth);
  const rightDist =
    containerWidth - (markerLeft + markerWidth + padding + popupWidth);
  const defaultPopupLeft = markerPosX - popupWidth / 2;
  const defaultPopupRight = containerWidth - markerPosX - popupWidth / 2;
  const defaultPopupTop = markerPosY - popupHeight / 2;
  const defaultPopupBottom = containerHeight - markerPosY - popupHeight / 2;

  let top = 0;
  let left = 0;
  if (topDist >= popupVerticalPadding || bottomDist >= popupVerticalPadding) {
    if (topDist >= bottomDist) {
      top = -1 * (padding + (popupHeight + markerHeight) / 2);
    } else {
      top = padding + (popupHeight + markerHeight) / 2;
    }
    if (
      defaultPopupLeft >= popupHorizontalPadding &&
      defaultPopupRight >= popupHorizontalPadding
    ) {
      left = 0;
    } else if (defaultPopupLeft >= popupHorizontalPadding) {
      left =
        containerWidth - (popupHorizontalPadding + popupWidth / 2) - markerPosX;
    } else if (defaultPopupRight >= popupHorizontalPadding) {
      left = popupHorizontalPadding + popupWidth / 2 - markerPosX;
    } else {
      left = containerWidth / 2 - markerPosX;
    }
  } else if (popupHeight + 2 * popupVerticalPadding >= containerHeight) {
    top = containerHeight / 2 - markerPosY;
    if (
      leftDist >= popupHorizontalPadding ||
      rightDist >= popupHorizontalPadding
    ) {
      if (leftDist >= rightDist) {
        left = -1 * (padding + (popupWidth + markerWidth) / 2);
      } else {
        left = padding + (popupWidth + markerWidth) / 2;
      }
    } else if (popupWidth + 2 * popupHorizontalPadding >= containerWidth) {
      left = containerWidth / 2 - markerPosX;
    } else if (
      defaultPopupLeft >= popupHorizontalPadding &&
      defaultPopupRight >= popupHorizontalPadding
    ) {
      left = 0;
    } else if (defaultPopupLeft >= defaultPopupRight) {
      left =
        containerWidth - (popupHorizontalPadding + popupWidth / 2) - markerPosX;
    } else {
      left = popupHorizontalPadding + popupWidth / 2 - markerPosX;
    }
  } else if (
    defaultPopupTop >= popupVerticalPadding ||
    defaultPopupBottom >= popupVerticalPadding
  ) {
    if (defaultPopupTop >= defaultPopupBottom) {
      top =
        containerHeight - popupVerticalPadding - popupHeight / 2 - markerPosY;
    } else {
      top = popupVerticalPadding + popupHeight / 2 - markerPosY;
    }
    if (
      leftDist >= popupHorizontalPadding ||
      rightDist >= popupHorizontalPadding
    ) {
      top =
        defaultPopupTop >= popupVerticalPadding &&
        defaultPopupBottom >= popupVerticalPadding
          ? 0
          : top;
      if (leftDist >= rightDist) {
        left = -1 * (padding + (popupWidth + markerWidth) / 2);
      } else {
        left = padding + (popupWidth + markerWidth) / 2;
      }
    } else if (popupWidth + 2 * popupHorizontalPadding >= containerWidth) {
      left = containerWidth / 2 - markerPosX;
    } else if (
      defaultPopupLeft >= popupHorizontalPadding &&
      defaultPopupRight >= popupHorizontalPadding
    ) {
      top =
        defaultPopupTop >= popupVerticalPadding &&
        defaultPopupBottom >= popupVerticalPadding
          ? 0
          : top;
      left = 0;
    } else if (defaultPopupLeft >= defaultPopupRight) {
      left =
        containerWidth - (popupHorizontalPadding + popupWidth / 2) - markerPosX;
    } else {
      left = popupHorizontalPadding + popupWidth / 2 - markerPosX;
    }
  } else {
    top = containerHeight / 2 - markerPosY;
    if (
      leftDist >= popupHorizontalPadding ||
      rightDist >= popupHorizontalPadding
    ) {
      if (leftDist >= rightDist) {
        left = -1 * (padding + (popupWidth + markerWidth) / 2);
      } else {
        left = padding + (popupWidth + markerWidth) / 2;
      }
    } else if (popupWidth + 2 * popupHorizontalPadding >= containerWidth) {
      left = containerWidth / 2 - markerPosX;
    } else if (defaultPopupLeft >= defaultPopupRight) {
      left =
        containerWidth - (popupHorizontalPadding + popupWidth / 2) - markerPosX;
    } else {
      left = popupHorizontalPadding + popupWidth / 2 - markerPosX;
    }
  }

  return { top, left };
}

// export function generateAnchorElem(
//   home: HomeInfo,
//   closeFunc: () => void,
// ): HTMLElement {
//   const anchorElem = document.createElement('a');
//   anchorElem.className = 'home-container';
//   anchorElem.href = `/home/${home.id}`;
//   anchorElem.target = '_blank';
//   const swiperFeature = document.createElement('div');
//   swiperFeature.className = 'swiper-container';
//   const swiperContainer = document.createElement('div');
//   swiperContainer.className = 'swiper';
//   const swiperWrapper = document.createElement('div');
//   swiperWrapper.className = 'swiper-wrapper';
//   const closeButton = document.createElement('div');
//   closeButton.className = 'close-button';
//   anchorElem.appendChild(closeButton);
//   const allImages = [home.main_image, ...home.extra_images];
//   for (const homeImage of allImages) {
//     const listElem = document.createElement('div');
//     listElem.className = 'swiper-slide';
//     const imageElem = document.createElement('img');
//     imageElem.src = homeImage;
//     imageElem.alt = '';
//     listElem.appendChild(imageElem);
//     swiperWrapper.appendChild(listElem);
//   }
//   swiperContainer.appendChild(swiperWrapper);
//   const swiperPagination = document.createElement('div');
//   swiperPagination.className = 'swiper-pagination';
//   const swiperButtonPrev = document.createElement('div');
//   swiperButtonPrev.className = 'swiper-button-prev';
//   const swiperButtonNext = document.createElement('div');
//   swiperButtonNext.className = 'swiper-button-next';
//   swiperContainer.appendChild(swiperButtonPrev);
//   swiperContainer.appendChild(swiperButtonNext);
//   swiperContainer.appendChild(swiperPagination);
//   swiperContainer.appendChild(swiperWrapper);
//   swiperFeature.appendChild(swiperContainer);
//   anchorElem.appendChild(swiperFeature);
//   const infoElem = document.createElement('div');
//   infoElem.className = 'info';
//   const nameElem = document.createElement('h3');
//   nameElem.textContent = home.name;
//   infoElem.appendChild(nameElem);
//   const locationElem = document.createElement('p');
//   locationElem.textContent = `${home.city}, ${home.country}`;
//   infoElem.appendChild(locationElem);
//   const priceElem = document.createElement('p');
//   priceElem.textContent = `${moneyFormatter(home.price)} night`;
//   infoElem.appendChild(priceElem);
//   anchorElem.appendChild(infoElem);

//   const swiper = new Swiper(swiperContainer, {
//     // Optional parameters
//     direction: 'horizontal',
//     // loop: true,
//     modules: [Navigation, Pagination, Mousewheel],
//     // If we need pagination
//     mousewheel: {
//       forceToAxis: true,
//     },
//     pagination: {
//       enabled: true,
//       el: swiperPagination,
//       dynamicBullets: true,
//     },

//     // Navigation arrows
//     navigation: {
//       enabled: true,
//       nextEl: swiperButtonNext,
//       prevEl: swiperButtonPrev,
//     },

//     // And if we need scrollbar
//     // scrollbar: {
//     //   el: '.swiper-scrollbar',
//     // },
//   });

//   // swiperFeature.addEventListener('click', (event) => {
//   //   event.stopPropagation();
//   //   event.preventDefault();
//   // });

//   closeButton.addEventListener(
//     'click',
//     (event) => {
//       event.preventDefault();
//       event.stopPropagation();
//       closeFunc();
//     },
//     // { capture: true },
//   );
//   return anchorElem;
// }

