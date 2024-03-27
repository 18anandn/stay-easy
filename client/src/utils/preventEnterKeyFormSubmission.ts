export const preventEnterKeyFormSubmission: React.KeyboardEventHandler<
  HTMLFormElement
> = (event) => {
  if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
    event.preventDefault();
  }
};
