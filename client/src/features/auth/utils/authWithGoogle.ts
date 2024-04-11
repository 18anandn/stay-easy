
export const authWithGoogle = () => {
  const popupHeight = 600;
  const popupWidth = 600;
  const popupUrl = '/api/v1/auth/google?state=sdvsdvsdbvsbv';
  window.open(
    popupUrl,
    '_blank',
    `height=${popupHeight}, width=${popupWidth}, top=${
      window.outerHeight / 2 - popupHeight / 2
    }, left=${window.outerWidth / 2 - popupWidth / 2}`
  );
};
