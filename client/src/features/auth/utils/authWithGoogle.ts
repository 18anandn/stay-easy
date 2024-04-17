
export const authWithGoogle = () => {
  const popupHeight = 600;
  const popupWidth = 600;
  const popupUrl = '/auth/google';
  window.open(
    popupUrl,
    '_blank',
    `height=${popupHeight}, width=${popupWidth}, top=${
      window.outerHeight / 2 - popupHeight / 2
    }, left=${window.outerWidth / 2 - popupWidth / 2}`
  );
};
